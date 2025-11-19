"use client";
import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useContractCtx } from "@/context/ContractContext";
import { Button, Popover, Portal } from "@chakra-ui/react";
import { shortAddress } from "@/app/utils";

export default function ConnectButton() {
  const { account, connect, loading } = useWallet();
  const { loadAssets } = useContractCtx();
  const [open, setOpen] = useState(false);
  const onConnect = async () => {
    try {
      const prov = await connect();
      if (prov) {
        await loadAssets(prov, false);
      }
    } catch (error) {}
  };

  if (!account) {
    return (
      <Button
        onClick={onConnect}
        colorScheme="blue"
        borderRadius="lg"
        boxShadow="md"
        px={6}
        loading={loading}
        data-testid="connect-wallet-button"
      >
        Connect Wallet
      </Button>
    );
  }
  return (
    <Popover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      positioning={{ placement: "bottom-end" }}
    >
      <Popover.Trigger asChild>
        <Button colorScheme="blue" borderRadius="lg" boxShadow="md" px={6}>
          {shortAddress(account)}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>{account}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
