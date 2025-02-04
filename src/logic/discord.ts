import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Guild,
  type GuildScheduledEventRecurrenceRule,
} from "discord.js";
import { z } from "zod";
import dayjs from "dayjs";

/** If not specified, expand each recurring event to this many occurrences in the future. */
const DEFAULT_RECURRENCE_EXPAND_COUNT = 10;

// Cache all events, once per compilation.
let allEvents: DiscordEvent[] | null = null;

export type DiscordEvent = {
  guildID: string;
  name: string;
  desc: string | undefined;
  start: Date;
  end: Date | undefined;
  location: string | undefined;
  recurrenceRule?: GuildScheduledEventRecurrenceRule;
};

const recurrenceRuleSchema = z.object({
  startTimestamp: z.number(),
  startAt: z.date(),
  endTimestamp: z.number().nullable(),
  endAt: z.date().nullable(),
  frequency: z.number(),
  interval: z.number(),
  byWeekday: z.array(z.number()).nullable(),
  byNWeekday: z.array(z.number()).nullable(),
  byMonth: z.array(z.number()).nullable(),
  byMonthDay: z.array(z.number()).nullable(),
  byYearDay: z.array(z.number()).nullable(),
  count: z.number().nullable(),
});

const discordEventSchema = z.object({
  guild: z.object({ id: z.string() }),
  name: z.string(),
  description: z.string().optional(),
  scheduledStartAt: z.date(),
  scheduledEndAt: z.date().optional(),
  entityMetadata: z.object({ location: z.string() }).optional(),
  recurrenceRule: recurrenceRuleSchema.nullish(),
});

// https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-frequency
const FREQUENCIES = {
  0: "year",
  1: "month",
  2: "week",
  3: "day",
} as const;

function mustEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

/** Simple implementation to handle recurrence rules with interval/frequency.
 * Does not properly handle `by_weekday`, `by_n_weekday`, etc. */
export function* rrToDates(
  rr: Pick<
    GuildScheduledEventRecurrenceRule,
    "startAt" | "endAt" | "frequency" | "interval"
  >
): Generator<Date, null, void> {
  let date = dayjs(rr.startAt);
  const end = rr.endAt && dayjs(rr.endAt);
  const freq = FREQUENCIES[rr.frequency];
  while (true) {
    if (end && date.isAfter(end)) break;
    // Don't yield dates in the past
    if (date.isAfter(dayjs())) yield date.toDate();
    date = date.add(rr.interval, freq);
  }
  return null;
}

async function login() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  return new Promise<Client>((resolve, reject) => {
    try {
      client.once("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`);
        resolve(client);
      });
      client.login(mustEnv("DISCORD_BOT_TOKEN"));
    } catch (error) {
      reject(error);
    }
  });
}

async function getScheduledEvents(
  guild: Guild,
  recurrenceExpandCount: number
): Promise<DiscordEvent[]> {
  const events = await guild.scheduledEvents.fetch();
  console.log(events);
  const parsed = events
    .map((event) => {
      const result = discordEventSchema.safeParse(event);
      if (!result.success) {
        console.error({
          error: "Error parsing event from Discord",
          event,
        });
        console.dir(result.error.errors);
        return null;
      }
      return result.data;
    })
    .filter((e) => e !== null);

  const expanded = parsed
    .map((event) => {
      console.log(event);
      if (!event.recurrenceRule) return [event];
      const rr = event.recurrenceRule;

      const duration =
        event.scheduledEndAt &&
        dayjs(event.scheduledEndAt).diff(dayjs(event.scheduledStartAt));

      const iter = rrToDates(rr).take(recurrenceExpandCount);
      return Array.from(iter).map((start) => ({
        ...event,
        scheduledStartAt: start,
        scheduledEndAt: duration
          ? dayjs(start).add(duration).toDate()
          : undefined,
      }));
    })
    .flat();

  const structured = expanded.map((e) => ({
    guildID: e.guild.id,
    name: e.name,
    desc: e.description,
    start: e.scheduledStartAt,
    end: e.scheduledEndAt ?? e.scheduledStartAt,
    location: e.entityMetadata?.location,
  }));
  return structured;
}

async function getScheduledEventsForAllGuilds(recurrenceExpandCount: number) {
  if (allEvents !== null) return allEvents;

  const client = await login();
  const guildObjs = await client.guilds.fetch();
  const guilds = await Promise.all(
    guildObjs.map(async (g) => client.guilds.fetch(g.id))
  );
  console.log(`Found ${guilds.length} guilds`);

  allEvents = (
    await Promise.all(
      guilds.map(async (g) => getScheduledEvents(g, recurrenceExpandCount))
    )
  ).flat();
  console.log(`Found ${allEvents.length} events`);
  allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
  allEvents.map((e) => e.recurrenceRule);
  return allEvents;
}

export async function getScheduledEventsForGuild(
  guildID: string,
  recurrenceExpandCount = DEFAULT_RECURRENCE_EXPAND_COUNT
) {
  const events = await getScheduledEventsForAllGuilds(recurrenceExpandCount);
  return events.filter((e) => e.guildID === guildID);
}
