"use client";

import { useForm } from "@formspree/react";
import { CONTACT } from "@/content/story";

/**
 * Formspree takes the enquiry and forwards it to the Centaim mailbox.
 *
 * The form ID is public by design — it is an inbox address, not a
 * credential — so this needs no environment variable and no secret in the
 * deploy. Submissions and the forwarding address are managed in the
 * Formspree dashboard, not here.
 */
const FORMSPREE_FORM_ID = "mqeargpo";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

/**
 * Submitted through Formspree's own client.
 *
 * Read the note on `_subject` below before touching the hidden fields —
 * the form spent a while accepting enquiries and delivering none, and the
 * cause is not something the response body will ever tell you.
 *
 * `useForm` is the integration this form was created for and the one the
 * pre-revamp site used, so it owns the request rather than a hand-rolled
 * fetch. Both were measured delivering; this one is simply the client
 * Formspree maintains, so protocol changes are their problem.
 *
 * It is AJAX, so the visitor never leaves the page and never sees
 * Formspree's "Thanks!" screen. `action` and `method` stay on the form for
 * the no-JS fallback.
 */

const fieldClass =
  "w-full rounded-lg border border-gunmetal-rim/60 bg-void-lift px-4 py-3.5 text-[15px] text-paper " +
  "placeholder:text-faint/70 transition-colors hover:border-gunmetal-rim " +
  "focus:border-aim focus:outline-none focus-visible:outline-none";

export function Contact({ sent }: { sent?: "ok" }) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

  // `sent` is the no-JS fallback coming back with ?sent=1.
  const status: "idle" | "sending" | "ok" | "error" = state.submitting
    ? "sending"
    : state.succeeded || sent === "ok"
      ? "ok"
      : state.errors
        ? "error"
        : "idle";

  return (
    <section
      id="contact"
      className="rule-top px-4 py-28 sm:px-8 sm:py-36"
      aria-labelledby="contact-h"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <h2 id="contact-h" className="display-tight text-[length:var(--text-beat)]">
            {CONTACT.headline}
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
            {CONTACT.body}
          </p>

          <div className="mt-14">
            <p className="font-display text-xs tracking-[0.3em] text-faint uppercase">
              {CONTACT.directHeading}
            </p>
            <p className="mt-5 flex flex-col gap-3">
              <a
                href={CONTACT.phone.href}
                className="w-fit text-xl text-paper transition-colors hover:text-aim-live"
              >
                {CONTACT.phone.display}
              </a>
              <a
                href={CONTACT.email.href}
                className="w-fit text-xl text-paper transition-colors hover:text-aim-live"
              >
                {CONTACT.email.display}
              </a>
            </p>
          </div>
        </div>

        <div>
          {status === "ok" && (
            <p
              role="status"
              className="mb-8 rounded-lg border border-aim/50 bg-aim/10 px-5 py-4 text-[15px] text-aim-live"
            >
              Landed. We&apos;ll come back to you within one business day.
            </p>
          )}
          {status === "error" && (
            // Only shown when the submit genuinely failed, so it never
            // dresses a failure up as a success. Re-sending rarely helps,
            // so it hands over the direct route as well.
            <p
              role="alert"
              className="mb-8 rounded-lg border border-cta/60 bg-cta/10 px-5 py-4 text-[15px] text-paper"
            >
              That didn&apos;t send. Please try again, or reach us directly at{" "}
              <a
                href={CONTACT.email.href}
                className="underline underline-offset-4 transition-colors hover:text-aim-live"
              >
                {CONTACT.email.display}
              </a>
              .
            </p>
          )}

          <form
            action={FORMSPREE_ENDPOINT}
            method="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/*
              Only `_subject`. Do not add `_next`, and do not add `_gotcha`.

              `_next` sets a custom redirect, which is a paid feature. On a
              free form it does not simply get ignored — when a REAL BROWSER
              sends it, the submission is accepted, answered {"ok":true},
              and no notification email is ever sent. It cost this site
              every enquiry it received until it was found. Measured, nine
              submissions, one variable at a time:

                            _next sent    no _next
                curl           sent         sent
                browser      DROPPED        sent

              Either condition alone is harmless, which is what made it so
              hard to see: the same field tests clean from a script, and the
              response body is identical in all four cases.

              `_gotcha` is Formspree's honeypot, left out for a related
              reason. A filled honeypot is also answered {"ok":true} and
              then binned, and Chrome's autofill does reach hidden fields —
              it was filling the previous off-screen one. Formspree's own
              spam filtering runs on every plan. Spam is a nuisance; a lead
              that vanishes without a trace is not.
            */}
            <input type="hidden" name="_subject" value="New enquiry — centaim.com" />

            <div className="grid gap-6 sm:grid-cols-2">
              {CONTACT.fields.map((field) => (
                <div
                  key={field.name}
                  className={field.name === "name" ? "sm:col-span-2" : undefined}
                >
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-muted"
                  >
                    {field.label}
                    {!field.required && (
                      <span className="ml-1.5 text-faint">(optional)</span>
                    )}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    className={fieldClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label
                htmlFor={CONTACT.messageField.name}
                className="mb-2 block text-sm font-medium text-muted"
              >
                {CONTACT.messageField.label}
              </label>
              <textarea
                id={CONTACT.messageField.name}
                name={CONTACT.messageField.name}
                rows={5}
                required={CONTACT.messageField.required}
                className={`${fieldClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-fit rounded-full bg-aim px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-aim-mid disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : CONTACT.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
