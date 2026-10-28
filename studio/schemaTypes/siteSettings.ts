import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";
import { linkFields } from "./shared/link";

const socialUrl = (name: string, title: string) =>
  defineField({ name, title, type: "url", description: "Leave empty to hide the icon." });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "navCtaLabel",
      title: "Navbar button label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO & sharing",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Browser tab / search title", type: "string" }),
        defineField({ name: "description", title: "Search description", type: "text", rows: 3 }),
        defineField({ name: "ogTitle", title: "Share title", type: "string" }),
        defineField({ name: "ogDescription", title: "Share description", type: "text", rows: 3 }),
        defineField({
          name: "ogImage",
          title: "Share image",
          type: "image",
          description: "Shown when the site is shared on social media. Cropped to 1200×630.",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "footer",
      type: "object",
      fields: [
        defineField({ name: "learnHeading", type: "string" }),
        defineField({
          name: "learnLinks",
          type: "array",
          of: [defineArrayMember({ type: "object", name: "footerLink", fields: linkFields() })],
        }),
        defineField({ name: "connectHeading", type: "string" }),
        defineField({
          name: "socials",
          type: "object",
          fields: [socialUrl("linkedin", "LinkedIn"), socialUrl("x", "X"), socialUrl("instagram", "Instagram")],
        }),
        defineField({ name: "copyright", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
