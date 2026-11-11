"use client";

import { useEffect, useState } from "react";
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

/**
 * The one line that goes out on both channels, written in the enquirer's
 * own voice because it arrives as a WhatsApp message from them:
 *
 *     It's NAME, I'm looking for a SERVICE delivering it in TIMELINE.
 *     You can reach out by my email too EMAIL.
 *
 * It is the mail subject, a `summary` field in the Formspree payload, and
 * the whole body of the WhatsApp message. Change it in one place only.
 *
 * Empty until all four parts are in, because the server renders this form
 * with nothing answered and the no-JS path posts whatever is in the markup
 * — a sentence full of holes in the subject line helps nobody. That path
 * still carries every answer in its own named field, so nothing is lost.
 */
function summarise(answers: Answers) {
  const [name, service, timeline, email] = [
    answers.name,
    answers.service,
    answers.timeline,
    answers.email,
  ].map((part) => part.trim());

  if (!name || !service || !timeline || !email) return "";

  return `It's ${name}, I'm looking for a ${service} delivering it in ${timeline}. You can reach out by my email too ${email}.`;
}

interface Answers {
  service: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
}

const EMPTY: Answers = { service: "", timeline: "", name: "", phone: "", email: "" };

const CHOICE_STEPS = CONTACT.choiceSteps.length;
/** Both choice questions, then the details panel. */
const TOTAL_STEPS = CHOICE_STEPS + 1;

const fieldClass =
  "w-full rounded-lg border border-gunmetal-rim/60 bg-void-lift px-4 py-3.5 text-[15px] text-paper " +
  "placeholder:text-faint/70 transition-colors hover:border-gunmetal-rim " +
  "focus:border-aim focus:outline-none focus-visible:outline-none";

