"use client";

import { WalletProvider } from "@/context/WalletContext";
import { ContractProvider } from "@/context/ContractContext";
import { Provider as ChakraProvider } from "@/components/ui/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <WalletProvider>
        <ContractProvider>{children}</ContractProvider>
      </WalletProvider>
    </ChakraProvider>
  );
}
