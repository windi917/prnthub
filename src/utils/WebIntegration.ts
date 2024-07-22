import {
  PublicKey,
  Connection,
  Transaction,
  TransactionInstruction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { DexInstructions, Market } from "@openbook-dex/openbook";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";

import BN from 'bn.js'
import { toBufferBE } from "bigint-buffer";
import { ACCOUNT_SIZE, NATIVE_MINT, MINT_SIZE, TOKEN_PROGRAM_ID, MintLayout, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, createMintToInstruction, createInitializeAccountInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { WebBundlr } from '@bundlr-network/client';
import { Liquidity, TxVersion, SPL_ACCOUNT_LAYOUT, ZERO } from '@raydium-io/raydium-sdk'
import { web3 } from "@project-serum/anchor";
import { NETWORK, RPC_ENDPOINT } from '../config'

const RPC_URL: string = (NETWORK == 'devnet') ? 'https://api.devnet.solana.com' : RPC_ENDPOINT;

export function getOpenbookData() {
  if (NETWORK === 'devnet') {
    const ammProgramId = new web3.PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8")
    const feeDestinationId = new web3.PublicKey("3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR")
    const orderBookProgramId = new web3.PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj")

    return { ammProgramId, feeDestinationId, orderBookProgramId };
  } else {
    const feeDestinationId = new web3.PublicKey("7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5")
    const ammProgramId = new web3.PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
    const orderBookProgramId = new web3.PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX")

    return { ammProgramId, feeDestinationId, orderBookProgramId };
  }
};


export const solConnection = new Connection(
  RPC_URL,
  "finalized"
);

export async function getBalance(
  wallet: WalletContextState,
  tokenMint: string
) {
  const publicKey = wallet.publicKey;
  if (!publicKey) {
    throw new WalletNotConnectedError();
  }

  if (tokenMint === 'So11111111111111111111111111111111111111112') {
    const solBalance = await solConnection.getBalance(publicKey);
    return solBalance / (10 ** 9);
  }

  const mintToken = new PublicKey(tokenMint);
  const tokenAccount = await getAssociatedTokenAddress(mintToken, publicKey);
  const info = await solConnection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
}

export async function getAccountBalance(
  address: PublicKey,
  tokenMint: string
) {
  if (!address) {
    throw new WalletNotConnectedError();
  }

  const mintToken = new PublicKey(tokenMint);
  const tokenAccount = await getAssociatedTokenAddress(mintToken, address);
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
    console.log("Vote Tx: ", txHash);

    return txHash;
  }
}

export async function initializeBundlr(
  wallet: WalletContextState
) {
  if (!wallet.wallet) {
    throw new WalletNotConnectedError();
  }

  // initialise a bundlr client
  const bundler = new WebBundlr(
    'https://node1.bundlr.network',
    'solana',
    wallet.wallet.adapter,
    { providerUrl: RPC_ENDPOINT }
  );

  try {
    // Check for valid bundlr node
    await bundler.utils.getBundlerAddress('solana');
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  try {
    await bundler.ready();
  } catch (err) {
    return { success: false, error: `${err}` };
  } //@ts-ignore
  if (!bundler.address) {
    return { success: false, error: 'Unexpected error: bundlr address not found' };
  }

  return { success: true, bundler: bundler };
};

export async function uploadMetadata(bundlr: WebBundlr, name: string, symbol: string, description: string, image: string) {
  const metaData = {
    name: name,
    symbol: symbol,
    description: description,
    image: image
  };

  // Convert the metaData object to a JSON string
  const jsonContent = JSON.stringify(metaData, null, 2);
  // Convert the JSON string to a Buffer
  const metaBuffer = Buffer.from(jsonContent, 'utf-8');
  const metaArray = Buffer.from(metaBuffer);

  let price;
  try {
    price = await bundlr.utils.getPrice('solana', metaArray.length);
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  let amount;
  try {
    amount = bundlr.utils.unitConverter(price).toNumber();
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  let loadedBalance;
  try {
    loadedBalance = await bundlr.getLoadedBalance();
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  let balance = bundlr.utils.unitConverter(loadedBalance.toNumber()).toNumber();

  if (balance < amount) {
    await bundlr.fund(LAMPORTS_PER_SOL);
  }

  let metadataResult;
  try {
    metadataResult = await bundlr.uploader.upload(metaArray, [
      { name: 'Content-Type', value: 'application/json' },
    ]);
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  const arweaveMetadataUrl = `https://arweave.net/${metadataResult.data.id}`;

  return { success: true, url: arweaveMetadataUrl };
};

export async function createToken(
  wallet: WalletContextState,
  name: string,
  symbol: string,
  totalSupply: number,
  decimals: number,
  metaUrl: string,
) {
  const publicKey = wallet.publicKey;

  if (!publicKey || !wallet.signTransaction) {
    throw new WalletNotConnectedError();
  }

  let lamports;
  try {
    lamports = await getMinimumBalanceForRentExemptMint(solConnection);
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  const mintKeypair = Keypair.generate();
  let tokenATA;
  try {
    tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);
  } catch (err) {
    return { success: false, error: `${err}` };
  }

  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        PROGRAM_ID,
      )[0],
      mint: mintKeypair.publicKey,
      mintAuthority: publicKey,
      payer: publicKey,
      updateAuthority: publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: name,
          symbol: symbol,
          uri: metaUrl,
          creators: null,
          sellerFeeBasisPoints: 0,
          uses: null,
          collection: null,
        },
        isMutable: false,
        collectionDetails: null,
      },
    },
  );

  const createNewTokenTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      publicKey,
      publicKey,
      TOKEN_PROGRAM_ID),
    createAssociatedTokenAccountInstruction(
      publicKey,
      tokenATA,
      publicKey,
      mintKeypair.publicKey,
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      tokenATA,
      publicKey,
      totalSupply * Math.pow(10, decimals),
    ),
    createMetadataInstruction
  );

  try {
    const signature = await wallet.sendTransaction(createNewTokenTransaction, solConnection, { signers: [mintKeypair] });
    return { success: true, mint: mintKeypair.publicKey.toBase58(), signature: signature }
  } catch (err) {
    return { success: false, error: `${err}` };
  }
}

