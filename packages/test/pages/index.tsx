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
  useToast,
} from "@chakra-ui/react";
import * as wordcelSDK from "@wordcel/wordcel-ts";
import * as anchor from "@project-serum/anchor";

import { GraphQLClient } from "graphql-request";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [sdk, setSdk] = useState<wordcelSDK.SDK>();
  const [userAdd, setUserAdd] = useState<string>();
  const toast = useToast();
  const wallet = useWallet();
  const connectionURI =
    process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
  const connection = new anchor.web3.Connection(connectionURI);
  const anchorWallet = useAnchorWallet();
  const graphqlEndpoint = "https://wordcel.conciselabs.io/v1/graphql";
  const gqlClient = new GraphQLClient(graphqlEndpoint);

  const opts = {
    preflightCommitment: "processed" as anchor.web3.ConfirmOptions,
  };

  useEffect(() => {
    if (wallet?.publicKey !== null || wallet.publicKey !== undefined) {
      console.log("WALLET ADDRESS", anchorWallet?.publicKey.toString());
      setUserAdd(anchorWallet?.publicKey.toString());
      // const sdk = new wordcelSDK.SDK(anchorWallet as NodeWallet,connection,opts.preflightCommitment,"localnet",gqlClient);
      // setSdk(sdk);
    }
  }, [anchorWallet]);

  const createConnection = async () => {
    try {
      if (
        wallet.publicKey === null ||
        wallet.connected === false ||
        wallet === undefined ||
        wallet === null
      ) {
        return;
      }
      const sdk = new wordcelSDK.SDK(
        anchorWallet as NodeWallet,
        connection,
        opts.preflightCommitment,
        "localnet",
        gqlClient
      );
      const res = await sdk.profile.getProfilesByUser(wallet.publicKey);
      const createConnection = await sdk.connection.createConnection(
        wallet.publicKey,
        res[0].publicKey
      );
      console.log("Create Connection Transaction", createConnection);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Something Wrong ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Something Went Wrong", error);
    }
  };

  const updateAPost = async () => {
    try {
      if (
        wallet.publicKey === null ||
        wallet.connected === false ||
        wallet === undefined ||
        wallet === null
      ) {
        return;
      }
      const sdk = new wordcelSDK.SDK(
        anchorWallet as NodeWallet,
        connection,
        opts.preflightCommitment,
        "localnet",
        gqlClient
      );
      const getPost: any = await sdk.post.getPost(wallet.publicKey);
      console.log(getPost);
      const res = await sdk.profile.getProfilesByUser(wallet.publicKey);
      const updatePost = await sdk.post.updatePost(
        wallet.publicKey,
        res[0].publicKey,
        getPost[0].publicKey,
        "https://gist.githubusercontent.com/abishekk92/10593977/raw/589238c3d48e654347d6cbc1e29c1e10dadc7cea/monoid.md"
      );
      console.log("Updated Post Transaction Sig", updatePost);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Something Wrong ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Something Went Wrong", error);
    }
  };

  const createPostforUser = async () => {
    try {
      if (
        wallet.publicKey === null ||
        wallet.connected === false ||
        wallet === undefined ||
        wallet === null
      ) {
        return;
      }
      const sdk = new wordcelSDK.SDK(
        anchorWallet as NodeWallet,
        connection,
        opts.preflightCommitment,
        "localnet",
        gqlClient
      );
      const res = await sdk.profile.getProfilesByUser(wallet.publicKey);
      console.log("Account Details", res);
      console.log("Account Key", res[0].publicKey);
      const createPost = await sdk.post.createPost(
        wallet.publicKey,
        res[0].publicKey,
        "https://arweave.net/NXsp-pJAOCJ_1nPsc6NzH92Oim3fWeGSvI4mw8N8DSA"
      );
      console.log(createPost);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Something Wrong ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Something Went Wrong", error);
    }
  };

  const getAllPostsforUser = async () => {
    try {
      if (
        wallet.publicKey === null ||
        wallet.connected === false ||
        wallet === undefined ||
        wallet === null
      ) {
        return;
      }

      const sdk = new wordcelSDK.SDK(
        anchorWallet as NodeWallet,
        connection,
        opts.preflightCommitment,
        "localnet",
        gqlClient
      );
      const res = await sdk.profile.getProfilesByUser(wallet.publicKey);
      console.log("Account Details", res);
      console.log("Account Key", res[0].publicKey);
      const getPost = await sdk.post.getPost(wallet.publicKey);
      console.log(getPost);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Something Wrong ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Something Went Wrong", error);
    }
  };

  const getPostHandler = async () => {
    try {
      if (
        wallet.publicKey === null ||
        wallet.connected === false ||
        wallet === undefined ||
        wallet === null
      ) {
        return;
      }
      console.log("IN Here");
      const sdk = new wordcelSDK.SDK(
        anchorWallet as NodeWallet,
        connection,
        opts.preflightCommitment,
        "localnet",
        gqlClient
      );
      const inviteAccount = new anchor.web3.PublicKey(
        "GDwGrpZBP6QBFRGeo932uLxYSiz4LPRySBaugX4vxEXm"
      );
      //  const createProfile  = await sdk.profile.createProfile(wallet.publicKey,inviteAccount);
      //  console.log("Created profile",createProfile);
      //  const res = await sdk.profile.getProfilefromUser(wallet.publicKey);
      //  console.log("Account Details",res);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Something Wrong ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Something Went Wrong", error);
    }
  };

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
      <Box w="full" h="90vh">
        Connected Wallet {userAdd}
        <HStack>
          <Button onClick={getPostHandler}>Get posts</Button>
          <Button onClick={getAllPostsforUser}>Get a post</Button>
          <Button onClick={createPostforUser}>Create a Post</Button>
          <Button onClick={updateAPost}>Update a post</Button>
          <Button>Create a Connection</Button>
          <Button>Close a Connection</Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Home;
