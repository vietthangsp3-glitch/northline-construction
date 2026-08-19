"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";

const initialState: InquiryState = { status: "idle", message: "" };

interface InquiryFormProps {
  variant: "contact" | "quote";
}

function FieldError({ state, name, id }: { state: InquiryState; name: string; id: string }) {
  const error = state.fieldErrors?.[name]?.[0];
  return error ? <span className="form-field__error" id={id}>{error}</span> : null;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="inquiry-form__submit" type="submit" disabled={pending}>{pending ? "Sending..." : label}<span aria-hidden="true">&nearr;</span></button>;
}

export function InquiryForm({ variant }: InquiryFormProps) {
  const [state, formAction] = useActionState(submitInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const isQuote = variant === "quote";

  useEffect(() => {
    if (state.status !== "error") return;
    const invalidField = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
    if (invalidField) invalidField.focus();
    else statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return <div className="form-success" role="status"><span>Thank you</span><h2>Message received.</h2><p>{state.message}</p></div>;
  }

  const invalid = (name: string) => Boolean(state.fieldErrors?.[name]);

  return (
    <form ref={formRef} className="inquiry-form" action={formAction} noValidate>
      <input type="hidden" name="formType" value={variant} />
      <div className="form-honeypot" aria-hidden="true"><label htmlFor={variant + "-website"}>Company website</label><input id={variant + "-website"} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" /></div>

      <div className="form-field"><label htmlFor={variant + "-name"}>Your name <span>*</span></label><input id={variant + "-name"} name="name" type="text" autoComplete="name" required maxLength={100} aria-invalid={invalid("name")} aria-describedby={invalid("name") ? variant + "-name-error" : undefined} /><FieldError state={state} name="name" id={variant + "-name-error"} /></div>
      <div className="form-field"><label htmlFor={variant + "-email"}>Email address <span>*</span></label><input id={variant + "-email"} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} aria-invalid={invalid("email")} aria-describedby={invalid("email") ? variant + "-email-error" : undefined} /><FieldError state={state} name="email" id={variant + "-email-error"} /></div>
      <div className="form-field"><label htmlFor={variant + "-phone"}>Phone number</label><input id={variant + "-phone"} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} aria-invalid={invalid("phone")} aria-describedby={invalid("phone") ? variant + "-phone-error" : undefined} /><FieldError state={state} name="phone" id={variant + "-phone-error"} /></div>
      <div className="form-field"><label htmlFor={variant + "-company"}>Company</label><input id={variant + "-company"} name="company" type="text" autoComplete="organization" maxLength={120} /></div>

      {isQuote && (
        <>
          <div className="form-field"><label htmlFor="quote-project-type">Project type <span>*</span></label><select id="quote-project-type" name="projectType" required aria-invalid={invalid("projectType")} aria-describedby={invalid("projectType") ? "quote-project-type-error" : undefined}><option value="">Select a project type</option><option value="Commercial">Commercial</option><option value="Residential">Residential</option><option value="Hospitality">Hospitality</option><option value="Healthcare">Healthcare</option><option value="Corporate">Corporate</option><option value="Renovation">Renovation</option></select><FieldError state={state} name="projectType" id="quote-project-type-error" /></div>
          <div className="form-field"><label htmlFor="quote-budget">Anticipated budget <span>*</span></label><select id="quote-budget" name="budget" required aria-invalid={invalid("budget")} aria-describedby={invalid("budget") ? "quote-budget-error" : undefined}><option value="">Select a range</option><option value="Under $5 million">Under $5 million</option><option value="$5 million - $20 million">$5 million - $20 million</option><option value="$20 million - $75 million">$20 million - $75 million</option><option value="$75 million - $200 million">$75 million - $200 million</option><option value="$200 million+">$200 million+</option></select><FieldError state={state} name="budget" id="quote-budget-error" /></div>
          <div className="form-field"><label htmlFor="quote-location">Project location <span>*</span></label><input id="quote-location" name="location" type="text" required maxLength={120} aria-invalid={invalid("location")} aria-describedby={invalid("location") ? "quote-location-error" : undefined} /><FieldError state={state} name="location" id="quote-location-error" /></div>
          <div className="form-field"><label htmlFor="quote-timeline">Anticipated timeline</label><input id="quote-timeline" name="timeline" type="text" maxLength={120} placeholder="For example: Q2 2027 start" /></div>
        </>
      )}

      <div className="form-field form-field--wide"><label htmlFor={variant + "-message"}>{isQuote ? "Tell us about the project" : "How can we help?"} <span>*</span></label><textarea id={variant + "-message"} name="message" rows={6} required maxLength={2000} aria-invalid={invalid("message")} aria-describedby={invalid("message") ? variant + "-message-error" : undefined} /><FieldError state={state} name="message" id={variant + "-message-error"} /></div>

      <div className="inquiry-form__footer"><p>By submitting this form, you agree to our <a href="/privacy">Privacy Policy</a>.</p><SubmitButton label={isQuote ? "Submit Project Inquiry" : "Send Message"} /></div>
      {state.status === "error" && <p ref={statusRef} className="inquiry-form__status" role="alert" tabIndex={-1}>{state.message}{state.code === "delivery_unavailable" && <> <a href="mailto:hello@northlinebuild.com">Email hello@northlinebuild.com</a>.</>}</p>}
    </form>
  );
}