/******************************** POOL MANAGE ********************************/
export async function getVaultOwnerAndNonce(
  marketAddress: PublicKey,
  dexAddress: PublicKey
): Promise<[vaultOwner: PublicKey, nonce: BN]> {
  const nonce = new BN(0);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [marketAddress.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
        dexAddress
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
}

export async function createOpenBookMarket(
  wallet: WalletContextState,
  baseTokenAddress: string,
  quoteTokenAddress: string,
  lotSize: number,
  tickSize: number,
  eventQueueLength: number,
  requestQueueLength: number,
  orderbookLength: number
) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  }

  const baseMint = new PublicKey(baseTokenAddress);
  const quoteMint = new PublicKey(quoteTokenAddress);
  const { Keypair, SystemProgram } = web3;
  const marketAccounts = {
    market: Keypair.generate(),
    requestQueue: Keypair.generate(),
    eventQueue: Keypair.generate(),
    bids: Keypair.generate(),
    asks: Keypair.generate(),
    baseVault: Keypair.generate(),
    quoteVault: Keypair.generate(),
  };
  const programID = getOpenbookData().orderBookProgramId;
  const vaultInstructions: web3.TransactionInstruction[] = []
  const vaultSigners: web3.Signer[] = []
  const [vaultOwner, vaultOwnerNonce] = await getVaultOwnerAndNonce(
    marketAccounts.market.publicKey,
    programID
  );

  vaultInstructions.push(
    ...[
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: marketAccounts.baseVault.publicKey,
        lamports: await solConnection.getMinimumBalanceForRentExemption(
          ACCOUNT_SIZE
        ),
        space: ACCOUNT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: marketAccounts.quoteVault.publicKey,
        lamports: await solConnection.getMinimumBalanceForRentExemption(
          ACCOUNT_SIZE
        ),
        space: ACCOUNT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccountInstruction(
        marketAccounts.baseVault.publicKey,
        baseMint,
        vaultOwner
      ),
      createInitializeAccountInstruction(
        marketAccounts.quoteVault.publicKey,
        quoteMint,
        vaultOwner
      ),
    ]
  );
  vaultSigners.push(marketAccounts.baseVault, marketAccounts.quoteVault);
  const [baseMintAccountInfo, quoteMintAccountInfo] = await solConnection.getMultipleAccountsInfo([baseMint, quoteMint])
  let baseMintDecimals: number;
  let quoteMintDecimals: number;
  if (!baseMintAccountInfo || !quoteMintAccountInfo) 
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  try {
    baseMintDecimals = MintLayout.decode(baseMintAccountInfo.data).decimals
    quoteMintDecimals = MintLayout.decode(quoteMintAccountInfo.data).decimals
  } catch (error) {
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  }
  const baseLotSize = new BN(Math.round(10 ** baseMintDecimals * lotSize))
  const quoteLotSize = new BN(Math.round(lotSize * 10 ** quoteMintDecimals * tickSize))
  if (baseLotSize.eq(ZERO)) return { Err: 'lot size is too small' }
  if (quoteLotSize.eq(ZERO)) return { Err: 'tick size or lot size is too small' }
  // log({ baseLotSize: baseLotSize.toNumber() })
  // log({ quoteLotSize: quoteLotSize.toNumber() })

  // create market account
  const marketInstructions: web3.TransactionInstruction[] = []
  const marketSigners: web3.Signer[] = [marketAccounts.market, marketAccounts.bids, marketAccounts.asks, marketAccounts.eventQueue, marketAccounts.requestQueue]
  marketInstructions.push(
    SystemProgram.createAccount({
      newAccountPubkey: marketAccounts.market.publicKey,
      fromPubkey: wallet.publicKey,
      space: Market.getLayout(programID).span,
      lamports: await solConnection.getMinimumBalanceForRentExemption(
        Market.getLayout(programID).span
      ),
      programId: programID,
    })
  );
  
  // create request queue
  marketInstructions.push(
    SystemProgram.createAccount({
      newAccountPubkey: marketAccounts.requestQueue.publicKey,
      fromPubkey: wallet.publicKey,
      space: requestQueueLength,
      lamports: await solConnection.getMinimumBalanceForRentExemption(
        requestQueueLength
      ),
      programId: programID,
    })
  );
  // create event queue
  marketInstructions.push(
    SystemProgram.createAccount({
      newAccountPubkey: marketAccounts.eventQueue.publicKey,
      fromPubkey: wallet.publicKey,
      space: eventQueueLength,
      lamports: await solConnection.getMinimumBalanceForRentExemption(
        eventQueueLength
      ),
      programId: programID,
    })
  );

  const orderBookRentExempt =
    await solConnection.getMinimumBalanceForRentExemption(orderbookLength);
  // create bids
  marketInstructions.push(
    SystemProgram.createAccount({
      newAccountPubkey: marketAccounts.bids.publicKey,
      fromPubkey: wallet.publicKey,
      space: orderbookLength,
      lamports: orderBookRentExempt,
      programId: programID,
    })
  );
  // create asks
  marketInstructions.push(
    SystemProgram.createAccount({
      newAccountPubkey: marketAccounts.asks.publicKey,
      fromPubkey: wallet.publicKey,
      space: orderbookLength,
      lamports: orderBookRentExempt,
      programId: programID,
    })
  );
  marketInstructions.push(
    DexInstructions.initializeMarket({
      market: marketAccounts.market.publicKey,
      requestQueue: marketAccounts.requestQueue.publicKey,
      eventQueue: marketAccounts.eventQueue.publicKey,
      bids: marketAccounts.bids.publicKey,
      asks: marketAccounts.asks.publicKey,
      baseVault: marketAccounts.baseVault.publicKey,
      quoteVault: marketAccounts.quoteVault.publicKey,
      baseMint,
      quoteMint,
      baseLotSize,
      quoteLotSize,
      feeRateBps: 150, // Unused in v3
      quoteDustThreshold: new BN(500), // Unused in v3
      vaultSignerNonce: vaultOwnerNonce,
      programId: programID,
    })
  );

  const vaultTransaction = new Transaction().add(...vaultInstructions);
  try {
    const blockHash = (await solConnection.getLatestBlockhash()).blockhash;
    vaultTransaction.feePayer = wallet.publicKey;
    vaultTransaction.recentBlockhash = blockHash;

    // const signed = await wallet.signTransaction(vaultTransaction);
    const signature = await wallet.sendTransaction(vaultTransaction, solConnection, { signers: vaultSigners });
    await solConnection.confirmTransaction(signature);
    const txHash = (await signature).toString();
    console.log("vault signamture : ", txHash);

  } catch (error) {
    console.error("Error creating market:", error);
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  }

  const marketTransaction = new Transaction().add(...marketInstructions);
  try {
    const blockHash = (await solConnection.getLatestBlockhash()).blockhash;
    marketTransaction.feePayer = wallet.publicKey;
    marketTransaction.recentBlockhash = blockHash;

    // const signed = await wallet.signTransaction(marketTransaction);
    const signature = await wallet.sendTransaction(marketTransaction, solConnection, { signers: marketSigners });
    await solConnection.confirmTransaction(signature);
    const txHash = (await signature).toString();
    console.log("market signamture : ", txHash);

    return {
      status: 'success',
      txids: [signature],
      address: marketAccounts.market.publicKey.toBase58(),
    };
  } catch (error) {
    console.error("Error creating market:", error);
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  }


  // const marketLamports = await solConnection.getMinimumBalanceForRentExemption(Market.getLayout(programId).span);
  // const eventLamports = await solConnection.getMinimumBalanceForRentExemption(eventQueueLength);
  // const requestLamports = await solConnection.getMinimumBalanceForRentExemption(requestQueueLength);
  // const orderLamports = await solConnection.getMinimumBalanceForRentExemption(orderbookLength);
  // const vaultLamports = await solConnection.getMinimumBalanceForRentExemption(165);

  // if (!marketLamports || !eventLamports || !requestLamports || !orderLamports || !vaultLamports)
  //   return {
  //     status: 'failed',
  //     txids: [],
  //     address: '',
  //   };

  // console.log("LAMPORTS: ", marketLamports, eventLamports, requestLamports, orderLamports);
  // // Calculate vault signer nonce
  // const [vaultOwner, vaultOwnerNonce] = await getVaultOwnerAndNonce(
  //   marketAccount.publicKey,
  //   programId
  // );

  // if (!vaultOwnerNonce || !vaultOwner)
  //   return {
  //     status: 'failed',
  //     txids: [],
  //     address: '',
  //   };

  // console.log("VaultSignerNonce: ", vaultOwnerNonce, vaultOwner);

  // // create vault account
  // const vaultInstructions: web3.TransactionInstruction[] = [];
  // const vaultSigners: web3.Signer[] = [baseVault, quoteVault];
  // const vaultTransaction = new Transaction();
  // vaultInstructions.push(
  //   ...[
  //     SystemProgram.createAccount({
  //       fromPubkey: wallet.publicKey,
  //       newAccountPubkey: baseVault.publicKey,
  //       lamports: vaultLamports,
  //       space: 165,
  //       programId: TOKEN_PROGRAM_ID,
  //     }),
  //     SystemProgram.createAccount({
  //       fromPubkey: wallet.publicKey,
  //       newAccountPubkey: quoteVault.publicKey,
  //       lamports: vaultLamports,
  //       space: 165,
  //       programId: TOKEN_PROGRAM_ID,
  //     }),
  //     createInitializeAccountInstruction(
  //       baseVault.publicKey,
  //       baseMint,
  //       vaultOwner,
  //     ),
  //     createInitializeAccountInstruction(
  //       quoteVault.publicKey,
  //       quoteMint,
  //       vaultOwner,
  //     ),
  //   ]
  // );

  // vaultTransaction.add(...vaultInstructions);

  // try {
  //   const blockHash = (await solConnection.getLatestBlockhash()).blockhash;
  //   vaultTransaction.feePayer = wallet.publicKey;
  //   vaultTransaction.recentBlockhash = blockHash;

  //   // const signed = await wallet.signTransaction(vaultTransaction);
  //   const signature = await wallet.sendTransaction(vaultTransaction, solConnection, { signers: vaultSigners });
  //   await solConnection.confirmTransaction(signature);
  //   const txHash = (await signature).toString();
  //   console.log("vault signamture : ", txHash);

  // } catch (error) {
  //   console.error("Error creating market:", error);
  //   return {
  //     status: 'failed',
  //     txids: [],
  //     address: '',
  //   };
  // }

  // // create market, account(market, event, request, bid, ask)
  // const accountTransaction = new Transaction();
  // const accountInstructions: web3.TransactionInstruction[] = []
  // const accountSigners: web3.Signer[] = [marketAccount, requestQueue, eventQueue, bids, asks]

  // accountInstructions.push(
  //   ...[
  //     SystemProgram.createAccount({
  //       newAccountPubkey: marketAccount.publicKey,
  //       fromPubkey: wallet.publicKey,
  //       space: Market.getLayout(programId).span,
  //       lamports: marketLamports,
  //       programId: programId,
  //     }),
  //     SystemProgram.createAccount({
  //       newAccountPubkey: requestQueue.publicKey,
  //       fromPubkey: wallet.publicKey,
  //       space: requestQueueLength,
  //       lamports: requestLamports,
  //       programId: programId,
  //     }),
  //     SystemProgram.createAccount({
  //       newAccountPubkey: eventQueue.publicKey,
  //       fromPubkey: wallet.publicKey,
  //       space: eventQueueLength,
  //       lamports: eventLamports,
  //       programId: programId,
  //     }),
  //     SystemProgram.createAccount({
  //       newAccountPubkey: bids.publicKey,
  //       fromPubkey: wallet.publicKey,
  //       space: orderbookLength,
  //       lamports: orderLamports,
  //       programId: programId,
  //     }),
  //     SystemProgram.createAccount({
  //       newAccountPubkey: asks.publicKey,
  //       fromPubkey: wallet.publicKey,
  //       space: orderbookLength,
  //       lamports: orderLamports,
  //       programId: programId,
  //     })
  //   ]
  // );

  // accountTransaction.add(...accountInstructions);

  // try {
  //   const blockHash = (await solConnection.getLatestBlockhash()).blockhash;
  //   accountTransaction.feePayer = wallet.publicKey;
  //   accountTransaction.recentBlockhash = blockHash;

  //   // const signed = await wallet.signTransaction(accountTransaction);
  //   const signature = await wallet.sendTransaction(accountTransaction, solConnection, { signers: accountSigners });
  //   await solConnection.confirmTransaction(signature);
  //   const txHash = (await signature).toString();
  //   console.log("account signamture : ", txHash);

  // } catch (error) {
  //   console.error("Error creating market:", error);
  //   return {
  //     status: 'failed',
  //     txids: [],
  //     address: '',
  //   };
  // }

  // // create market, account(market, event, request, bid, ask)
  // const marketTransaction = new Transaction();
  // const marketInstructions: web3.TransactionInstruction[] = []
  // // const marketSigners: web3.Signer[] = [marketAccount, requestQueue, eventQueue, bids, asks]

  // marketInstructions.push(
  //   ...[
  //     DexInstructions.initializeMarket({
  //       market: marketAccount.publicKey,
  //       requestQueue: requestQueue.publicKey,
  //       eventQueue: eventQueue.publicKey,
  //       bids: bids.publicKey,
  //       asks: asks.publicKey,
  //       baseVault: baseVault.publicKey,
  //       quoteVault: quoteVault.publicKey,
  //       baseMint,
  //       quoteMint,
  //       baseLotSize: new BN(lotSize),
  //       quoteLotSize: new BN(tickSize),
  //       feeRateBps: 150, // Unused in v3
  //       quoteDustThreshold: new BN(500), // Unused in v3
  //       vaultSignerNonce: vaultOwnerNonce,
  //       programId: programId,
  //     })
  //   ]
  // );
  // console.log("Accounts: ", marketAccount.publicKey.toBase58(), requestQueue.publicKey.toBase58(), eventQueue.publicKey.toBase58(), bids.publicKey.toBase58(), asks.publicKey.toBase58())

  // marketTransaction.add(...marketInstructions);

  // try {
  //   const blockHash = (await solConnection.getLatestBlockhash()).blockhash;
  //   marketTransaction.feePayer = wallet.publicKey;
  //   marketTransaction.recentBlockhash = blockHash;
  //   // const signed = await wallet.signTransaction(marketTransaction);
  //   const signature = await wallet.sendTransaction(marketTransaction, solConnection, { maxRetries: 20, skipPreflight: true });
  //   await solConnection.confirmTransaction(signature);
  //   const txHash = (await signature).toString();
  //   console.log("market signamture : ", txHash);

  //   return {
  //     status: 'success',
  //     txids: [signature],
  //     address: marketAccount.publicKey.toBase58(),
  //   };
  // } catch (error) {
  //   console.error("Error creating market:", error);
  //   return {
  //     status: 'failed',
  //     txids: [],
  //     address: '',
  //   };
  // }
}

