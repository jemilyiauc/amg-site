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

// Shape of the CMS document: any field may be missing or null.
export type DeepPartialNullable<T> = {
  [K in keyof T]?: T[K] extends string ? string | null : DeepPartialNullable<T[K]> | null;
};

const pick = (cms: string | null | undefined, fallback: string) => (cms?.trim() ? cms : fallback);

const pickField = (cms: DeepPartialNullable<FieldCopy> | null | undefined, fallback: FieldCopy): FieldCopy => ({
  label: pick(cms?.label, fallback.label),
  placeholder: pick(cms?.placeholder, fallback.placeholder),
});

export function withRequestAccessDefaults(
  cms: DeepPartialNullable<RequestAccessContent> | null | undefined,
): RequestAccessContent {
  const d = REQUEST_ACCESS_DEFAULTS;
  return {
    title: pick(cms?.title, d.title),
    intro: pick(cms?.intro, d.intro),
    name: pickField(cms?.name, d.name),
    company: pickField(cms?.company, d.company),
    email: pickField(cms?.email, d.email),
    note: pickField(cms?.note, d.note),
    optInText: pick(cms?.optInText, d.optInText),
    submitLabel: pick(cms?.submitLabel, d.submitLabel),
    sendingLabel: pick(cms?.sendingLabel, d.sendingLabel),
    errorMessage: pick(cms?.errorMessage, d.errorMessage),
    successTitle: pick(cms?.successTitle, d.successTitle),
    successBody: pick(cms?.successBody, d.successBody),
  };
}
