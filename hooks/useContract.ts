"use client";
import { useEffect, useState, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { useWalletConnection } from "@/hooks/useWallet";
import { fetchAssets, buyAsset } from "@/services/contractService";
import { toaster } from "@/components/ui/toaster";

export interface Asset {
  id: number;
  name: string;
  price: string;
  src: string;
  owner: string;
}

export interface ContractState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  buy: (assetId: number, price: string) => Promise<void>;
  loadAssets: (prov?: BrowserProvider, showToast?: boolean) => Promise<void>;
}

export function useContractLogic(): ContractState {
  const { provider, chainId, switchNetwork, account } = useWalletConnection();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(
    async (prov?: BrowserProvider, showToast = true) => {
      const activeProvider = prov ?? provider;
      if (!activeProvider) return;

      setLoading(true);
      setError(null);

      try {
        if (chainId !== "31337") {
          await switchNetwork?.(31337);
        }

        const raw: any[] = await fetchAssets(activeProvider);
        const mapped: Asset[] = raw.map((r: any) => ({
          id: Number(r.id ?? r[0]),
          name: r.name ?? r[1],
          price: r.price ?? String(r[2]),
          src: r.src ?? r[3],
          owner: r.owner ?? r[4],
        }));

        setAssets(mapped);
        showToast &&
          toaster.create({
            title: "Assets Loaded",
            type: "success",
          });
      } catch (e: any) {
        toaster.create({
          title: e.shortMessage ?? "Failed to load assets",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [provider, chainId, switchNetwork, account]
  );

  useEffect(() => {
    if (provider && account) {
      loadAssets();
    }
  }, [provider, chainId, account]);

  const buy = useCallback(
    async (assetId: number, price: string) => {
      let prov = provider;

      if (!prov) {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask is required");

        prov = new BrowserProvider(ethereum);
      }

      setLoading(true);
      setError(null);

      try {
        const net = await prov.getNetwork();
        if (Number(net.chainId) !== 31337) {
          await switchNetwork?.(31337);
        }

        await buyAsset(prov, assetId);
        await loadAssets();
      } catch (e: any) {
        setError("Buy failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [provider, switchNetwork, loadAssets]
  );

  return {
    assets,
    loading,
    error,
    buy,
    loadAssets,
  };
}
