import { contentfulClient } from '../config/client';

export const entryHandlers = {
  createEntry: async (args: any) => {
    const entry = await contentfulClient.entry.create({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      contentTypeId: args.contentTypeId,
      fields: args.fields
    });
    return { content: [{ type: "text", text: JSON.stringify(entry, null, 2) }] };
  },

  getEntry: async (args: any) => {
    const entry = await contentfulClient.entry.get({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      entryId: args.entryId
    });
    return { content: [{ type: "text", text: JSON.stringify(entry, null, 2) }] };
  },

  updateEntry: async (args: any) => {
    const entry = await contentfulClient.entry.update({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      entryId: args.entryId,
      fields: args.fields
    });
    return { content: [{ type: "text", text: JSON.stringify(entry, null, 2) }] };
  },

  deleteEntry: async (args: any) => {
    await contentfulClient.entry.delete({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      entryId: args.entryId
    });
    return { content: [{ type: "text", text: `Entry ${args.entryId} deleted successfully` }] };
  },

  publishEntry: async (args: any) => {
    const entry = await contentfulClient.entry.publish({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      entryId: args.entryId
    });
    return { content: [{ type: "text", text: JSON.stringify(entry, null, 2) }] };
  },

  unpublishEntry: async (args: any) => {
    const entry = await contentfulClient.entry.unpublish({
      spaceId: args.spaceId,
      environmentId: args.environmentId || "master",
      entryId: args.entryId
    });
    return { content: [{ type: "text", text: JSON.stringify(entry, null, 2) }] };
  }
};