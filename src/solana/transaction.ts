import * as anchor from "@project-serum/anchor";

import {
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';

import { IDL as PresaleContractIDL, PresaleContract } from "./prnt";

import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { solConnection } from "../utils/WebIntegration";
import { PresalePool } from "./type";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
    GLOBAL_AUTHORITY_SEED,
    MYPRO_ID,
    PRESALE_SIZE,
    EMPTY_USER,
    ADMIN_WALLET_ADDRESS
} from "../config"

import { getDecimals } from "../utils/WebIntegration";

// const { Metadata } = require('@metaplex-foundation/mpl-token-metadata');

export const globalAuthority = async () => {
    const [globalAuthority, _bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        new PublicKey(MYPRO_ID)
    );
    return globalAuthority.toBase58();
}

export const initProject = async (
    wallet: AnchorWallet | undefined
) => {
    console.log("initProject-step1 : ", wallet);
    if (!wallet) return;

    let provider = new anchor.AnchorProvider(solConnection, wallet as anchor.Wallet, { skipPreflight: true })

    const program: anchor.Program<PresaleContract> = new anchor.Program(PresaleContractIDL, MYPRO_ID, provider) as anchor.Program<PresaleContract>;

    const [globalAuthority, _bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    let tx = new Transaction();

    console.log("initProject-step2 : ", provider.publicKey.toBase58(), globalAuthority.toBase58());

    const ix = await program.methods.initialize().accounts({
        admin: provider.publicKey,
        globalAuthority,
        systemProgram: SystemProgram.programId,
    }).instruction();
    tx.add(ix);

    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash;
    const signedTx = await wallet.signTransaction(tx);
    const txId = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });

    console.log("txHash =", txId);

    return true;
}

export const createPresale = async (
    wallet: AnchorWallet | undefined,
    baseTokenMint: PublicKey,
    quoteTokenMint: PublicKey,
    min_allocation: number,
    max_allocation: number,
    hardcap: number,
    softcap: number,
    sale_price: number,
    launch_price: number,
    start_time: number,
    end_time: number
) => {
    if (!wallet) return null;
    let provider = new anchor.AnchorProvider(solConnection, wallet as anchor.Wallet, { skipPreflight: true })
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);
    try {

        const tx = await createPresaleTx(
            wallet,
            program,
            baseTokenMint,
            quoteTokenMint,
            min_allocation,
            max_allocation,
            hardcap,
            softcap,
            sale_price,
            launch_price,
            start_time,
            end_time
        );

        if (!tx)
            return null;

        const blockHash = await program.provider.connection.getLatestBlockhash();

        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockHash.blockhash;
        const signedTx = await wallet.signTransaction(tx);
        const txId = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });

        const signature = await solConnection.confirmTransaction(
            {
                blockhash: blockHash.blockhash,
                lastValidBlockHeight: blockHash.lastValidBlockHeight,
                signature: txId,
            },
            "finalized"
        );

        console.log("txHash =", signature);
        return signature;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const buyTokens = async (
    wallet: AnchorWallet | undefined,
    presaleKey: PublicKey,
    amount: number
) => {
    if (!wallet) return null;
    let provider = new anchor.AnchorProvider(solConnection, wallet as anchor.Wallet, { skipPreflight: true })
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);

    try {
        const tx = await buyTokensTx(
            wallet,
            program,
            presaleKey,
            amount
        );

        if (!tx) return null;

        const blockHash = await program.provider.connection.getLatestBlockhash();
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockHash.blockhash;
        const signedTx = await wallet.signTransaction(tx);
        const txId = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });

        const signature = await solConnection.confirmTransaction(
            {
                blockhash: blockHash.blockhash,
                lastValidBlockHeight: blockHash.lastValidBlockHeight,
                signature: txId,
            },
            "finalized"
        );

        console.log("txHash =", signature);
        return signature;
    } catch (error) {
        console.log(error)
    }
}

