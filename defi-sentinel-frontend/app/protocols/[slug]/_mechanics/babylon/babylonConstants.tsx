
import React from 'react';
import { Bitcoin, Lock, ShieldCheck, Coins, Key } from 'lucide-react';

export enum ProtocolStep {
    IDLE = 0,
    LOCKING = 1,
    VALIDATION = 2,
    YIELD = 3,
    UNBONDING = 4
}

export interface StepInfo {
    title: string;
    description: string;
    technicalNote: string;
}

export const PROTOCOL_STEPS: Record<ProtocolStep, StepInfo> = {
    [ProtocolStep.IDLE]: {
        title: "Idle Bitcoin",
        description: "Bitcoin sits in the user's self-custodial wallet on Layer 1. It is currently secure but not generating yield.",
        technicalNote: "Standard P2WPKH or Taproot UTXO held by user private keys."
    },
    [ProtocolStep.LOCKING]: {
        title: "Trustless Time-Lock",
        description: "The user creates a special transaction that locks the BTC for a specific time. No coins are bridged or sent to a third party.",
        technicalNote: "Uses Bitcoin Script OP_CHECKLOCKTIMEVERIFY. The output is spendable only by the user after time T, or burnable if slashed."
    },
    [ProtocolStep.VALIDATION]: {
        title: "PoS Security",
        description: "The locked BTC powers a 'Virtual Validator'. This validator signs blocks on Proof-of-Stake chains, providing economic security.",
        technicalNote: "Babylon extracts Extractable One-Time Signatures (EOTS) to validate PoS chains without bridging the asset."
    },
    [ProtocolStep.YIELD]: {
        title: "Yield Generation",
        description: "In return for securing the PoS chain, the protocol generates rewards (tokens) which are distributed to the staker.",
        technicalNote: "Rewards are accumulated on the PoS chain and can be claimed or compounded."
    },
    [ProtocolStep.UNBONDING]: {
        title: "Unbonding & Withdrawal",
        description: "When the staking period ends or the user unbonds, the BTC becomes spendable again on Layer 1 along with accumulated yield.",
        technicalNote: "The time-lock expires, allowing the original private key to sign a spending transaction."
    }
};

export const STEP_ICONS = {
    [ProtocolStep.IDLE]: <Bitcoin className="w-6 h-6 text-orange-500" />,
    [ProtocolStep.LOCKING]: <Lock className="w-6 h-6 text-orange-400" />,
    [ProtocolStep.VALIDATION]: <ShieldCheck className="w-6 h-6 text-blue-400" />,
    [ProtocolStep.YIELD]: <Coins className="w-6 h-6 text-yellow-400" />,
    [ProtocolStep.UNBONDING]: <Key className="w-6 h-6 text-green-400" />,
};