// export async function createOpenBookMarket(
//   wallet: WalletContextState, 
//   baseTokenAddress: string, 
//   quoteTokenAddress: string,
//   lotSize: number,
//   tickSize: number
// ) {
//   const owner = wallet.publicKey;

//   if (!owner || !wallet.signTransaction) {
//     return {
//       status: 'failed',
//       txids: [],
//       address: '',
//     };
//   }

//   const raydium = await initSdk(wallet)

//   const baseToken = await getToken(raydium, baseTokenAddress);
//   const quoteToken = await getToken(raydium, quoteTokenAddress);

//   // check mint info here: https://api-v3.raydium.io/mint/list
//   // or get mint info by api: await raydium.token.getTokenInfo('mint address')

//   try {
//     const { execute, extInfo, transactions } = await raydium.marketV2.create({
//       baseInfo: {
//         mint: baseToken.mint,
//         decimals: baseToken.decimals,
//       },
//       quoteInfo: {
//         mint: quoteToken.mint,
//         decimals: quoteToken.decimals,
//       },
//       lotSize: lotSize, // 1
//       tickSize: tickSize, // 0.01
//       dexProgramId: OPENBOOK_PROGRAM_ID, // OPEN_BOOK_PROGRAM, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
//       txVersion,
//       // optional: set up priority fee here
//       computeBudgetConfig: {
//         units: 600000,
//         microLamports: 100000000,
//       },
//     })