export const setApprove = async (
    wallet: AnchorWallet | undefined,
    presaleKey: PublicKey,
) => {
    if (!wallet) return null;
    let provider = new anchor.AnchorProvider(solConnection, wallet as anchor.Wallet, { skipPreflight: true })
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);

    try {
        const tx = await setApproveTx(
            wallet,
            program,
            presaleKey,
        );

        if (!tx) return null;
        
        const blockHash = await program.provider.connection.getLatestBlockhash();

        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockHash.blockhash;
        const signedTx = await wallet.signTransaction(tx);
        const txId = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });

        const signature = await solConnection.confirmTransaction(
            {
                blockhash: blockHash.blockhash,
                lastValidBlockHeight: blockHash.lastValidBlockHeight,
                signature: txId,
            },
            "finalized"
        );

        console.log("txHash =", signature);
        return signature;
    } catch (error) {
        console.log(error)
    }
}

export const withdraw = async (
    wallet: AnchorWallet | undefined,
    presaleKey: PublicKey,
) => {
    if (!wallet) return null;
    let provider = new anchor.AnchorProvider(solConnection, wallet as anchor.Wallet, { skipPreflight: true })
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);

    try {
        const tx = await withdrawTx(
            wallet,
            program,
            presaleKey,
        );

        if (!tx) return null;

        const blockHash = await program.provider.connection.getLatestBlockhash()
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockHash.blockhash;
        const signedTx = await wallet.signTransaction(tx);
        const txId = await program.provider.connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });

        const signature = await solConnection.confirmTransaction(
            {
                blockhash: blockHash.blockhash,
                lastValidBlockHeight: blockHash.lastValidBlockHeight,
                signature: txId,
            },
            "finalized"
        );

        console.log("txHash =", signature);
        return signature;
    } catch (error) {
        console.log(error)
    }
}

