import { 
  AMM_V4,
  Cluster,
  DEVNET_PROGRAM_ID,
  FEE_DESTINATION_ID,
  OPEN_BOOK_PROGRAM,
  WSOLMint, 
  Raydium,
  TxVersion,
  Token, 
  toToken, 
  TOKEN_WSOL, 
  parseTokenAccountResp 
} from 'opt-raydium-sdk-v2'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { NETWORK } from '../config'
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import BN from 'bn.js';

const RPC_URL: string = (NETWORK == 'devnet') ? 'https://api.devnet.solana.com' : 'https://mainnet.helius-rpc.com/?api-key=07d048c5-5058-42e4-9991-b92ac3fc17d0';
const CLUSTER: Cluster = (NETWORK == 'devnet') ? 'devnet' : 'mainnet'

export const OPENBOOK_PROGRAM_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.OPENBOOK_MARKET : OPEN_BOOK_PROGRAM
export const AMMV4_PROGRAM_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.AmmV4 : AMM_V4
export const AMMV4_FEE_DESTINATION_ID = (NETWORK == 'devnet') ? DEVNET_PROGRAM_ID.FEE_DESTINATION_ID : FEE_DESTINATION_ID

export const solConnection = new Connection(
  RPC_URL,
  "finalized"
);

export const txVersion = TxVersion.V0 // or TxVersion.LEGACY

let raydium: Raydium | undefined

export const getToken = async(raydium: Raydium, addr: string): Promise<Token> => {
  if (addr === TOKEN_WSOL.address)
    return toToken(TOKEN_WSOL);
 
  const tokenInfo = await raydium.token.getTokenInfo(addr)

  return toToken(tokenInfo);
}

export const getTokenBalance = async (ownerAddress: PublicKey, tokenAddress: PublicKey) => {
  try {
    if (tokenAddress.toString() === WSOLMint.toBase58()) {
      const tokenBalance = await solConnection.getBalance(ownerAddress);  
      return new BN(tokenBalance);
    }
    const tokenAccount = await solConnection.getTokenAccountsByOwner(ownerAddress, {
      mint: tokenAddress,
    })
    const tokenBalance = await solConnection.getTokenAccountBalance(tokenAccount.value[0].pubkey);
    return new BN(tokenBalance.value.amount);
  }
  catch(err: any) {
    console.log('\nCould not get token balance:');
  }
  return new BN(0);
}

export const initSdk = async (owner: WalletContextState, params?: { loadToken?: boolean }) => {

  const publicKey = owner.publicKey;
  if (!publicKey || !owner.signTransaction) {
    throw new WalletNotConnectedError();
  }

  if (raydium) return raydium
  raydium = await Raydium.load({
    owner: publicKey,
    signAllTransactions: owner.signAllTransactions,
    connection: solConnection,
    cluster: CLUSTER,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
  })

  return raydium
}

export const fetchTokenAccountData = async (owner: PublicKey) => {
  const solAccountResp = await solConnection.getAccountInfo(owner)
  const tokenAccountResp = await solConnection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID })
  const token2022Req = await solConnection.getTokenAccountsByOwner(owner, { programId: TOKEN_2022_PROGRAM_ID })
  const tokenAccountData = parseTokenAccountResp({
    owner: owner,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  })
  return tokenAccountData
}