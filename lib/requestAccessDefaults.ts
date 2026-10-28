type FieldCopy = { label: string; placeholder: string };

export type RequestAccessContent = {
  title: string;
  intro: string;
  name: FieldCopy;
  company: FieldCopy;
  email: FieldCopy;
  note: FieldCopy;
  optInText: string;
  submitLabel: string;
  sendingLabel: string;
  errorMessage: string;
  successTitle: string;
  successBody: string;
};

// Today's live copy. Used whenever the CMS document or one of its fields is missing.
export const REQUEST_ACCESS_DEFAULTS: RequestAccessContent = {
  title: "Request Access",
  intro: "Tell us a bit about yourself and we'll be in touch.",
  name: { label: "Name", placeholder: "Your full name" },
  company: { label: "Company", placeholder: "Your company or organization" },
  email: { label: "Email", placeholder: "your@email.com" },
  note: { label: "Note", placeholder: "What would you like us to know?" },
  optInText:
    "I agree to receive email communications from Artest Management Group. I can unsubscribe at any time.",
  submitLabel: "Submit",
  sendingLabel: "Sending…",
  errorMessage: "Something went wrong. Please try again.",
  successTitle: "Request received",
  successBody: "We'll review your information and be in touch shortly.",
};
