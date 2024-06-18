import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";

import BN from 'bn.js'
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, createMintToInstruction } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { WebBundlr } from '@bundlr-network/client';

import { solConnection, OPENBOOK_PROGRAM_ID, initSdk, txVersion, AMMV4_FEE_DESTINATION_ID, AMMV4_PROGRAM_ID, getToken, getTokenBalance } from "./IntegrationConfig";

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

export async function initializeBundlr(
  wallet: WalletContextState
) {
  if (!wallet.wallet) {
    throw new WalletNotConnectedError();
  }

  // initialise a bundlr client
  const bundler = new WebBundlr(
    'https://devnet.bundlr.network',
    'solana',
    wallet.wallet.adapter,
    { providerUrl: 'https://api.devnet.solana.com' }
  );

  console.log(bundler)

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

export async function createOpenBookMarket(
  wallet: WalletContextState, 
  baseTokenAddress: string, 
  quoteTokenAddress: string
) {
  const owner = wallet.publicKey;

  if (!owner || !wallet.signTransaction) {
    return {
      status: 'failed',
      txids: [],
      address: '',
    };
  }

  const raydium = await initSdk(wallet)

  const baseToken = await getToken(raydium, baseTokenAddress);
  const quoteToken = await getToken(raydium, quoteTokenAddress);

  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')

  try {
    const { execute, extInfo, transactions } = await raydium.marketV2.create({
      baseInfo: {
        mint: baseToken.mint,
        decimals: baseToken.decimals,
      },
      quoteInfo: {
        mint: quoteToken.mint,
        decimals: quoteToken.decimals,
      },
      lotSize: 1,
      tickSize: 0.01,
      dexProgramId: OPENBOOK_PROGRAM_ID, // OPEN_BOOK_PROGRAM, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
      txVersion,
      // optional: set up priority fee here
      computeBudgetConfig: {
        units: 600000,
        microLamports: 100000000,
      },
    })

    console.log(
      `create market total ${transactions.length} txs, market info: `,
      Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
        }),
        {}
      )
    )

    const txIds = await execute({
      // set sequentially to true means tx will be sent when previous one confirmed
      sequentially: true,
    })
    console.log('create market txIds:', txIds)

    return {
      status: 'success',
      txids: txIds.txIds,
      address: extInfo.address.marketId.toBase58(),
    };
  } catch (err) {
    return {
      status: 'failed',
      txids: [],
      address: ''
    };
  }
}

export async function createAmmPool (
  wallet: WalletContextState, 
  baseTokenAddress: string, 
  quoteTokenAddress: string,
  market: string,
  addBase: number,
  addQuote: number
) {
  if (!wallet)
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'invalid wallet',
    };
  if ( !wallet.publicKey )
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'invalid wallet',
    };

  const raydium = await initSdk(wallet)
  const marketId = new PublicKey(market) // new PublicKey(`<you market id here>`)

  const baseToken = await getToken(raydium, baseTokenAddress);
  const quoteToken = await getToken(raydium, quoteTokenAddress);

  // create a pool in the newly created market
  const baseB = new BN(addBase)
  const baseD = new BN(10 ** baseToken.decimals);
  const quoteB = new BN(addQuote)
  const quoteD = new BN(10 ** quoteToken.decimals);
  const addBaseAmount = baseB.mul(baseD)
  const addQuoteAmount = quoteB.mul(quoteD);
  
  // Check base token balance
  const baseTokenBalance = await getTokenBalance(wallet.publicKey, baseToken.mint);
  console.log("BASE------", baseTokenBalance, addBaseAmount.toNumber())
  if (!baseTokenBalance || addBaseAmount.cmp(new BN(baseTokenBalance)) == 1) {
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
  const quoteTokenBalance = await getTokenBalance(wallet.publicKey, quoteToken.mint);
  console.log("QUOTE------", quoteTokenBalance, addQuoteAmount.toNumber())
  if (!quoteTokenBalance || addQuoteAmount.cmp(new BN(quoteTokenBalance)) == 1) {
    console.log("Please ensure that the quote token amount is lower than your current token balance:");
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: 'insufficient balance',
    };
  }

  // if you are confirmed your market info, don't have to get market info from rpc below
  // const marketBufferInfo = await raydium.connection.getAccountInfo(new PublicKey(marketId))
  // const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data)

  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')

  // const baseMintInfo = await raydium.token.getTokenInfo(baseMint)
  // const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint)

  try {
    const { execute, extInfo } = await raydium.liquidity.createPoolV4({
      programId: AMMV4_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.AmmV4
      marketInfo: {
        marketId,
        programId: OPENBOOK_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
      },
      baseMintInfo: {
        mint: baseToken.mint, // baseMint,
        decimals: baseToken.decimals, // baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
      },
      quoteMintInfo: {
        mint: quoteToken.mint, // quoteMint,
        decimals: quoteToken.decimals, // quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
      },
      baseAmount: addBaseAmount, // new BN(1000),
      quoteAmount: addQuoteAmount, // new BN(1000),
      startTime: new BN(0),
      ownerInfo: {
        useSOLBalance: true,
      },
      associatedOnly: false,
      txVersion,
      feeDestinationId: AMMV4_FEE_DESTINATION_ID, // FEE_DESTINATION_ID, // devnet: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID
      // optional: set up priority fee here
      computeBudgetConfig: {
        units: 600000,
        microLamports: 10000000,
      },
    })

    const { txId } = await execute()
    console.log(
      'amm pool created! txId: ',
      txId,
      ', poolKeys:',
      Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
        }),
        {}
      )
    )

    return {
      status: 'success',
      txid: txId,
      address: extInfo.address.ammId.toBase58(),
      lpMint: extInfo.address.lpMint.toBase58()
    };

  } catch (err) {
    console.error('Pool creation failed:', err?.toString())
    return {
      status: 'failed',
      txid: '',
      address: '',
      lpMint: '',
      msg: err?.toString()
    };
  }
}