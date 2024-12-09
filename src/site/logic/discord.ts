import "dotenv/config";
import { Client, GatewayIntentBits, Guild } from "discord.js";
import { z } from "zod";

// Cache all events, once per compilation.
let allEvents: DiscordEvent[] | null = null;

export type DiscordEvent = {
  guildID: string;
  name: string;
  desc: string | undefined;
  start: Date;
  end: Date | undefined;
  location: string | undefined;
};

function mustEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
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

async function getScheduledEvents(guild: Guild): Promise<DiscordEvent[]> {
  const events = await guild.scheduledEvents.fetch();
  return events
    .map((event) => {
      // TODO: Implement recurrence rules:
      // https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object
      // Released in future Discord.js 14.17: https://github.com/discordjs/discord.js/pull/10447
      const result = z
        .object({
          guild: z.object({ id: z.string() }),
          name: z.string(),
          description: z.string().optional(),
          scheduledStartAt: z.date(),
          scheduledEndAt: z.date().optional(),
          entityMetadata: z.object({ location: z.string() }).optional(),
        })
        .safeParse(event);
      if (!result.success) {
        console.error({
          error: "Error parsing event from Discord",
          event,
          message: result.error.errors,
        });
        return null;
      }
      return result.data;
    })
    .filter((e) => e !== null)
    .map((e) => ({
      guildID: e.guild.id,
      name: e.name,
      desc: e.description,
      start: e.scheduledStartAt,
      end: e.scheduledEndAt ?? e.scheduledStartAt,
      location: e.entityMetadata?.location,
    }));
}

async function getScheduledEventsForAllGuilds() {
  if (allEvents !== null) return allEvents;

  const client = await login();
  const guildObjs = await client.guilds.fetch();
  const guilds = await Promise.all(
    guildObjs.map(async (g) => client.guilds.fetch(g.id))
  );
  console.log(`Found ${guilds.length} guilds`);

  allEvents = (
    await Promise.all(guilds.map(async (g) => getScheduledEvents(g)))
  ).flat();
  console.log(`Found ${allEvents.length} events`);
  allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
  return allEvents;
}

export async function getScheduledEventsForGuild(guildID: string) {
  const events = await getScheduledEventsForAllGuilds();
  return events.filter((e) => e.guildID === guildID);
}
