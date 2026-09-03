import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import Icon from "~/components/ui/Icon";

const toInputDate = (d: Date) => d.toISOString().slice(0, 10);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/**
 * The availability strip that sits under the hero. It does not reserve
 * anything yet — the booking engine is still to come — so it carries the dates
 * through to the rooms page as query parameters, where they can be picked up
 * once real availability exists.
 */
export default function BookingBar(props: { class?: string }) {
  const navigate = useNavigate();
  const today = new Date();

  const [checkIn, setCheckIn] = createSignal(toInputDate(today));
  const [checkOut, setCheckOut] = createSignal(toInputDate(addDays(today, 2)));
  const [guests, setGuests] = createSignal(2);

  // Keep the range valid: a check-out never precedes its check-in.
  const onCheckIn = (value: string) => {
    setCheckIn(value);
    if (new Date(value) >= new Date(checkOut())) {
      setCheckOut(toInputDate(addDays(new Date(value), 1)));
    }
  };

  const nights = () => {
    const ms = new Date(checkOut()).getTime() - new Date(checkIn()).getTime();
    return Math.max(1, Math.round(ms / 86_400_000));
  };

  const search = () => {
    const params = new URLSearchParams({
      checkIn: checkIn(),
      checkOut: checkOut(),
      guests: String(guests()),
    });
    navigate(`/rooms?${params.toString()}`);
  };

  const fieldClass =
    "flex flex-1 flex-col gap-1 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-sand-100/70";

  const labelClass =
    "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-600/70";

  const controlClass =
    "w-full border-none bg-transparent p-0 text-sm font-medium text-navy-900 outline-none";

  return (
    <div
      class={`overflow-hidden rounded-2xl border border-sand-300/80 bg-white/95 shadow-[var(--shadow-lift)] backdrop-blur-md ${
        props.class ?? ""
      }`}
    >
      <div class="flex flex-col divide-y divide-sand-300/80 sm:flex-row sm:divide-x sm:divide-y-0">
        <label class={fieldClass}>
          <span class={labelClass}>
            <Icon name="clock" size={12} /> Check in
          </span>
          <input
            type="date"
            class={controlClass}
            value={checkIn()}
            min={toInputDate(today)}
            onInput={(e) => onCheckIn(e.currentTarget.value)}
          />
        </label>

        <label class={fieldClass}>
          <span class={labelClass}>
            <Icon name="clock" size={12} /> Check out
          </span>
          <input
            type="date"
            class={controlClass}
            value={checkOut()}
            min={toInputDate(addDays(new Date(checkIn()), 1))}
            onInput={(e) => setCheckOut(e.currentTarget.value)}
          />
        </label>

        <label class={fieldClass}>
          <span class={labelClass}>
            <Icon name="users" size={12} /> Guests
          </span>
          <select
            class={`${controlClass} cursor-pointer`}
            value={guests()}
            onChange={(e) => setGuests(Number(e.currentTarget.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option value={n} selected={n === guests()}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>

        <div class="flex items-center gap-3 p-3 sm:pl-5">
          <span class="hidden text-xs text-navy-600/70 xl:block">
            {nights()} {nights() === 1 ? "night" : "nights"}
          </span>
          <button type="button" class="btn-gold w-full sm:w-auto" onClick={search}>
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}
