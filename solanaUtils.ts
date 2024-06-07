import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { getMint, getAccount } from '@solana/spl-token';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (name: string, defaultValue?: string): string => {
    const value = process.env[name] || defaultValue;
    if (!value) {
        throw new Error(`Error: ${name} environment variable is missing. Please set it in the .env file.`);
    }
    return value;
};

const cluster = getEnvVariable('SOLANA_CLUSTER', 'https://api.devnet.solana.com');
const walletPath = getEnvVariable('WALLET_PATH', './bot-wallet.json');

if (!fs.existsSync(walletPath)) {
    throw new Error(`Error: Wallet file '${walletPath}' not found. Please ensure the file exists.`);
}

const walletSecretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(walletSecretKey));

const connection = new Connection(cluster, 'confirmed');

export const getTokenDetails = async (tokenAddress: string): Promise<any> => {
    const mintPublicKey = new PublicKey(tokenAddress);
    const mintInfo = await getMint(connection, mintPublicKey);
    return {
        supply: mintInfo.supply.toString(),
        decimals: mintInfo.decimals
    };
};

export const getWalletBalance = async (): Promise<string> => {
    const balance = await connection.getBalance(wallet.publicKey);
    return (balance / 1e9).toFixed(2) + ' SOL';
};
