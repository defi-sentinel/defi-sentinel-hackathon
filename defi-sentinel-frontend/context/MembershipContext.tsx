import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId, useSwitchChain } from 'wagmi';
import { fetchMembership, type MembershipResponse } from '@/lib/api';
import { CONTRACTS, FEES, TARGET_CHAIN } from '@/lib/constants';
import { PaymentContract } from '@/lib/abis';
import { erc20Abi } from 'viem';

export type MembershipTier = 'free' | 'monthly' | 'yearly';

export type SubscriptionStep = 'idle' | 'approving' | 'waiting-approval' | 'paying' | 'waiting-payment' | 'updating-backend' | 'completed' | 'error';

export interface MembershipState {
  tier: MembershipTier;
  expiryDate: number | null; // Timestamp
  isLoading: boolean;
  subscriptionStep: SubscriptionStep;
  membershipData: MembershipResponse | null;
  subscribe: (tier: 'monthly' | 'yearly' | 'custom', months?: number) => Promise<void>;
  refreshMembership: () => Promise<void>;
  resetSubscriptionState: () => void;
}

const MembershipContext = createContext<MembershipState | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [tier, setTier] = useState<MembershipTier>('free');
  const [expiryDate, setExpiryDate] = useState<number | null>(null);
  const [membershipData, setMembershipData] = useState<MembershipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStep, setSubscriptionStep] = useState<SubscriptionStep>('idle');

  // Wagmi hooks for contract interaction
  const { writeContractAsync } = useWriteContract();

  // Read current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDC as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address as `0x${string}`, CONTRACTS.PaymentContract as `0x${string}`] : undefined,
    chainId: TARGET_CHAIN.id,
    query: {
      enabled: !!address && !!CONTRACTS.USDC,
    }
  });

  // Read current balance
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.USDC as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: TARGET_CHAIN.id,
    query: {
      enabled: !!address && !!CONTRACTS.USDC,
    }
  });

  // Debug logging
  useEffect(() => {
    if (isConnected) {
      console.log("Payment State:", {
        targetChain: TARGET_CHAIN.name,
        targetChainId: TARGET_CHAIN.id,
        currentChainId: chainId,
        usdcAddress: CONTRACTS.USDC,
        walletAddress: address,
        allowance: currentAllowance?.toString(),
        balance: usdcBalance?.toString(),
      });
    }
  }, [isConnected, address, currentAllowance, chainId]);

  const loadMembership = async () => {
    if (!isConnected || !address) {
      setTier('free');
      setExpiryDate(null);
      setMembershipData(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchMembership(address);
      setMembershipData(data);

      if (data.expiryDate && data.expiryDate > Date.now()) {
        setTier(data.tier as MembershipTier);
        setExpiryDate(data.expiryDate);
      } else {
        setTier('free');
        setExpiryDate(null);
      }
    } catch (e) {
      console.error("Failed to load membership from API", e);
      setTier('free');
      setExpiryDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only auto-load membership if wallet is connected
    // Defer loading for better initial page performance
    if (isConnected && address) {
      // Use a small delay to not block initial render
      const timer = setTimeout(() => {
        loadMembership();
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    } else {
      // Clear data immediately if disconnected
      setTier('free');
      setExpiryDate(null);
      setMembershipData(null);
    }
  }, [address, isConnected]);

  const subscribe = async (newTier: 'monthly' | 'yearly' | 'custom', months: number = 1) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    // ENSURE CORRECT NETWORK
    if (chainId !== TARGET_CHAIN.id) {
      console.log(`Switching to ${TARGET_CHAIN.name}...`);
      try {
        await switchChainAsync({ chainId: TARGET_CHAIN.id });
      } catch (e: any) {
        throw new Error(`Please switch your wallet to ${TARGET_CHAIN.name} to continue.`);
      }
    }

    setIsLoading(true);
    setSubscriptionStep('idle');
    try {
      let durationMonths = months;
      if (newTier === 'monthly') durationMonths = 1;
      if (newTier === 'yearly') durationMonths = 12;

      // 1. Calculate Cost
      const yearCount = BigInt(Math.floor(durationMonths / 12));
      const monthCount = BigInt(durationMonths % 12);
      const cost = (yearCount * FEES.YEARLY) + (monthCount * FEES.MONTHLY);

      // 0. Check Balance
      if (!usdcBalance || usdcBalance < cost) {
        const balanceStr = usdcBalance ? (Number(usdcBalance) / 1e6).toFixed(2) : "0";
        const costStr = (Number(cost) / 1e6).toFixed(2);
        throw new Error(`Insufficient USDC balance. You have ${balanceStr} USDC but need ${costStr} USDC.`);
      }

      // 2. Check Allowance & Approve if needed
      if (!currentAllowance || currentAllowance < cost) {
        setSubscriptionStep('approving');
        console.log("Approving USDC...", { required: cost.toString(), current: currentAllowance?.toString() });
        const approveHash = await writeContractAsync({
          address: CONTRACTS.USDC as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CONTRACTS.PaymentContract as `0x${string}`, cost],
          chainId: TARGET_CHAIN.id,
        }).catch(err => {
          setSubscriptionStep('error');
          throw err;
        });

        setSubscriptionStep('waiting-approval');
        console.log("Approval TX sent, waiting for confirmation...", approveHash);

        // POLLING STRATEGY: actively check allowance instead of waiting for receipt
        console.log("Approval TX sent. Polling for allowance update...");

        let approved = false;
        // Poll for 60 seconds (30 attempts * 2s)
        const maxAttempts = 30;

        for (let i = 0; i < maxAttempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s

          const check = await refetchAllowance();
          const currentVal = check.data;

          if (currentVal && currentVal >= cost) {
            console.log("Allowance updated detected via polling!");
            approved = true;
            break;
          }
        }

        if (!approved) {
          console.warn("Polling timed out. Proceeding to final check (might fail)...");
        }

      } else {
        console.log("Allowance sufficient:", currentAllowance.toString());
      }

      // 2.5 Re-check allowance before payment for safety
      const finalAllowance = await refetchAllowance();
      const updatedAllowance = finalAllowance.data;
      if (!updatedAllowance || updatedAllowance < cost) {
        setSubscriptionStep('error');
        const reqStr = (Number(cost) / 1e6).toFixed(1);
        const actStr = updatedAllowance ? (Number(updatedAllowance) / 1e6).toFixed(1) : "0";
        throw new Error(`Allowance mismatch: Contract requires ${reqStr} USDC, but only ${actStr} USDC is approved. Please try approving again.`);
      }

      // 3. Execute Membership Payment
      setSubscriptionStep('paying');
      console.log("Executing Payment:", {
        contract: CONTRACTS.PaymentContract,
        badgeNFT: CONTRACTS.BadgeNFT,
        usdc: CONTRACTS.USDC,
        months: durationMonths,
        cost: cost.toString()
      });

      const txHash = await writeContractAsync({
        address: CONTRACTS.PaymentContract as `0x${string}`,
        abi: PaymentContract.abi,
        functionName: 'payMembership',
        args: [BigInt(durationMonths)],
        chainId: TARGET_CHAIN.id,
        account: address,
      }).catch(err => {
        setSubscriptionStep('error');
        console.error("Payment transaction failed!", err);
        // Extract revert reason if possible
        const reason = err.shortMessage || err.message;
        throw new Error(`Payment failed: ${reason}`);
      });

      setSubscriptionStep('waiting-payment');
      console.log("Payment Transaction Sent:", txHash);

      // 4. Poll Backend for Listener Update
      setSubscriptionStep('updating-backend');
      console.log("Polling backend for membership update...");

      const MAX_POLLS = 12; // 60 seconds
      const POLL_INTERVAL = 5000;
      let updated = false;

      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise(r => setTimeout(r, POLL_INTERVAL));
        try {
          const data = await fetchMembership(address);
          // Check if expiry is extended or tier updated
          if (data && data.expiryDate && data.expiryDate > Date.now()) {
            // Simple check: if we have a valid future expiry, we assume success. 
            // (Ideally we compare against previous expiry, but 'free' users have null)
            if (!expiryDate || data.expiryDate > expiryDate) {
              setMembershipData(data);
              setTier(data.tier as MembershipTier);
              setExpiryDate(data.expiryDate);
              updated = true;
              break;
            }
          }
        } catch (e) {
          console.warn("Poll failed, retrying...", e);
        }
      }

      if (!updated) {
        console.warn("Backend update polling timed out. It might take a few more minutes.");
        // We still mark as completed because text/UI says "Success" usually implies TX success.
        // But maybe we should show a warning? For now, let's just refresh one last time.
        await loadMembership();
      }

      setSubscriptionStep('completed');
      await loadMembership();

    } catch (error: any) {
      setSubscriptionStep('error');
      console.error("Subscription failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSubscriptionState = () => {
    setSubscriptionStep('idle');
    setIsLoading(false);
  };

  return (
    <MembershipContext.Provider value={{
      tier,
      expiryDate,
      isLoading,
      subscriptionStep,
      membershipData,
      subscribe,
      refreshMembership: loadMembership,
      resetSubscriptionState
    }}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}
