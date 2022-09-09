import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Box, Heading, Button, Text, HStack, VStack } from "@chakra-ui/react";
import * as wordcelSDK from "@wordcel/wordcel-ts";
import * as anchor from "@project-serum/anchor";

const Home: NextPage = () => {
  // const data = await wordcelSDK.Profile

  return (
    <Box w="100%" h="100%" bg="blue.100">
      <Heading>Check this</Heading>
    </Box>
  );
};

export default Home;
