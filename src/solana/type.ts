import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export interface PresalePool {
    owner: PublicKey,
    baseMint: PublicKey,
    quoteMint: PublicKey,
    minAllocation: anchor.BN,
    maxAllocation: anchor.BN,
    hardcap: anchor.BN,
    softcap: anchor.BN,
    salePrice: anchor.BN,
    launchPrice: anchor.BN,
    startTime: anchor.BN,
    endTime: anchor.BN,
    totalContributions: anchor.BN,
    maxContribution: anchor.BN
}