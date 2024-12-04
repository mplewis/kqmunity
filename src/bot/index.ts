import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

function mustEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

async function main() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    const guildObjs = await client.guilds.fetch();
    const guilds = await Promise.all(
      guildObjs.map(async (g) => client.guilds.fetch(g.id))
    );
    console.log(`Found ${guilds.length} guilds`);

    for (const guild of guilds) {
      const events = await guild.scheduledEvents.fetch();
      events.forEach((event) => {
        console.log(
          `Guild ${guild.name} has event ${event.name}, starting at ${event.scheduledStartAt} and ending at ${event.scheduledEndAt}`
        );
        console.log(`Event description: ${event.description}`);
      });
    }

    process.exit(0);
  });

  client.login(mustEnv("DISCORD_BOT_TOKEN"));
}

main();
