import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
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
const tokenDecimals = parseInt(getEnvVariable('TOKEN_DECIMALS', '9'), 10);
const initialSupply = parseInt(getEnvVariable('INITIAL_SUPPLY', '1000000000'), 10);

if (!fs.existsSync(walletPath)) {
    throw new Error(`Error: Wallet file '${walletPath}' not found. Please ensure the file exists.`);
}

const walletSecretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(walletSecretKey));

const connection = new Connection(cluster, 'confirmed');

export const createToken = async (): Promise<string> => {
    const mint = await createMint(
        connection,
        wallet,
        wallet.publicKey,
        null,
        tokenDecimals
    );

    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);

    await mintTo(
        connection,
        wallet,
        mint,
        tokenAccount.address,
        wallet.publicKey,
        initialSupply * Math.pow(10, tokenDecimals)
    );

    return mint.toBase58();
};
