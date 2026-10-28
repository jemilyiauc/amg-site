export const SOCIAL_KEYS = ["linkedin", "x", "instagram"] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

type Socials = Partial<Record<SocialKey, string | null>> | null | undefined;

// Footer icons render only for networks Kate has filled in, in a fixed order.
export function visibleSocials(socials: Socials): { key: SocialKey; url: string }[] {
  return SOCIAL_KEYS.map((key) => ({ key, url: socials?.[key]?.trim() ?? "" })).filter((social) => social.url);
}
