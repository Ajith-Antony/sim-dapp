'use client';
import React, { createContext, useContext } from 'react';
import { useContractLogic, ContractState } from '@/hooks/useContract';

const ContractContext = createContext<ContractState | undefined>(undefined);

export const useContractCtx = () => {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error('useContractCtx must be used within ContractProvider');
  return ctx;
};

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const state = useContractLogic();

  return (
    <ContractContext.Provider value={state}>
      {children}
    </ContractContext.Provider>
  );
}
