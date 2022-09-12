import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";
import * as wordcelSDK from "@wordcel/wordcel-ts";
import * as anchor from "@project-serum/anchor";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const Home: NextPage = () => {
  const connectionURI =
    process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
  const connection = new anchor.web3.Connection(connectionURI);

  return (
    <Box w="100%" h="100%" bg="blue.100">
      <Flex
        px={4}
        h="10vh"
        bg="red.100"
        w="full"
        align="center"
        justify={"end"}
      >
        <WalletMultiButton />
      </Flex>
    </Box>
  );
};

export default Home;