export const createPresaleTx = async (
    wallet: AnchorWallet | undefined,
    program: anchor.Program,
    baseTokenMint: PublicKey,
    quoteTokenMint: PublicKey,
    min_allocation: number,
    max_allocation: number,
    hardcap: number,
    softcap: number,
    sale_price: number,
    launch_price: number,
    start_time: number,
    end_time: number
) => {
    if (!wallet) return;
    const [globalAuthority, _bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    // Base Token Account
    let baseTokenAccount = await getAssociatedTokenAccount(wallet.publicKey, baseTokenMint);
    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        wallet.publicKey,
        globalAuthority,
        [baseTokenMint]
    );

    //Quote Token Token Account on User Account
    let ix1 = await getATokenAccountsNeedCreate(
        solConnection,
        wallet.publicKey,
        wallet.publicKey,
        [quoteTokenMint]
    );

    let presale;
    let i;
    for (i = 11; i > 0; i--) {
        presale = await PublicKey.createWithSeed(
            wallet.publicKey,
            baseTokenMint.toBase58().slice(0, i),
            program.programId,
        );
        let state = await getStateByKey(presale);
        if (state === null) {
            break;
        }
    }

    let tx = new Transaction();
    if (presale) {
        let ix = SystemProgram.createAccountWithSeed({
            fromPubkey: wallet.publicKey,
            basePubkey: wallet.publicKey,
            seed: baseTokenMint.toBase58().slice(0, i),
            newAccountPubkey: presale,
            lamports: await solConnection.getMinimumBalanceForRentExemption(PRESALE_SIZE),
            space: PRESALE_SIZE,
            programId: program.programId,
        });

        tx.add(ix);
        if (ix0.instructions.length > 0) tx.add(...ix0.instructions)
        if (ix1.instructions.length > 0 && quoteTokenMint.toBase58() != EMPTY_USER) tx.add(...ix1.instructions)

        const baseDecRes = await getDecimals(baseTokenMint.toBase58());
        const quoteDecRes = await getDecimals(quoteTokenMint.toBase58());

        if (!baseDecRes.success || !quoteDecRes.success)
            return;

        const baseDecimals = baseDecRes.decimals;
        const quoteDecimals = quoteDecRes.decimals;

        const ix2 = await program.instruction.createPresale(
            new anchor.BN(min_allocation * 10 ** quoteDecimals),
            new anchor.BN(max_allocation * 10 ** quoteDecimals),
            new anchor.BN(hardcap * 10 ** quoteDecimals),
            new anchor.BN(softcap * 10 ** quoteDecimals),
            new anchor.BN(sale_price * 10 ** quoteDecimals),
            new anchor.BN(launch_price * 10 ** quoteDecimals),
            new anchor.BN(start_time),
            new anchor.BN(end_time),
            new anchor.BN(hardcap / sale_price),
            new anchor.BN(baseDecimals),
            baseTokenMint,
            quoteTokenMint,
            {
                accounts: {
                    owner: wallet.publicKey,
                    globalAuthority,
                    presale,
                    createrTokenAccount: baseTokenAccount,
                    destTokenAccount: ix0.destinationAccounts[0],
                    tokenMintAddress: baseTokenMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: []
            })
        tx.add(ix2);
    }

    return tx;
}

export const buyTokensTx = async (
    wallet: AnchorWallet | undefined,
    program: anchor.Program,
    presaleKey: PublicKey,
    amount: number
) => {
    if (!wallet) {
        return null
    }

    const [globalAuthority, bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();
    if (presaleKey) {
        const presaleState = await getStateByKey(presaleKey);
        if (!presaleState)
            return;

        const quoteToken = presaleState.quoteMint;
        const baseToken = presaleState.baseMint;

        if (presaleState) {
            const creator = presaleState.owner;

            let ix1 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                wallet.publicKey,
                [baseToken]
            );
            let ix2 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                globalAuthority,
                [baseToken]
            );
            let ix3 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                wallet.publicKey,
                [quoteToken]
            );
            let ix4 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                globalAuthority,
                [quoteToken]
            );

            if (ix1.instructions.length > 0 && baseToken.toBase58() != EMPTY_USER) { tx.add(...ix1.instructions) };
            if (ix2.instructions.length > 0 && baseToken.toBase58() != EMPTY_USER) { tx.add(...ix2.instructions) };
            if (ix3.instructions.length > 0 && quoteToken.toBase58() != EMPTY_USER) { tx.add(...ix3.instructions) };
            if (ix4.instructions.length > 0 && quoteToken.toBase58() != EMPTY_USER) { tx.add(...ix4.instructions) };

            const baseRes = await getDecimals(baseToken.toBase58())
            if (!baseRes.success) {
                return;
            }
            const quoteRes = await getDecimals(quoteToken.toBase58())
            if (!quoteRes.success) {
                return;
            }

            const isNative = (quoteToken.toBase58() === 'So11111111111111111111111111111111111111112') ? 1 : 0;

            console.log("User Base: ", ix1.destinationAccounts[0].toBase58());
            console.log("Global Base: ", ix2.destinationAccounts[0].toBase58());
            console.log("User Quote: ", ix3.destinationAccounts[0].toBase58());
            console.log("Global Quote: ", ix4.destinationAccounts[0].toBase58());
            console.log("Base, Quote, Global", baseToken.toBase58(), quoteToken.toBase58(), globalAuthority.toBase58(), isNative)

            // const userQuoteTokenAccount = (isNative === 1) ? wallet.publicKey : ix3.destinationAccounts[0];
            // const globalQuoteTokenAccount = (isNative === 1) ? globalAuthority : ix4.destinationAccounts[0];

            tx.add(program.instruction.buyTokens(
                new anchor.BN(amount * 10 ** quoteRes.decimals),
                new anchor.BN(baseRes.decimals),
                new anchor.BN(isNative),
                new anchor.BN(bump),
                {
                    accounts: {
                        buyer: wallet.publicKey,
                        presale: presaleKey,
                        globalAuthority,
                        creator,
                        userBaseTokenAccount: ix1.destinationAccounts[0],
                        globalBaseTokenAccount: ix2.destinationAccounts[0],
                        userQuoteTokenAccount: (isNative == 1) ? ix1.destinationAccounts[0] : ix3.destinationAccounts[0],
                        globalQuoteTokenAccount: (isNative == 1) ? ix2.destinationAccounts[0] : ix4.destinationAccounts[0],
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                    },
                    instructions: [],
                    signers: [],
                }));
        }

    }
    return tx;
}

