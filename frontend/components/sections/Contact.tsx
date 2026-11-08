"use client";

import { useState } from "react";
import { CONTACT } from "@/content/story";

/**
 * Formspree takes the enquiry and forwards it to the Centaim mailbox.
 *
 * The form ID is public by design — it is an inbox address, not a
 * credential — so this needs no environment variable and no secret in the
 * deploy. Submissions and the forwarding address are managed in the
 * Formspree dashboard, not here.
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqeargpo";

/**
 * Submitted over fetch rather than as a browser navigation.
 *
 * A plain POST hands the page to Formspree, which on the free plan always
 * lands on its own "Thanks! The form was submitted successfully" screen —
 * a custom redirect, including the `_next` field, is a paid feature, so a
 * free-plan form cannot come back to us that way. An AJAX submit never
 * leaves the page at all, so the visitor stays on centaim.com and gets the
 * site's own confirmation. This is why the pre-revamp site used
 * @formspree/react; this is the same mechanism without the dependency.
 *
 * `action` and `method` are still set on the form, so with JavaScript off
 * it degrades to the plain POST and the enquiry is still delivered — the
 * visitor just sees Formspree's page instead of ours.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://centaim.com";

type Status = "idle" | "sending" | "ok" | "error";

const fieldClass =
  "w-full rounded-lg border border-gunmetal-rim/60 bg-void-lift px-4 py-3.5 text-[15px] text-paper " +
  "placeholder:text-faint/70 transition-colors hover:border-gunmetal-rim " +
  "focus:border-aim focus:outline-none focus-visible:outline-none";

export function Contact({ sent }: { sent?: "ok" }) {
  // `sent` is the no-JS path coming back with ?sent=1; everything after
  // that is driven by the fetch below.
  const [status, setStatus] = useState<Status>(sent === "ok" ? "ok" : "idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Only take over once we know fetch can do the job. If anything here
    // throws before this point the browser does the normal POST instead.
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      // Sent as JSON, not as the FormData multipart body, because that is
      // what @formspree/react posts — the integration this form was
      // created for and is known to have delivered under. Formspree
      // accepts both, but there is no reason to hand it a shape its own
      // client never sends.
      const payload = Object.fromEntries(new FormData(form).entries());

      /*
        The honeypot is decided here and never sent.

        Formspree answers a filled `_gotcha` with exactly the same
        {"ok":true} as a real submission, then discards it — so if anything
        ever puts a value in that box, a genuine enquiry disappears and the
        visitor is told it landed. The box is now display:none so autofill
        will not reach it, but the field is stripped regardless: there is
        no version of this where a hidden input gets to silently throw away
        a lead. Spam is a nuisance; a lost client is not.
      */
      const trapped = String(payload._gotcha ?? "").trim() !== "";
      delete payload._gotcha;
      if (trapped) {
        // A bot. Show the same success it would have got from Formspree,
        // so it learns nothing, and send nothing.
        form.reset();
        setStatus("ok");
        return;
      }
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          // Without this Formspree answers with a redirect to its own
          // thank-you page instead of JSON.
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error(`Formspree returned ${response.status}`);
      form.reset();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

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
            onSubmit={onSubmit}
            className="flex flex-col gap-6"
          >
            {/* Come back to our own page rather than Formspree's thank-you
                screen. Formspree requires this to be an absolute URL. */}
            <input type="hidden" name="_next" value={`${SITE_URL}/?sent=1#contact`} />
            {/* Subject line in the forwarded mail. */}
            <input type="hidden" name="_subject" value="New enquiry — centaim.com" />

            {/*
              Honeypot: hidden from people, irresistible to bots.

              `display:none`, NOT the usual trick of parking it off-screen
              at -9999px, and with no <label>. An off-screen field is still
              a real field to Chrome's autofill, and a label reading
              "Company" is exactly what its heuristics match to
              "organization" — `autocomplete="off"` does not stop it. So
              the browser was quietly filling this box with the visitor's
              own company, and Formspree answers a filled honeypot with the
              same {"ok":true} as a real submission and bins it. The form
              said "Landed." and nothing ever arrived. A honeypot that
              catches humans is worse than no honeypot at all.
            */}
            <div hidden>
              <input
                id="centaim-hp"
                name="_gotcha"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
            </div>

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
