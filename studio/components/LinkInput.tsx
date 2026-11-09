import { useState } from "react";
import { set, unset, type StringInputProps } from "sanity";
import { Select, Stack, TextInput } from "@sanity/ui";
import { REQUEST_ACCESS_HREF, SITE_LINKS } from "../schemaTypes/shared/siteLinks";

type Choice = { href: string; title: string };

const OUTSIDE = "__outside__";
const OPEN_FORM = "Open the Request Access form";

// A dropdown of the site's sections, plus "Link outside the site…", which
// shows a box for pasting a full URL. Saves the chosen link as a plain string.
function SiteLinkInput({
  value,
  onChange,
  readOnly,
  choices,
  emptyLabel,
}: StringInputProps & { choices: Choice[]; emptyLabel: string }) {
  // The box shows for any saved value that isn't a dropdown choice, so a link
  // typed before the dropdown existed (e.g. "#") stays visible and editable.
  // "picked" keeps it open between choosing "outside" and pasting a URL, and
  // while a URL is cleared and retyped.
  const [picked, setPicked] = useState(false);
  const outside = picked || Boolean(value && !choices.some((choice) => choice.href === value));

  return (
    <Stack gap={2}>
      <Select
        disabled={readOnly}
        value={outside ? OUTSIDE : (value ?? "")}
        onChange={(event) => {
          const href = event.currentTarget.value;
          setPicked(href === OUTSIDE);
          onChange(href && href !== OUTSIDE ? set(href) : unset());
        }}
      >
        <option value="">{emptyLabel}</option>
        {choices.map((choice) => (
          <option key={choice.href} value={choice.href}>
            {choice.title}
          </option>
        ))}
        <option value={OUTSIDE}>Link outside the site…</option>
      </Select>
      {outside && (
        <TextInput
          readOnly={readOnly}
          value={value ?? ""}
          placeholder="Paste a link, e.g. https://artesteducationfoundation.org/join-our-community"
          onChange={(event) => {
            const url = event.currentTarget.value.trim();
            onChange(url ? set(url) : unset());
          }}
        />
      )}
    </Stack>
  );
}

// A footer link: it must go somewhere, and opening the form is one choice.
export const LinkInput = (props: StringInputProps) => (
  <SiteLinkInput
    {...props}
    choices={[{ href: REQUEST_ACCESS_HREF, title: OPEN_FORM }, ...SITE_LINKS]}
    emptyLabel="Choose where it goes…"
  />
);

// A button's link: left empty, the button opens the form, as it did before
// buttons had links.
export const CtaLinkInput = (props: StringInputProps) => (
  <SiteLinkInput {...props} choices={SITE_LINKS} emptyLabel={OPEN_FORM} />
);
