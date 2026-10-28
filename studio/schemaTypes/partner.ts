import { defineType, defineField } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";
import { orderRankField } from "@sanity/orderable-document-list";

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "Used as the logo's alt text.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      description: "Transparent PNG or SVG works best.",
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: "partner" }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});
