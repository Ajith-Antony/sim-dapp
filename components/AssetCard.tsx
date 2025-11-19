"use client";
import React, { useState } from "react";
import { useContractCtx } from "../context/ContractContext";
import { useWallet } from "@/context/WalletContext";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { shortAddress } from "@/app/utils";
import { Tooltip } from "./ui/tooltip";
import Image from "next/image";
import { toaster } from "./ui/toaster";

export default function AssetCard({ asset }: { asset: any }) {
  const { buy } = useContractCtx();
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      await buy(asset.id, asset.price);
      toaster.create({
        title: "Purchase complete",
        type: "success",
      });
    } catch (e: any) {
      toaster.create({
        title: e.shortMessage || "Error Buying asset",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const ownedByUser = asset.owner?.toLowerCase() === account?.toLowerCase();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg="white"
      boxShadow="md"
      transition="all 0.2s"
      _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
    >
      <Stack>
        <Heading size="md" color="purple.600">
          #{asset.id} {asset.name}
        </Heading>

        <Image
          src={asset?.src}
          alt={"Asset image"}
          width={300}
          height={300}
          className="rounded-lg"
          placeholder="blur"
          blurDataURL="https://picsum.photos/id/237/1"
          loading="lazy"
        />
        <Text fontSize="sm" color="teal.600">
          Price: $ {asset.price}
        </Text>

        <Text fontSize="xs" color="blue.600">
          Owned by:{" "}
          {asset.owner === "0x0000000000000000000000000000000000000000" ? (
            "Unowned"
          ) : ownedByUser ? (
            "You"
          ) : (
            <Tooltip
              content={asset.owner}
              showArrow
              positioning={{ placement: "top" }}
            >
              <span>{shortAddress(asset.owner)}</span>
            </Tooltip>
          )}
        </Text>

        <Button
          onClick={handleBuy}
          loading={loading}
          loadingText="Pending..."
          disabled={!account || ownedByUser || ownedByUser}
        >
          {ownedByUser ? "Owned" : "Buy"}
        </Button>
      </Stack>
    </Box>
  );
}
