export type ApproachContent = { label?: string | null; body?: string | null } | null;

export const ApproachSection = ({ approach }: { approach: ApproachContent }) => (
  <section id="approach">
    <span className="section-label">{approach?.label}</span>
    <p>{approach?.body}</p>
  </section>
);
