require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, AllowedMentionsTypes } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const INTERVAL_MS = 6 * 60 * 60 * 1000;
const STATE_FILE = path.join(__dirname, 'last-message.json');

if (!TOKEN || !CHANNEL_ID) {
  console.error('Missing DISCORD_TOKEN or CHANNEL_ID in .env');
  process.exit(1);
}

const MESSAGE = `**__Boppers__ A VIP experience, exclusively made for *Gooners.***

**Fed up of gooning to boring, recycled content?**
*Don't worry — we got you.*

We’ve built a **VIP** tailored exactly for *Gooners.*
- No boring content
- No repeated rubbish
- Just **straight-up new & updated content,** including **rare videos you won’t find anywhere else.**
- Requests available to **every VIP member** (request any model and get their content)

**All for one price** — *no upsells, no nonsense.*

Stop over-paying for garbage.
**Join a VIP server that actually cares about its members and feedback.**

> - Watch Previews ➜ <https://boppersvip.com/>
> - https://discord.com/channels/1553720565892915280/1553720567834611844 [.](https://boppersvip.com/media/channel.mp4)`;

function loadLastId() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')).id || null;
  } catch {
    return null;
  }
}

function saveLastId(id) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ id }, null, 2));
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function postPromo() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel || !channel.isTextBased()) {
    throw new Error('CHANNEL_ID is not a text channel');
  }

  const prev = loadLastId();
  if (prev) {
    try {
      const old = await channel.messages.fetch(prev);
      await old.delete();
      console.log('Deleted previous promo', prev);
    } catch (err) {
      console.warn('Could not delete previous message:', err.message);
    }
  }

  const sent = await channel.send({
    content: MESSAGE,
    allowedMentions: {
      parse: [AllowedMentionsTypes.Everyone],
    },
  });

  saveLastId(sent.id);
  console.log('Posted promo', sent.id, new Date().toISOString());
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await postPromo();
  } catch (err) {
    console.error('First post failed:', err);
  }
  setInterval(() => {
    postPromo().catch((err) => console.error('Scheduled post failed:', err));
  }, INTERVAL_MS);
});

client.login(TOKEN);