//     console.log(
//       `create market total ${transactions.length} txs, market info: `,
//       Object.keys(extInfo.address).reduce(
//         (acc, cur) => ({
//           ...acc,
//           [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
//         }),
//         {}
//       )
//     )

//     const txIds = await execute({
//       // set sequentially to true means tx will be sent when previous one confirmed
//       sequentially: true,
//     })
//     console.log('create market txIds:', txIds)

//     return {
//       status: 'success',
//       txids: txIds.txIds,
//       address: extInfo.address.marketId.toBase58(),
//     };
//   } catch (err) {
//     return {
//       status: 'failed',
//       txids: [],
//       address: ''
//     };
//   }
// }
export function calcNonDecimalValue(value: number, decimals: number): number {
  return Math.trunc(value * (Math.pow(10, decimals)))
}

export async function createAmmPool(
  wallet: WalletContextState,
  baseTokenAddress: string,
  quoteTokenAddress: string,
  market: string,
  addBase: number,
  addQuote: number,
  launchDate: string
) {
  if (!wallet)
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'invalid wallet',
    };
  if (!wallet.publicKey || !wallet.signTransaction)
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'invalid wallet',
    };

  const openBookData = getOpenbookData();

  const baseMint = new PublicKey(baseTokenAddress);
  const quoteMint = new PublicKey(quoteTokenAddress);
  const marketId = new PublicKey(market);

  const userBaseAta = getAssociatedTokenAddressSync(baseMint, wallet.publicKey);
  const userQuoteAta = getAssociatedTokenAddressSync(quoteMint, wallet.publicKey);

  let [baseMintAccountInfo, quoteMintAccountInfo, marketAccountInfo, userBaseAtaInfo, userQuoteAtaInfo] = await solConnection.getMultipleAccountsInfo([baseMint, quoteMint, marketId, userBaseAta, userQuoteAta]).catch(() => [null, null, null, null])
  if (!baseMintAccountInfo || !quoteMintAccountInfo || !marketAccountInfo) throw "AccountInfo not found"

  // Check base token balance
  const baseTokenBalance = await getBalance(wallet, baseTokenAddress);
  console.log("BASE------", baseTokenBalance, addBase)
  if (!baseTokenBalance || addBase > baseTokenBalance) {
    console.log("Please ensure that the base token amount is lower than your current token balance:");
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'insufficient balance',
    };
  }

  // Check quote token balance
  const quoteTokenBalance = await getBalance(wallet, quoteTokenAddress);
  console.log("QUOTE------", quoteTokenBalance, addQuote)
  if (!quoteTokenBalance || addQuote > quoteTokenBalance) {
    console.log("Please ensure that the quote token amount is lower than your current token balance:");
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'insufficient balance',
    };
  }

  if (baseMint.toBase58() != NATIVE_MINT.toBase58() && !userBaseAtaInfo) throw "Don't have enought tokens"
  else {
    if (baseMint.toBase58() == NATIVE_MINT.toBase58()) {
      const todo = web3.PublicKey.default
      const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
      SPL_ACCOUNT_LAYOUT.encode({
        mint: NATIVE_MINT,
        amount: new BN(0),
        isNative: new BN(1),
        owner: wallet.publicKey,
        closeAuthority: todo,
        closeAuthorityOption: 1,
        delegate: todo,
        delegatedAmount: new BN(1),
        delegateOption: 1,
        isNativeOption: 1,
        state: 1
      }, buf)
      userBaseAtaInfo = {
        data: buf,
      } as any
    }
  }
  if (quoteMint.toBase58() != NATIVE_MINT.toBase58() && !userQuoteAtaInfo) throw "Don't have enought tokens"
  else {
    if (quoteMint.toBase58() == NATIVE_MINT.toBase58()) {
      const todo = web3.PublicKey.default
      const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
      SPL_ACCOUNT_LAYOUT.encode({
        mint: NATIVE_MINT,
        amount: new BN(0),
        isNative: new BN(1),
        owner: wallet.publicKey,
        closeAuthority: todo,
        closeAuthorityOption: 1,
        delegate: todo,
        delegatedAmount: new BN(1),
        delegateOption: 1,
        isNativeOption: 1,
        state: 1
      }, buf)
      userQuoteAtaInfo = {
        data: buf,
      } as any
    }
  }

  const baseMintState = MintLayout.decode(baseMintAccountInfo.data);
  const quoteMintState = MintLayout.decode(quoteMintAccountInfo.data);

  const marketInfo = {
    marketId: marketId,
    programId: marketAccountInfo.owner
  }
  const baseMintInfo = {
    mint: baseMint,
    decimals: baseMintState.decimals
  }
  const quoteMintInfo = {
    mint: quoteMint,
    decimals: quoteMintState.decimals
  }
  const baseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(addBase, baseMintState.decimals).toString()), 8))
  const quoteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(addQuote, quoteMintState.decimals).toString()), 8))

  const startTime = new BN(Math.trunc(Date.parse(launchDate) / 1000))

  try {

    const createPoolIxs = (await Liquidity.makeCreatePoolV4InstructionV2Simple({
      marketInfo,
      baseMintInfo,
      quoteMintInfo,
      baseAmount,
      quoteAmount,
      associatedOnly: true,
      checkCreateATAOwner: true,
      connection: solConnection,
      feeDestinationId: openBookData.feeDestinationId,
      makeTxVersion: TxVersion.LEGACY,
      ownerInfo: {
        feePayer: wallet.publicKey,
        tokenAccounts: [
          { accountInfo: SPL_ACCOUNT_LAYOUT.decode(userBaseAtaInfo!.data), programId: TOKEN_PROGRAM_ID, pubkey: userBaseAta },
          { accountInfo: SPL_ACCOUNT_LAYOUT.decode(userQuoteAtaInfo!.data), programId: TOKEN_PROGRAM_ID, pubkey: userQuoteAta }
        ],
        wallet: wallet.publicKey,
        useSOLBalance: true
      },
      programId: openBookData.ammProgramId,
      startTime
      // computeBudgetConfig: { microLamports: 250_000, units: 8000_000 },
    })).innerTransactions

    const ixs: web3.TransactionInstruction[] = []
    const signers: web3.Signer[] = []
    // ixs.push(...createPoolIxs.instructions)
    // signers.push(...createPoolIxs.signers)
    for (let ix of createPoolIxs) {
      ixs.push(...ix.instructions)
      signers.push(...ix.signers)
    }

    const recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;
    const tx = new Transaction().add(...ixs);

    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = recentBlockhash;

    const txSignature = await wallet.sendTransaction(tx, solConnection, { maxRetries: 20, skipPreflight: true });
    await solConnection.confirmTransaction(txSignature);
    const txHash = (await txSignature).toString();
    console.log("pool transaction hash: ", txHash);

    const lpMint = Liquidity.getAssociatedLpMint({ marketId: marketInfo.marketId, programId: openBookData.ammProgramId }).toBase58();
    const poolId = await Liquidity.getAssociatedId({ marketId: marketInfo.marketId, programId: openBookData.ammProgramId }).toBase58();

    return {
      status: 'success',
      txid: txSignature,
      address: poolId, // Add pool address if available
      lpMint: lpMint, // Add LP mint address if available
      msg: 'Pool created successfully',
    };

  } catch (error) {
    console.error("Error creating pool:", error);
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: `Error: ${error}`,
    };
  }
}

