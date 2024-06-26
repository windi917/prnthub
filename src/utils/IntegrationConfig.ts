// import { 
//   AMM_V4,
//   Cluster,
//   DEVNET_PROGRAM_ID,
//   FEE_DESTINATION_ID,
//   OPEN_BOOK_PROGRAM,
//   Raydium,
//   TxVersion,
//   Token, 
//   toToken, 
//   TOKEN_WSOL, 
//   parseTokenAccountResp 
// } from 'opt-raydium-sdk-v2'
// import { Connection, PublicKey } from '@solana/web3.js'
// import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
// import { NETWORK } from '../config'
// import { WalletContextState } from "@solana/wallet-adapter-react";
// import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

// const RPC_URL: string = (NETWORK == 'devnet') ? 'https://api.devnet.solana.com' : 'https://mainnet.helius-rpc.com/?api-key=07d048c5-5058-42e4-9991-b92ac3fc17d0';
// const CLUSTER: Cluster = (NETWORK == 'devnet') ? 'devnet' : 'mainnet'

// export const OPENBOOK_PROGRAM_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.OPENBOOK_MARKET : OPEN_BOOK_PROGRAM
// export const AMMV4_PROGRAM_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.AmmV4 : AMM_V4
// export const AMMV4_FEE_DESTINATION_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.FEE_DESTINATION_ID : FEE_DESTINATION_ID

// export const solConnection = new Connection(
  // RPC_URL,
  // "finalized"
// );

// export const txVersion = TxVersion.V0 // or TxVersion.LEGACY

// let raydium: Raydium | undefined

// export const getToken = async(raydium: Raydium, addr: string): Promise<Token> => {
//   if (addr === TOKEN_WSOL.address)
//     return toToken(TOKEN_WSOL);
 
//   const tokenInfo = await raydium.token.getTokenInfo(addr)

//   return toToken(tokenInfo);
// }

// export const initSdk = async (owner: WalletContextState, params?: { loadToken?: boolean }) => {

//   const publicKey = owner.publicKey;
//   if (!publicKey || !owner.signTransaction) {
//     throw new WalletNotConnectedError();
//   }

//   if (raydium) return raydium
//   raydium = await Raydium.load({
//     owner: publicKey,
//     signAllTransactions: owner.signAllTransactions,
//     connection: solConnection,
//     cluster: CLUSTER,
//     disableFeatureCheck: true,
//     disableLoadToken: !params?.loadToken,
//   })

//   return raydium
// }