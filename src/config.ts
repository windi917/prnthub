type NetworkType = 'mainnet' | 'devnet';

import { PublicKey } from "@solana/web3.js";

export const API_URL = "https://api.prnthub.com";
export const NETWORK: NetworkType = "mainnet";
export const RPC_ENDPOINT =
  "https://mainnet.helius-rpc.com/?api-key=f1d5fa66-a4cd-4cb6-a0c3-49c3500e7c0f";
export const ADMIN_WALLET_ADDRESS = new PublicKey(
  "PrNTuQKjKMJ1WJruQdCYHxKfFiemABQHj6FEQEAWiyr"
);

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const EMPTY_USER = "So11111111111111111111111111111111111111112";

export const MYPRO_ID = "9Keg5CgCSSudKKuXJcEMvyksGLbbqgrtaYjoM18uyaGQ";
export const PRESALE_SIZE = 192;