// export async function createAmmPool(
//   wallet: WalletContextState,
//   baseTokenAddress: string,
//   quoteTokenAddress: string,
//   market: string,
//   addBase: number,
//   addQuote: number
// ) {
//   if (!wallet)
//     return {
//       status: 'failed',
//       txid: '',
//       address: '',
//       lpMint: '',
//       msg: 'invalid wallet',
//     };
//   if (!wallet.publicKey)
//     return {
//       status: 'failed',
//       txid: '',
//       address: '',
//       lpMint: '',
//       msg: 'invalid wallet',
//     };

//   const raydium = await initSdk(wallet)
//   const marketId = new PublicKey(market) // new PublicKey(`<you market id here>`)

//   const baseToken = await getToken(raydium, baseTokenAddress);
//   const quoteToken = await getToken(raydium, quoteTokenAddress);

//   // create a pool in the newly created market
//   const baseB = new BN(addBase)
//   const baseD = new BN(10 ** baseToken.decimals);
//   const quoteB = new BN(addQuote)
//   const quoteD = new BN(10 ** quoteToken.decimals);
//   const addBaseAmount = baseB.mul(baseD)
//   const addQuoteAmount = quoteB.mul(quoteD);

//   // Check base token balance
//   const baseTokenBalance = await getTokenBalance(wallet.publicKey, baseToken.mint);
//   console.log("BASE------", baseTokenBalance, addBaseAmount.toNumber())
//   if (!baseTokenBalance || addBaseAmount.cmp(new BN(baseTokenBalance)) == 1) {
//     console.log("Please ensure that the base token amount is lower than your current token balance:");
//     return {
//       status: 'failed',
//       txid: '',
//       address: '',
//       lpMint: '',
//       msg: 'insufficient balance',
//     };
//   }

