"use client";

import { useEffect, useRef, useState } from "react";
import type { RequestAccessContent } from "@/lib/requestAccessDefaults";
import { useRequestAccess } from "./RequestAccessProvider";

type Status = "idle" | "sending" | "success" | "error";

export const RequestAccessModal = ({ content }: { content: RequestAccessContent }) => {
  const { isOpen, close } = useRequestAccess();
  const [status, setStatus] = useState<Status>("idle");
  const [wasOpen, setWasOpen] = useState(isOpen);
  const formRef = useRef<HTMLFormElement>(null);

  // Every open starts from a blank form, like the original showForm().
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setStatus("idle");
  }

  useEffect(() => {
    if (isOpen) formRef.current?.reset();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("success");
  };

  const isSuccess = status === "success";

  return (
    <div
      id="request-modal"
      className={`modal-overlay${isOpen ? " open" : ""}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Close" onClick={close}>
          &times;
        </button>
        <h2 id="modal-title" hidden={isSuccess}>
          {content.title}
        </h2>
        <p className="modal-sub" hidden={isSuccess}>
          {content.intro}
        </p>
        <form ref={formRef} className="modal-form" id="request-form" hidden={isSuccess} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="f-name">
              {content.name.label} <span className="required-star">*</span>
            </label>
            <input type="text" id="f-name" name="name" placeholder={content.name.placeholder} required />
          </div>
          <div className="form-group">
            <label htmlFor="f-company">{content.company.label}</label>
            <input type="text" id="f-company" name="company" placeholder={content.company.placeholder} />
          </div>
          <div className="form-group">
            <label htmlFor="f-email">
              {content.email.label} <span className="required-star">*</span>
            </label>
            <input type="email" id="f-email" name="email" placeholder={content.email.placeholder} required />
          </div>
          <div className="form-group">
            <label htmlFor="f-note">{content.note.label}</label>
            <textarea id="f-note" name="note" rows={4} placeholder={content.note.placeholder} />
          </div>
          <div className="form-group form-group-checkbox">
            <label className="checkbox-label" htmlFor="f-optin">
              <input type="checkbox" id="f-optin" name="optin" />
              <span>{content.optInText}</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary modal-submit" disabled={status === "sending"}>
            {status === "sending" ? content.sendingLabel : content.submitLabel}
          </button>
        </form>
        <div className="modal-success" hidden={!isSuccess}>
          {isSuccess && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
          )}
          <p className="modal-success-title">{content.successTitle}</p>
          <p className="modal-success-sub">{content.successBody}</p>
        </div>
      </div>
    </div>
  );
};
