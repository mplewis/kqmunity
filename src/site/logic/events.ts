import { z } from "zod";

const NETLIFY_FUNCTIONS_PATH = "/.netlify/functions";
const EVENTS_ENDPOINT = `${NETLIFY_FUNCTIONS_PATH}/events`;

export const eventSchema = z.object({
  guildID: z.string(),
  name: z.string(),
  desc: z.string(),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z.string(),
});

export type Event = z.infer<typeof eventSchema>;

export async function fetchEvents() {
  const eventsSchema = z.array(eventSchema);
  const res = await fetch(EVENTS_ENDPOINT);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  const data = await res.json();
  return eventsSchema.parse(data);
}

export async function fetchEventsForGuild(guildID: string) {
  const events = await fetchEvents();
  return events.filter((e) => e.guildID === guildID);
}
