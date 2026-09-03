import { Meta, Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { createSignal, For, Show } from "solid-js";
import Button from "~/components/button/Button";
import Input from "~/components/input/Input";
import Icon, { type IconName } from "~/components/ui/Icon";
import PageHero from "~/components/ui/PageHero";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";
import { fullAddress, photos, site, travel } from "~/data/site";

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

const directions = [
  {
    icon: "plane" as IconName,
    title: "From NAIA, Manila",
    steps: [
      "Take a taxi or a ride-hail to the resort — around 2.5 to 3 hours.",
      "Or ride a Bataan-bound bus from Cubao or Pasay to Balanga.",
      "From Balanga, a jeepney or van runs to Morong in about an hour.",
    ],
  },
  {
    icon: "car" as IconName,
    title: "Driving yourself",
    steps: [
      "NLEX to SCTEX, exit at Dinalupihan.",
      "Follow the Roman Highway south, then the coastal road through Bagac.",
      "Turn at Nagbalayong; the resort gate is 1.2 km down Sitio Pasinay.",
    ],
  },
];

const contactLines: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  {
    icon: "phone",
    label: "Reservations",
    value: site.phone,
    href: `tel:${site.phone.replace(/\s/g, "")}`,
  },
  {
    icon: "phone",
    label: "Front desk",
    value: site.phoneAlt,
    href: `tel:${site.phoneAlt.replace(/\s/g, "")}`,
  },
  { icon: "globe", label: "Website", value: site.website },
  { icon: "pin", label: "Address", value: fullAddress },
];

