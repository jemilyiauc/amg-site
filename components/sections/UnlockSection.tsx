import { Lines } from "@/components/ui/Lines";

export type UnlockContent = { headingLines?: string[] | null; items?: string[] | null } | null;

export const UnlockSection = ({ unlock }: { unlock: UnlockContent }) => (
  <section id="unlock">
    <h2>
      <Lines lines={unlock?.headingLines} />
    </h2>
    <ul>
      {(unlock?.items ?? []).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </section>
);
