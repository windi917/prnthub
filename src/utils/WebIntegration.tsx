import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { CLUSTER_API_URL } from "../config";

export const solConnection = new Connection(
  clusterApiUrl(CLUSTER_API_URL),
  "finalized"
);

export async function getBalance(
  wallet: WalletContextState,
  tokenMint: string
) {
  const publicKey = wallet.publicKey;
  if (!publicKey || !wallet.signTransaction) {
    throw new WalletNotConnectedError();
  }

  const mintToken = new PublicKey(tokenMint);
  const tokenAccount = await getAssociatedTokenAddress(mintToken, publicKey);
  const info = await solConnection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
}
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
      console.log("Not a valid SPL token mint");
      return { success: false };
    }
  } catch (err) {
    console.log("Not a valid SPL token mint", err);
    return { success: false };
  }
}

export async function createVote(
  tokenMintAddress: string,
  wallet: WalletContextState,
  to: string,
  amount: number
) {
  const publicKey = wallet.publicKey;
  if (!publicKey || !wallet.signTransaction) {
    throw new WalletNotConnectedError();
  }

  const { signMessage } = wallet as WalletContextState & {
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  };

  if (tokenMintAddress === "NoneToken") {
    try {
      const message = new TextEncoder().encode("Sign this message for signup");
      const signedMessage = await signMessage(message);

      return Buffer.from(signedMessage).toString("base64");
    } catch (error) {
      console.log("Sign message error! ", error);
    }
  } else {
    const mintToken = new PublicKey(tokenMintAddress);
    const recipientAddress = new PublicKey(to);

    const transactionInstructions: TransactionInstruction[] = [];
    const associatedTokenFrom = await getAssociatedTokenAddress(
      mintToken,
      publicKey
    );
    const fromAccount = await getAccount(solConnection, associatedTokenFrom);
    const associatedTokenTo = await getAssociatedTokenAddress(
      mintToken,
      recipientAddress
    );
    if (!(await solConnection.getAccountInfo(associatedTokenTo))) {
      transactionInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenTo,
          recipientAddress,
          mintToken
        )
      );
    }
    transactionInstructions.push(
      createTransferInstruction(
        fromAccount.address, // source
        associatedTokenTo, // dest
        publicKey,
        amount // transfer 1 USDC, USDC on solana devnet has 6 decimal
      )
    );
    const transaction = new Transaction().add(...transactionInstructions);

    const blockHash = await solConnection.getLatestBlockhash();
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = blockHash.blockhash;
    const signed = await wallet.signTransaction(transaction);
    const signature = await solConnection.sendRawTransaction(
      signed.serialize()
    );

    await solConnection.confirmTransaction(
      {
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature: signature,
      },
      "finalized"
    );

    const txHash = (await signature).toString();
    console.log("signamture@@@@@@@@@@@@", txHash);

    return txHash;
  }
}
