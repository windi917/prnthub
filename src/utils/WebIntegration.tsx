import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

export const solConnection = new Connection(clusterApiUrl("devnet"), 'confirmed');

export async function checkMintAddress(mintAddress: string) {
  const TOKEN_MINT_ADDRESS = mintAddress; // replace with your token mint address
  
  try {
    const tokenMintAddress = new PublicKey(mintAddress);
    const accountInfo = await solConnection.getAccountInfo(tokenMintAddress);
    
    if (accountInfo === null) {
      console.log(`Token mint address ${TOKEN_MINT_ADDRESS} does not exist`);
      return { success: false };
    } else {
      console.log(`Token mint address ${TOKEN_MINT_ADDRESS} exists`);
      return { success: true };
    }
  } catch (err) {
    console.error(`Failed to fetch account info due to error: ${err}`);
    return { success: false };
  }
}

export async function getDecimals(mintAddress: string) {
    try {
        const tokenMintAddress = new PublicKey(mintAddress);
        const account = await solConnection.getParsedAccountInfo(tokenMintAddress);
        const parsedInfo = (account.value?.data as any)?.parsed?.info;

        if (parsedInfo) {
            console.log(`Decimals: ${parsedInfo.decimals}`);
            return { success: true, decimals: parsedInfo.decimals };
        } else {
            console.log('Not a valid SPL token mint');
            return { success: false };
        }
    } catch (err) {
        console.log('Not a valid SPL token mint', err);
        return { success: false };
    }
}