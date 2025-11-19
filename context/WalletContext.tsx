'use client';
import React, { createContext, useContext } from 'react';
import { useWalletConnection, WalletState } from '@/hooks/useWallet';

const WalletContext = createContext<WalletState | undefined>(undefined);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWalletConnection();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}
