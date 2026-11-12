import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";

// Only the wording, and whether the form is on, are editable. The set of
// fields is fixed in code because the Google Sheet's columns depend on it.
// Empty fields fall back to the original copy.
const formField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      defineField({ name: "label", type: "string" }),
      defineField({ name: "placeholder", type: "string" }),
    ],
  });

export const requestAccessForm = defineType({
  name: "requestAccessForm",
  title: "Request Access Form",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "Turn on the pop-up form",
      type: "boolean",
      description:
        "When off, the form never opens, and any button still set to “Open the Request Access form” is hidden, so give those buttons a link first (Home Page and Site Settings). Until it's first switched, the form is on.",
      initialValue: true,
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    formField("name", "Name field"),
    formField("company", "Company field"),
    formField("email", "Email field"),
    formField("note", "Note field"),
    defineField({ name: "optInText", title: "Email opt-in text", type: "text", rows: 2 }),
    defineField({ name: "submitLabel", title: "Submit button", type: "string" }),
    defineField({ name: "sendingLabel", title: "Submit button while sending", type: "string" }),
    defineField({ name: "errorMessage", title: "Error message", type: "string" }),
    defineField({ name: "successTitle", title: "Success title", type: "string" }),
    defineField({ name: "successBody", title: "Success message", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Request Access Form" }) },
});