//   // Check quote token balance
//   const quoteTokenBalance = await getTokenBalance(wallet.publicKey, quoteToken.mint);
//   console.log("QUOTE------", quoteTokenBalance, addQuoteAmount.toNumber())
//   if (!quoteTokenBalance || addQuoteAmount.cmp(new BN(quoteTokenBalance)) == 1) {
//     console.log("Please ensure that the quote token amount is lower than your current token balance:");
//     return {
//       status: 'failed',
//       txid: '',
//       address: '',
//       lpMint: '',
//       msg: 'insufficient balance',
//     };
//   }

//   // if you are confirmed your market info, don't have to get market info from rpc below
//   // const marketBufferInfo = await raydium.connection.getAccountInfo(new PublicKey(marketId))
//   // const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data)

//   // check mint info here: https://api-v3.raydium.io/mint/list
//   // or get mint info by api: await raydium.token.getTokenInfo('mint address')

//   // const baseMintInfo = await raydium.token.getTokenInfo(baseMint)
//   // const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint)

//   try {
//     const { execute, extInfo } = await raydium.liquidity.createPoolV4({
//       programId: AMMV4_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.AmmV4
//       marketInfo: {
//         marketId,
//         programId: OPENBOOK_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
//       },
//       baseMintInfo: {
//         mint: baseToken.mint, // baseMint,
//         decimals: baseToken.decimals, // baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
//       },
//       quoteMintInfo: {
//         mint: quoteToken.mint, // quoteMint,
//         decimals: quoteToken.decimals, // quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
//       },
//       baseAmount: addBaseAmount, // new BN(1000),
//       quoteAmount: addQuoteAmount, // new BN(1000),
//       startTime: new BN(0),
//       ownerInfo: {
//         useSOLBalance: true,
//       },
//       associatedOnly: false,
//       txVersion,
//       feeDestinationId: AMMV4_FEE_DESTINATION_ID, // FEE_DESTINATION_ID, // devnet: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID
//       // optional: set up priority fee here
//       computeBudgetConfig: {
//         units: 600000,
//         microLamports: 10000000,
//       },
//     })

//     const { txId } = await execute()
//     console.log(
//       'amm pool created! txId: ',
//       txId,
//       ', poolKeys:',
//       Object.keys(extInfo.address).reduce(
//         (acc, cur) => ({
//           ...acc,
//           [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
//         }),
//         {}
//       )
//     )

//     return {
//       status: 'success',
//       txid: txId,
//       address: extInfo.address.ammId.toBase58(),
//       lpMint: extInfo.address.lpMint.toBase58()
//     };

//   } catch (err) {
//     console.error('Pool creation failed:', err?.toString())
//     return {
//       status: 'failed',
//       txid: '',
//       address: '',
//       lpMint: '',
//       msg: err?.toString()
//     };
//   }
// }