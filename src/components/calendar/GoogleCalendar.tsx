import { MdFillDelete, MdFillEdit, MdFillArrow_forward } from 'solid-icons/md';
import { createSignal, onMount, Show, For, createResource } from "solid-js";
import { getServiceAccountAccessToken, listEvents, createEvent, deleteEvent } from "~/lib/google/calendar";
import Button from "../button/Button";

export default function GoogleCalendarQuickstart() {
  //access token state
  const [accessToken, setAccessToken] = createSignal("");

  //events state
  const [events, { refetch }] = createResource(accessToken, listEvents);

  const getToken = async () => {
    const token = await getServiceAccountAccessToken();
    setAccessToken(token);
  }

  onMount(() => {
    getToken();
  });

  const onCreateEvent = async () => {
    if (!accessToken()) {
      console.error("No access token available");
      return;
    }

    const event = await createEvent(accessToken(), {
      summary: "Service Account Event test new",
      start: { dateTime: "2026-04-21T09:00:00+08:00" },
      end: { dateTime: "2026-04-21T10:00:00+08:00" },
    });
  };

  const onDeleteEvent = async (event) => {
    console.log(event.id);
    const res = await deleteEvent(accessToken(), event.id);

    console.log(res);

  }

  return (
    <div class="flex flex-col gap-3 items-start">
      <div><Button onClick={onCreateEvent} class="btn">Create Event</Button></div>
      <iframe src="https://calendar.google.com/calendar/u/0/embed?src=4b0de7a6eabdc133a4eb1b98505db4bf91c4b409212ed9a213dc060b096734fd@group.calendar.google.com&ctz=UTC" style="border: 0" width="100%" height="600">
      </iframe>
      <div class="w-full flex flex-col gap-3">
        <Show when={!events.loading} fallback={<p>Loading events...</p>}>
          <For each={events()?.items}>
            {(event) => (
              <div class="flex justify-between text-gray-700 w-full border border-[var(--color-border-1)] rounded-[10px] py-3 px-5">
                <div>
                  <span>{event.summary}</span>
                  <span>{event.start?.dateTime}</span>
                </div>
                <button onClick={(() => onDeleteEvent(event))} class="hover:cursor-pointer">
                  <MdFillDelete />
                </button>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