export default function Contact() {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [subject, setSubject] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [sent, setSent] = createSignal(false);

  const emailLooksValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email());

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!firstName() || !lastName() || !email() || !subject() || !message()) {
      setError("Please fill in all fields so we can reply properly.");
      return;
    }

    if (!emailLooksValid()) {
      setError("That email address does not look right — please check it.");
      return;
    }

    setError(null);

    // No mail transport is wired up yet; log the payload so the shape is
    // visible while the backend endpoint is being built.
    console.log({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      subject: subject(),
      message: message(),
    });

    setSent(true);
  };

  return (
    <main>
      <Title>Contact Us — {site.name}</Title>
      <Meta
        name="description"
        content={`Reach the front desk at ${site.phone} or ${site.email}, and directions to ${fullAddress}.`}
      />

      <PageHero
        eyebrow="Get in touch"
        title="Contact us"
        description="Reservations, enquiries about events, or a question before you book — we usually reply the same day."
        image={photos.hero}
      />

      {/* --- Details + form ------------------------------------------------ */}
      <section class="section bg-sand-50">
        <div class="shell grid gap-14 lg:grid-cols-12">
          {/* Details */}
          <div class="lg:col-span-5">
            <SectionHeading
              eyebrow="Reach us"
              title="We are on the line from 7 AM to 10 PM"
              description="For same-day bookings, call rather than email — the front desk holds rooms by phone."
            />

            <Reveal delay={120} class="mt-9">
              <ul class="space-y-5">
                <For each={contactLines}>
                  {(line) => (
                    <li class="flex gap-4">
                      <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sand-300 bg-white text-gold-600">
                        <Icon name={line.icon} size={16} />
                      </span>
                      <div>
                        <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-600/60">
                          {line.label}
                        </p>
                        <Show
                          when={line.href}
                          fallback={<p class="mt-1 text-navy-900">{line.value}</p>}
                        >
                          <a
                            href={line.href}
                            class="mt-1 block text-navy-900 transition-colors hover:text-gold-600"
                          >
                            {line.value}
                          </a>
                        </Show>
                      </div>
                    </li>
                  )}
                </For>
              </ul>

              <div class="mt-9 rounded-2xl border border-sand-300/70 bg-white p-6">
                <p class="eyebrow">Check in / out</p>
                <p class="mt-3 text-sm text-navy-700">
                  Rooms are ready from <strong class="font-semibold">{site.checkIn}</strong>. Check
                  out is <strong class="font-semibold">{site.checkOut}</strong>; late check-out is
                  free when the room is not turning over the same day.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={140} class="lg:col-span-7">
            <div class="rounded-3xl border border-sand-300/70 bg-white p-7 shadow-[var(--shadow-card)] sm:p-10">
              <Show
                when={!sent()}
                fallback={
                  <div class="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <span class="grid h-14 w-14 place-items-center rounded-full bg-gold-100 text-gold-600">
                      <Icon name="check" size={26} />
                    </span>
                    <h3 class="mt-6 font-display text-3xl text-navy-900">Message sent</h3>
                    <p class="mt-3 max-w-sm leading-relaxed text-navy-700/80">
                      Thank you, {firstName()}. We have your note and will reply to {email()}{" "}
                      shortly — usually within the day.
                    </p>
                    <Button
                      variant="outline"
                      class="mt-8"
                      onClick={() => {
                        setSent(false);
                        setSubject("");
                        setMessage("");
                      }}
                    >
                      Send another
                    </Button>
                  </div>
                }
              >
                <form class="flex flex-col gap-5" onSubmit={handleSubmit} novalidate>
                  <div>
                    <h3 class="font-display text-3xl text-navy-900">Send a message</h3>
                    <p class="mt-2 text-sm text-navy-600/80">
                      All fields are required.
                    </p>
                  </div>

                  <div class="flex flex-col gap-5 sm:flex-row">
                    <Input
                      label="First name"
                      placeholder="Juan"
                      autocomplete="given-name"
                      value={firstName()}
                      onInput={(e) => setFirstName(e.currentTarget.value)}
                    />
                    <Input
                      label="Last name"
                      placeholder="Dela Cruz"
                      autocomplete="family-name"
                      value={lastName()}
                      onInput={(e) => setLastName(e.currentTarget.value)}
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                  />

                  <Input
                    label="Subject"
                    placeholder="Booking enquiry — 12 to 14 April"
                    value={subject()}
                    onInput={(e) => setSubject(e.currentTarget.value)}
                  />

                  <Input
                    label="Message"
                    multiline
                    rows={5}
                    placeholder="Tell us your dates, how many are travelling, and anything you need us to arrange."
                    value={message()}
                    onInput={(e) => setMessage(e.currentTarget.value)}
                  />

                  <Show when={error()}>
                    <p
                      role="alert"
                      class="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error()}
                    </p>
                  </Show>

                  <Button type="submit" variant="gold" class="mt-1 self-start">
                    Send message
                  </Button>
                </form>
              </Show>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Directions ----------------------------------------------------- */}
      <section class="section bg-white">
        <div class="shell">
          <SectionHeading
            eyebrow="Getting here"
            title="How to find us"
            description="Roughly three hours from Metro Manila, most of it on expressway."
          />

          <Reveal delay={120} class="mt-12 overflow-hidden rounded-2xl border border-sand-300/70 shadow-[var(--shadow-card)]">
            <MapGoogle origin={travel.origin} destination={travel.destination} />
          </Reveal>

          <div class="mt-12 grid gap-8 md:grid-cols-2">
            <For each={directions}>
              {(route, i) => (
                <Reveal delay={i() * 100} class="rounded-2xl border border-sand-300/70 bg-sand-50 p-7">
                  <div class="flex items-center gap-3">
                    <span class="grid h-9 w-9 place-items-center rounded-full bg-navy-950 text-gold-300">
                      <Icon name={route.icon} size={17} />
                    </span>
                    <h3 class="font-display text-2xl text-navy-900">{route.title}</h3>
                  </div>

                  <ol class="mt-5 space-y-3">
                    <For each={route.steps}>
                      {(step, n) => (
                        <li class="flex gap-3 text-sm leading-relaxed text-navy-700/85">
                          <span class="mt-0.5 font-display text-lg leading-none text-gold-500">
                            {n() + 1}
                          </span>
                          {step}
                        </li>
                      )}
                    </For>
                  </ol>
                </Reveal>
              )}
            </For>
          </div>
        </div>
      </section>
    </main>
  );
}