export const setApproveTx = async (
    wallet: AnchorWallet | undefined,
    program: anchor.Program,
    presaleKey: PublicKey,
) => {
    if (!wallet) {
        return null
    }

    let tx = new Transaction();
    if (presaleKey) {
        const presaleState = await getStateByKey(presaleKey);
        if (!presaleState)
            return;

        tx.add(program.instruction.setApprove(
            {
                accounts: {
                    presale: presaleKey,
                },
                instructions: [],
                signers: [],
            }));
    }
    return tx;
}

export const withdrawTx = async (
    wallet: AnchorWallet | undefined,
    program: anchor.Program,
    presaleKey: PublicKey,
) => {
    if (!wallet) {
        return null
    }

    const [globalAuthority, bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();
    if (presaleKey) {
        const presaleState = await getStateByKey(presaleKey);
        if (!presaleState)
            return;

        const quoteToken = presaleState.quoteMint;
        const baseToken = presaleState.baseMint;

        if (presaleState) {
            const creator = presaleState.owner;

            let ix1 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                wallet.publicKey,
                [baseToken]
            );
            let ix2 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                globalAuthority,
                [baseToken]
            );
            let ix3 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                wallet.publicKey,
                [quoteToken]
            );
            let ix4 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                globalAuthority,
                [quoteToken]
            );
            let ix5 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                ADMIN_WALLET_ADDRESS,
                [baseToken]
            );
            let ix6 = await getATokenAccountsNeedCreate(
                solConnection,
                wallet.publicKey,
                ADMIN_WALLET_ADDRESS,
                [quoteToken]
            );

            if (ix1.instructions.length > 0 && baseToken.toBase58() != EMPTY_USER) { tx.add(...ix1.instructions) };
            if (ix2.instructions.length > 0 && baseToken.toBase58() != EMPTY_USER) { tx.add(...ix2.instructions) };
            if (ix3.instructions.length > 0 && quoteToken.toBase58() != EMPTY_USER) { tx.add(...ix3.instructions) };
            if (ix4.instructions.length > 0 && quoteToken.toBase58() != EMPTY_USER) { tx.add(...ix4.instructions) };
            if (ix5.instructions.length > 0 && baseToken.toBase58() != EMPTY_USER) { tx.add(...ix5.instructions) };
            if (ix6.instructions.length > 0 && quoteToken.toBase58() != EMPTY_USER) { tx.add(...ix6.instructions) };

            const baseRes = await getDecimals(baseToken.toBase58())
            if (!baseRes.success) {
                return;
            }
            const quoteRes = await getDecimals(quoteToken.toBase58())
            if (!quoteRes.success) {
                return;
            }

            const isNative = (quoteToken.toBase58() === 'So11111111111111111111111111111111111111112') ? 1 : 0;

            console.log("User Base: ", ix1.destinationAccounts[0].toBase58());
            console.log("Global Base: ", ix2.destinationAccounts[0].toBase58());
            console.log("User Quote: ", ix3.destinationAccounts[0].toBase58());
            console.log("Global Quote: ", ix4.destinationAccounts[0].toBase58());
            console.log("ADMIN Base: ", ix5.destinationAccounts[0].toBase58());
            console.log("ADMIN Quote: ", ix6.destinationAccounts[0].toBase58());
            console.log("Base, Quote, Global", baseToken.toBase58(), quoteToken.toBase58(), globalAuthority.toBase58(), isNative)

            tx.add(program.instruction.withdraw(
                new anchor.BN(baseRes.decimals),
                new anchor.BN(isNative),
                new anchor.BN(bump),
                {
                    accounts: {
                        buyer: wallet.publicKey,
                        presale: presaleKey,
                        globalAuthority,
                        creator,
                        userBaseTokenAccount: ix1.destinationAccounts[0],
                        globalBaseTokenAccount: ix2.destinationAccounts[0],
                        userQuoteTokenAccount: (isNative == 1) ? ix1.destinationAccounts[0] : ix3.destinationAccounts[0],
                        globalQuoteTokenAccount: (isNative == 1) ? ix2.destinationAccounts[0] : ix4.destinationAccounts[0],
                        admin: ADMIN_WALLET_ADDRESS,
                        adminQuoteTokenAccount: (isNative == 1) ? ix5.destinationAccounts[0] : ix6.destinationAccounts[0],
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                    },
                    instructions: [],
                    signers: [],
                }));
        }

    }
    return tx;

}

