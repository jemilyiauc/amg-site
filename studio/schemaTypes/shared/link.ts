import { defineField } from "sanity";

// Link targets here are in-site paths and fragments ("/", "#request-access"),
// which Sanity's `url` type rejects without awkward allowRelative gymnastics.
// A plain string with guidance is the honest fit. A factory, not a shared
// array: Sanity processes schema definitions, so reusing one instance risks
// cross-contamination.
export const linkFields = () => [
  defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
  defineField({
    name: "href",
    title: "Link",
    type: "string",
    description: 'e.g. /, https://…, or #request-access to open the Request Access form',
    validation: (rule) =>
      rule
        .required()
        .regex(/^(\/|#|https?:\/\/|mailto:|tel:)/, { name: "link", invert: false })
        .error("Must start with /, #, https://, http://, mailto: or tel:"),
  }),
];
