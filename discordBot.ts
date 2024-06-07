import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { createToken } from './createToken';
import { getTokenDetails, getWalletBalance } from './solanaUtils';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Discord bot is ready!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const command = message.content.trim().toLowerCase();

    if (command === '!createToken') {
        try {
            const tokenAddress = await createToken();
            message.channel.send(`Token created successfully! Token address: ${tokenAddress}`);
        } catch (error) {
            if (error instanceof Error) {
                message.channel.send(`Error creating token: ${error.message}`);
            } else {
                message.channel.send(`Error creating token: ${String(error)}`);
            }
        }
    } else if (command.startsWith('!tokenDetails')) {
        const args = command.split(' ');
        if (args.length !== 2) {
            message.channel.send('Usage: !tokenDetails <tokenAddress>');
            return;
        }
        try {
            const tokenDetails = await getTokenDetails(args[1]);
            message.channel.send(`Token Details: ${JSON.stringify(tokenDetails)}`);
        } catch (error) {
            if (error instanceof Error) {
                message.channel.send(`Error fetching token details: ${error.message}`);
            } else {
                message.channel.send(`Error fetching token details: ${String(error)}`);
            }
        }
    } else if (command === '!walletBalance') {
        try {
            const balance = await getWalletBalance();
            message.channel.send(`Wallet balance: ${balance}`);
        } catch (error) {
            if (error instanceof Error) {
                message.channel.send(`Error fetching wallet balance: ${error.message}`);
            } else {
                message.channel.send(`Error fetching wallet balance: ${String(error)}`);
            }
        }
    }
});

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
    throw new Error('DISCORD_TOKEN is not set in the .env file.');
}

client.login(discordToken);
