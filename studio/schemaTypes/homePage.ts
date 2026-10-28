import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

const headingLines = (title = "Heading") =>
  defineField({
    name: "headingLines",
    title,
    type: "array",
    of: [{ type: "string" }],
    description: "One entry per line.",
    validation: (rule) => rule.required().min(1),
  });

const required = (name: string, type: "string" | "text", extra: { title?: string; description?: string } = {}) =>
  defineField({ name, type, ...extra, validation: (rule) => rule.required() });

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "hero",
      type: "object",
      fields: [
        headingLines(),
        required("subheading", "text"),
        required("ctaLabel", "string", { title: "Button label" }),
      ],
    }),
    defineField({
      name: "portfolio",
      title: "Portfolio & partners",
      type: "object",
      description: "Logos are managed under Partners.",
      fields: [required("heading", "string")],
    }),
    defineField({
      name: "curated",
      title: "Curated by",
      type: "object",
      description: "Cards are managed under Team Members.",
      fields: [required("heading", "string")],
    }),
    defineField({
      name: "approach",
      title: "Our approach",
      type: "object",
      fields: [required("label", "string"), required("body", "text")],
    }),
    defineField({
      name: "unlock",
      title: "Unlock opportunities",
      type: "object",
      fields: [
        headingLines(),
        defineField({
          name: "items",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: "explore",
      title: "Explore alignment",
      type: "object",
      fields: [
        headingLines(),
        required("body", "text"),
        required("ctaLabel", "string", { title: "Button label" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
