import { Fragment } from "react";

// One CMS entry per visual line, joined with <br> like the original markup.
export const Lines = ({ lines }: { lines?: string[] | null }) => (
  <>
    {(lines ?? []).map((line, index) => (
      <Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </Fragment>
    ))}
  </>
);
