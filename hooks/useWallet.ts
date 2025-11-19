"use client";
import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner, Network } from "ethers";
import { hardHatRpc } from "@/constants/constants";
import { toaster } from "@/components/ui/toaster";

export interface WalletState {
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: string | null;
  network: Network | null;

  connected: boolean;
  loading: boolean;
  error: string | null;

  connect: () => Promise<BrowserProvider | null>;
  switchNetwork: (chainId: number) => Promise<void>;
}

export function useWalletConnection(): WalletState {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connected = !!account;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) connect(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { ethereum } = window as any;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts.length ? accounts[0] : null);
    };
    const handleChainChanged = (newChainId: string) => {
      setChainId(parseInt(newChainId, 16).toString());
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (typeof window === "undefined") return;
    const { ethereum } = window as any;
    if (!ethereum) throw new Error("MetaMask is required");

    const hexChainId = "0x" + targetChainId.toString(16);

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        let addParams;
        if (targetChainId === 31337) {
          addParams = hardHatRpc;
        } else {
          throw new Error(`Unknown network ${targetChainId}`);
        }

        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [addParams],
        });

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });
      } else {
        throw err;
      }
    }
  }, []);

  const connect = useCallback(
    async (showToast = true): Promise<BrowserProvider | null> => {
      setLoading(true);
      setError(null);

      try {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask is required");
        await switchNetwork(31337);
        const accounts: string[] = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const prov = new BrowserProvider(ethereum);
        const s = await prov.getSigner();
        const net = await prov.getNetwork();

        setProvider(prov);
        setSigner(s);
        setAccount(accounts[0] ?? null);
        setNetwork(net);
        setChainId(net.chainId.toString());
        showToast &&
          toaster.create({
            title: "Wallet connected",
            type: "success",
          });
        return prov;
      } catch (err: any) {
        toaster.create({
          title: err.message ?? "Failed to connect wallet",
          type: "error",
        });
        setError(err.message ?? "Failed to connect wallet");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    account,
    provider,
    signer,
    chainId,
    network,
    connected,
    loading,
    error,
    connect,
    switchNetwork,
  };
}
