"use client";
import React from "react";
import { useContractCtx } from "../context/ContractContext";
import AssetCard from "./AssetCard";

export default function AssetList() {
  const { assets } = useContractCtx();

  return (
    <div className="flex flex-wrap justify-around gap-6">
      {assets && assets.length ? (
        assets.map((a) => <AssetCard key={a.id} asset={a} />)
      ) : (
        <div className="p-4 text-sm text-gray-500">No assets found.</div>
      )}
    </div>
  );
}
