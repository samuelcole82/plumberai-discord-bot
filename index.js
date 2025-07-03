const { Client, GatewayIntentBits } = require('discord.js');
const { config } = require('dotenv');
const { OpenAI } = require('openai');

config(); // Load environment variables

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.once('ready', () => {
  console.log(`🤖 ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const reply = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message.content }]
    });

    message.reply(reply.choices[0].message.content);
  } catch (err) {
    console.error('❌ OpenAI error:', err);
    message.reply("⚠️ I'm having trouble reaching ChatGPT.");
  }
});

client.login(process.env.DISCORD_TOKEN);