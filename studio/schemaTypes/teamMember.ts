import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";
import { orderRankField } from "@sanity/orderable-document-list";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "role",
      type: "string",
      description: 'e.g. "Chief Technology Officer"',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "bio", type: "text", rows: 3 }),
    defineField({
      name: "photo",
      type: "image",
      description: "Cropped to a 3:4 portrait. Use the hotspot to keep the face in frame.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: "teamMember" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