var byteArrayToInt = function (byteArray: Buffer) {
    var value = 0;
    for (var i = 0; i <= byteArray.length - 1; i++) {
        value = (value * 256) + byteArray[i];
    }
    return value;
};

export const getAllData = async () => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);
    let poolAccounts = await solConnection.getProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: PRESALE_SIZE,
                },
            ]
        }
    );

    let result = [];
    for (let i = 0; i < poolAccounts.length; i++) {
        const data = poolAccounts[i].account.data;

        let pos = 8;
        const owner = new PublicKey(data.slice(pos, pos + 32)); pos += 32;

        let buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const min_allocation = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const max_allocation = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const hardcap = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const softcap = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const sale_price = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const launch_price = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const start_time = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const end_time = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const total_contributions = byteArrayToInt(buf);

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const max_contribution = byteArrayToInt(buf);

        const base_mint = new PublicKey(data.slice(pos, pos + 32)); pos += 32;
        const quote_mint = new PublicKey(data.slice(pos, pos + 32)); pos += 32;

        buf = data.slice(pos, pos + 8).reverse(); pos += 8
        const state = byteArrayToInt(buf);

        result.push({
            presaleKey: poolAccounts[i].pubkey.toBase58(),
            owner: owner.toBase58(),
            base_mint: base_mint.toBase58(),
            quote_mint: quote_mint.toBase58(),
            min_allocation,
            max_allocation,
            hardcap,
            softcap,
            sale_price,
            launch_price,
            start_time,
            end_time,
            total_contributions,
            max_contribution,
            state
        });
    }

    return result;
}

export const getStateByKey = async (
    baseTokenKey: PublicKey
): Promise<PresalePool | null> => {

    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(PresaleContractIDL as anchor.Idl, MYPRO_ID, provider);
    try {
        let rentalState = await program.account.presale.fetch(baseTokenKey);
        return rentalState as unknown as PresalePool;
    } catch (err) {
        return null;
    }
}
const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        // if (walletAddress != owner) {
        //     const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
        //     response = await connection.getAccountInfo(userAccount);
        //     if (!response) {
        //         const createATAIx = createAssociatedTokenAccountInstruction(
        //             userAccount,
        //             walletAddress,
        //             owner,
        //             mint,
        //         );
        //         instructions.push(createATAIx);
        //     }
        // }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

// const getPDA = async (
//     mint: anchor.web3.PublicKey,
// ): Promise<anchor.web3.PublicKey> => {
//     const METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

//     return (
//         await anchor.web3.PublicKey.findProgramAddress(
//             [
//                 Buffer.from('metadata'),
//                 METADATA_PROGRAM_ID.toBuffer(),
//                 mint.toBuffer(),
//             ],
//             METADATA_PROGRAM_ID,
//         )
//     )[0];
// };

// export const getMetadataPDA = async (
//     // wallet: AnchorWallet | undefined,
//     mint: PublicKey
// ) => {
//     try {
//         let tokenmetaPubkey = await getPDA(mint);
//         const account = await Metadata.fromAccountAddress(solConnection, tokenmetaPubkey);
//         return account;
//     } catch {
//     }
// }