export function Contact({ sent }: { sent?: "ok" }) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  // `sent` is the no-JS fallback coming back with ?sent=1.
  const status: "idle" | "sending" | "ok" | "error" = state.submitting
    ? "sending"
    : state.succeeded || sent === "ok"
      ? "ok"
      : state.errors
        ? "error"
        : "idle";

  const summary = summarise(answers);
  const subject = summary || "New enquiry — centaim.com";
  const waHref = `https://wa.me/${CONTACT.whatsapp.number}?text=${encodeURIComponent(summary)}`;

  /**
   * The WhatsApp hand-off.
   *
   * wa.me opens the visitor's own WhatsApp with the message pre-typed and
   * addressed to us; they still press send. There is no way to post to a
   * WhatsApp number from the browser without the Cloud API and a server to
   * hold its token, so this is the honest version: the mail is the delivery
   * that is guaranteed, and WhatsApp is the fast lane on top of it.
   *
   * Opened here rather than on click because the submit has to succeed
   * first. Browsers may block a window this far from the gesture, so the
   * success panel always shows the link as well — that button is the
   * reliable path and this is the convenience.
   */
  useEffect(() => {
    if (!state.succeeded || !summary) return;
    window.open(waHref, "_blank", "noopener,noreferrer");
    // Fires once per successful submit; waHref is frozen by then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded]);

  function choose(name: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    // A tap on an option is also the answer to the question, so it moves
    // on by itself. Back is always there if it was the wrong tap.
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }

  function setField(name: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  }

  const stepReady =
    step < CHOICE_STEPS
      ? answers[CONTACT.choiceSteps[step].name as keyof Answers] !== ""
      : CONTACT.detailsStep.fields.every(
          (field) => !field.required || answers[field.name as keyof Answers].trim() !== "",
        );

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
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">{CONTACT.body}</p>

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

        {/*
          A flex column so the confirmation can take `my-auto` and settle in
          the middle of the row, level with the copy on the left, once the
          form it replaces is gone. The form itself has no auto margin, so
          it still starts at the top beside the heading.
        */}
        <div className="flex flex-col">
          {status === "ok" && (
            <div
              role="status"
              className="my-auto rounded-lg border border-aim/50 bg-aim/10 px-5 py-4 text-[15px] text-aim-live"
            >
              <p>Landed. We&apos;ll come back to you within one business day.</p>
              {summary !== "" && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-aim px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-aim-mid"
                >
                  Send it on WhatsApp too
                </a>
              )}
            </div>
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

          {status !== "ok" && (
            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
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
              <input type="hidden" name="_subject" value={subject} />
              {/* The agreed line, so the mail body carries it verbatim and
                  does not have to be reassembled from the fields. */}
              <input type="hidden" name="summary" value={summary} />

              {/*
                Every step is in the DOM from the start and the inactive ones
                are hidden with a class, not unmounted. Two reasons: a
                half-filled answer survives going Back, and the <noscript>
                rule in globals.css unhides the lot — so with JavaScript off
                this degrades to the plain long form it used to be, posting
                straight to Formspree, instead of a dead first step.
              */}
              <noscript>
                <style>{`.step-inactive{display:revert !important}.js-only{display:none !important}`}</style>
              </noscript>

              <p className="js-only font-display text-xs tracking-[0.3em] text-faint uppercase">
                Step {step + 1} of {TOTAL_STEPS}
              </p>

              {CONTACT.choiceSteps.map((choiceStep, index) => (
                <fieldset
                  key={choiceStep.name}
                  className={index === step ? "step" : "step step-inactive"}
                  aria-hidden={index === step ? undefined : true}
                >
                  <legend className="mb-5 text-lg text-paper">{choiceStep.question}</legend>
                  <div className="flex flex-col gap-3">
                    {choiceStep.options.map((option, optionIndex) => {
                      const selected =
                        answers[choiceStep.name as keyof Answers] === option;
                      const id = `${choiceStep.name}-${optionIndex}`;
                      return (
                        <label
                          key={option}
                          htmlFor={id}
                          className={
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-[15px] transition-colors " +
                            (selected
                              ? "border-aim bg-aim/10 text-paper"
                              : "border-gunmetal-rim/60 bg-void-lift text-muted hover:border-gunmetal-rim hover:text-paper")
                          }
                        >
                          <input
                            id={id}
                            type="radio"
                            name={choiceStep.name}
                            value={option}
                            checked={selected}
                            // Required on one control marks the whole radio
                            // group required, which is what the no-JS path
                            // needs. The stepper never reaches submit with
                            // one unanswered.
                            required={optionIndex === 0}
                            onChange={() =>
                              choose(choiceStep.name as keyof Answers, option)
                            }
                            // Inactive steps are display:none, and a hidden
                            // control cannot be focused — so it must not be
                            // in the tab order either.
                            tabIndex={index === step ? undefined : -1}
                            className="h-4 w-4 shrink-0 accent-aim"
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <fieldset
                className={step === CHOICE_STEPS ? "step" : "step step-inactive"}
                aria-hidden={step === CHOICE_STEPS ? undefined : true}
              >
                <legend className="mb-5 text-lg text-paper">
                  {CONTACT.detailsStep.question}
                </legend>
                <div className="flex flex-col gap-6">
                  {CONTACT.detailsStep.fields.map((field) => (
                    <div key={field.name}>
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
                        value={answers[field.name as keyof Answers]}
                        onChange={(event) =>
                          setField(field.name as keyof Answers, event.target.value)
                        }
                        tabIndex={step === CHOICE_STEPS ? undefined : -1}
                        className={fieldClass}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                    className="rounded-full border border-gunmetal-rim/60 px-6 py-3.5 text-sm font-medium text-muted transition-colors hover:border-gunmetal-rim hover:text-paper"
                  >
                    {CONTACT.back}
                  </button>
                )}
                {/*
                  Both buttons are always rendered and the wrong one is
                  hidden, for the same no-JS reason as the steps: with
                  JavaScript off the stepper is one long form and Submit is
                  the only button that makes sense, so `js-only` drops Next
                  and the <noscript> rule brings Submit back.

                  Next is type=button, so an unanswered step can never post.
                */}
                <button
                  type="button"
                  disabled={!stepReady}
                  onClick={() => setStep((prev) => prev + 1)}
                  tabIndex={step < CHOICE_STEPS ? undefined : -1}
                  className={
                    "js-only rounded-full bg-aim px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-aim-mid disabled:cursor-not-allowed disabled:opacity-60" +
                    (step < CHOICE_STEPS ? "" : " step-inactive")
                  }
                >
                  {CONTACT.next}
                </button>
                <button
                  type="submit"
                  // Only gated on the last step. It must render enabled on
                  // the server, because that is the markup the no-JS path
                  // gets, and there the browser's own `required` checks
                  // are what stand in for `stepReady`.
                  disabled={status === "sending" || (step === CHOICE_STEPS && !stepReady)}
                  tabIndex={step === CHOICE_STEPS ? undefined : -1}
                  className={
                    "rounded-full bg-aim px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-aim-mid disabled:cursor-not-allowed disabled:opacity-60" +
                    (step === CHOICE_STEPS ? "" : " step-inactive")
                  }
                >
                  {status === "sending" ? "Sending…" : CONTACT.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
