import { defineField } from "sanity";
import { CtaLinkInput, LinkInput } from "../../components/LinkInput";

// Links are stored as plain strings ("/", "/#approach", "https://…") because
// the site is one page: its destinations are its sections (shared/siteLinks.ts),
// not documents. LinkInput shows the string as a dropdown of those sections
// plus "Link outside the site…".

// Every value saved before the dropdown existed ("/", "#", "#request-access",
// https://…) still matches, so no existing document becomes unpublishable.
const VALID_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/;

const checkLink = (value: string | undefined) =>
  !value || VALID_LINK.test(value) ? true : "Paste a full link starting with https://";

// A button's link. Left empty, the button opens the Request Access form.
export const ctaLinkField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description:
      "Left on “Open the Request Access form”, the button opens the pop-up form. If the form is turned off, a button with no link is hidden.",
    components: { input: CtaLinkInput },
    validation: (rule) => rule.custom(checkLink),
  });

// A factory, not a shared array: Sanity processes schema definitions, so
// reusing one instance risks cross-contamination.
export const linkFields = () => [
  defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
  defineField({
    name: "href",
    title: "Link",
    type: "string",
    components: { input: LinkInput },
    validation: (rule) => rule.required().custom(checkLink),
  }),
];
