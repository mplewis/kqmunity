import "dotenv/config";
import { Client, GatewayIntentBits, Guild } from "discord.js";
import type { Context } from "@netlify/functions";
import type { Event } from "../../src/site/logic/events";

function mustEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

async function login(token: string) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  return new Promise<Client>((resolve, reject) => {
    try {
      client.once("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`);
        resolve(client);
      });
      client.login(token);
    } catch (error) {
      reject(error);
    }
  });
}

async function getScheduledEvents(guild: Guild) {
  const events = await guild.scheduledEvents.fetch();
  return events
    .map((event) => {
      if (!event.scheduledStartAt) return null;
      return {
        guildID: event.guildId,
        name: event.name,
        desc: event.description ?? "",
        start: event.scheduledStartAt.toISOString(),
        end: (event.scheduledEndAt ?? event.scheduledStartAt).toISOString(),
        location: event.entityMetadata?.location ?? "",
      };
    })
    .filter((e) => e !== null);
}

async function getScheduledEventsForAllGuilds(client: Client) {
  const guildObjs = await client.guilds.fetch();
  const guilds = await Promise.all(
    guildObjs.map(async (g) => client.guilds.fetch(g.id))
  );
  console.log(`Found ${guilds.length} guilds`);
  const results: Event[] = (
    await Promise.all(guilds.map(async (g) => getScheduledEvents(g)))
  ).flat();
  console.log(`Found ${results.length} events`);
  return results;
}

export default async (_req: Request, _ctx: Context) => {
  const client = await login(mustEnv("DISCORD_BOT_TOKEN"));
  const events = await getScheduledEventsForAllGuilds(client);
  return new Response(JSON.stringify(events), {
    headers: { "content-type": "application/json" },
  });
};
