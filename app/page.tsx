"use client";

import ConnectButton from "../components/ConnectButton";
import AssetList from "../components/AssetList";
import { useWallet } from "../context/WalletContext";
import { Box, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

export default function Page() {
  const { account } = useWallet();

  return (
    <Box
      minH="100vh"
      w="100%"
      className="bg-linear-to-br from-teal-50 via-blue-50 to-purple-50"
      p={6}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading
          size="lg"
          bgClip="text"
          className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 via-blue-500 to-purple-500"
        >
          Sim dApp
        </Heading>
        <ConnectButton />
      </Flex>

      <Box mb={6} p={4} bg="whiteAlpha.900" borderRadius="lg" boxShadow="md">
        {account ? (
          <Text fontSize="md" fontWeight="medium">
            Connected to:{" "}
            <Text as="span" fontWeight="bold" color="teal.600">
              {account}
            </Text>
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.600">
            Connect wallet to view and buy assets.
          </Text>
        )}
      </Box>

      <Heading
        size="lg"
        bgClip="text"
        className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 via-blue-500 to-purple-500"
      >
        Assets
      </Heading>
      <Stack>
        <AssetList />
      </Stack>

      <Toaster />
    </Box>
  );
}
