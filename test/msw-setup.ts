import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Define handlers
export const handlers = [
  // List spaces
  http.get("https://api.contentful.com/spaces", () => {
    return HttpResponse.json({
      items: [
        {
          sys: { id: "test-space-id" },
          name: "Test Space",
        },
      ],
    });
  }),

  // Get specific space
  http.get("https://api.contentful.com/spaces/:spaceId", ({ params }) => {
    const { spaceId } = params;
    if (spaceId === "test-space-id") {
      return HttpResponse.json({
        sys: { id: "test-space-id" },
        name: "Test Space",
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // List environments
  http.get(
    "https://api.contentful.com/spaces/:spaceId/environments",
    ({ params }) => {
      const { spaceId } = params;
      if (spaceId === "test-space-id") {
        return HttpResponse.json({
          items: [
            {
              sys: { id: "master" },
              name: "master",
            },
          ],
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Create environment
  http.post(
    "https://api.contentful.com/spaces/:spaceId/environments",
    async ({ params, request }) => {
      const { spaceId } = params;
      if (spaceId === "test-space-id") {
        const envId = await request.text();
        return HttpResponse.json({
          sys: { id: envId },
          name: envId,
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Delete environment
  http.delete(
    "https://api.contentful.com/spaces/:spaceId/environments/:envId",
    ({ params }) => {
      const { spaceId, envId } = params;
      if (spaceId === "test-space-id" && envId !== "non-existent-env") {
        return new HttpResponse(null, { status: 204 });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),
];

const assetHandlers = [
  // Upload asset
  http.post(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets",
    async ({ request, params }) => {
      console.log("MSW: Handling asset creation request");
      const { spaceId } = params;
      if (spaceId === "test-space-id") {
        const body = (await request.json()) as {
          fields: {
            title: { "en-US": string };
            description?: { "en-US": string };
            file: {
              "en-US": {
                fileName: string;
                contentType: string;
                upload: string;
              };
            };
          };
        };

        return HttpResponse.json({
          sys: {
            id: "test-asset-id",
            version: 1,
            type: "Asset",
          },
          fields: body.fields,
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),
  // Process asset
  http.put(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId/files/en-US/process",
    ({ params }) => {
      console.log("MSW: Handling asset processing request");
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return HttpResponse.json({
          sys: {
            id: "test-asset-id",
            version: 2,
            publishedVersion: 1,
          },
          fields: {
            title: { "en-US": "Test Asset" },
            description: { "en-US": "Test Description" },
            file: {
              "en-US": {
                fileName: "test.jpg",
                contentType: "image/jpeg",
                url: "https://example.com/test.jpg",
              },
            },
          },
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Get asset
  http.get(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId",
    ({ params }) => {
      console.log("MSW: Handling get processed asset request");
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return HttpResponse.json({
          sys: {
            id: "test-asset-id",
            version: 2,
            type: "Asset",
            publishedVersion: 1,
          },
          fields: {
            title: { "en-US": "Test Asset" },
            description: { "en-US": "Test Description" },
            file: {
              "en-US": {
                fileName: "test.jpg",
                contentType: "image/jpeg",
                url: "https://example.com/test.jpg",
              },
            },
          },
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Update asset
  http.put(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId",
    ({ params }) => {
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return HttpResponse.json({
          sys: { id: "test-asset-id" },
          fields: {
            title: { "en-US": "Updated Asset" },
            description: { "en-US": "Updated Description" },
          },
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Delete asset
  http.delete(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId",
    ({ params }) => {
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return new HttpResponse(null, { status: 204 });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Publish asset
  http.put(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId/published",
    ({ params }) => {
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return HttpResponse.json({
          sys: {
            id: "test-asset-id",
            publishedVersion: 1,
          },
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Unpublish asset
  http.delete(
    "https://api.contentful.com/spaces/:spaceId/environments/:environmentId/assets/:assetId/published",
    ({ params }) => {
      const { spaceId, assetId } = params;
      if (spaceId === "test-space-id" && assetId === "test-asset-id") {
        return HttpResponse.json({
          sys: {
            id: "test-asset-id",
          },
        });
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),
];

const contentTypeHandlers = [
  // List content types
  http.get("https://api.contentful.com/spaces/:spaceId/environments/:environmentId/content_types", ({ params }) => {
    const { spaceId } = params;
    if (spaceId === "test-space-id") {
      return HttpResponse.json({
        items: [
          {
            sys: { id: "test-content-type-id" },
            name: "Test Content Type",
            fields: [
              {
                id: "title",
                name: "Title",
                type: "Text",
                required: true
              }
            ]
          }
        ]
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Get specific content type
  http.get("https://api.contentful.com/spaces/:spaceId/environments/:environmentId/content_types/:contentTypeId", ({ params }) => {
    const { spaceId, contentTypeId } = params;
    if (spaceId === "test-space-id" && contentTypeId === "test-content-type-id") {
      return HttpResponse.json({
        sys: { id: "test-content-type-id" },
        name: "Test Content Type",
        fields: [
          {
            id: "title",
            name: "Title",
            type: "Text",
            required: true
          }
        ]
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Create content type
  http.post("https://api.contentful.com/spaces/:spaceId/environments/:environmentId/content_types", async ({ params, request }) => {
    const { spaceId } = params;
    if (spaceId === "test-space-id") {
      const body = await request.json();
      return HttpResponse.json({
        sys: { id: "new-content-type-id" },
        ...body
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Update content type
  http.put("https://api.contentful.com/spaces/:spaceId/environments/:environmentId/content_types/:contentTypeId", async ({ params, request }) => {
    const { spaceId, contentTypeId } = params;
    if (spaceId === "test-space-id" && contentTypeId === "test-content-type-id") {
      const body = await request.json();
      return HttpResponse.json({
        sys: { id: contentTypeId },
        ...body
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Delete content type
  http.delete("https://api.contentful.com/spaces/:spaceId/environments/:environmentId/content_types/:contentTypeId", ({ params }) => {
    const { spaceId, contentTypeId } = params;
    if (spaceId === "test-space-id" && contentTypeId === "test-content-type-id") {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  })
];

// Setup MSW Server
export const server = setupServer(...handlers, ...assetHandlers, ...contentTypeHandlers);
