import { SDK, Post, Profile } from "../src";
import { DummyWallet } from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import fs from "fs";

import { GraphQLClient } from "graphql-request";

describe("Post", async () => {
  let post: Post;
  let profile: Profile;

  const keypair = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        fs.readFileSync("/Users/pratiksaria/.config/solana/id.json", "utf8")
      )
    )
  );

  const wallet = new anchor.Wallet(keypair);

  before(() => {
    // Set up SDK
    const preflightCommitment = "confirmed";
    const rpcConnection = new anchor.web3.Connection(
      "http://127.0.0.1:8899",
      preflightCommitment
    );

    const provider = new anchor.AnchorProvider(
      rpcConnection,
      new DummyWallet(),
      {
        preflightCommitment,
      }
    );

    const graphqlEndpoint = "https://wordcel.conciselabs.io/v1/graphql";

    // const gqlClient = new GraphQLClient(graphqlEndpoint, {
    //   headers: {
    //     "x-hasura-admin-secret": process.env["CONCISE_LABS_SECRET"],
    //   },
    // });

    const gqlClient = new GraphQLClient(graphqlEndpoint, {
      headers: {
        "x-hasura-admin-secret":
          "BqtN7EEkmIS8VN7lyNU0uh7eNCfZqBK57I32Xf8wwAyyf2u0VW1R2nQD2n3Wj481",
      },
    });

    const sdk = new SDK(provider, "localnet", gqlClient);

    post = new Post(sdk);
    profile = new Profile(sdk);
  });

  it("should create a POST", async () => {
    // This wont work because it takes the PDA Account
    const walletProfile = await profile.getProfile(wallet.publicKey);

    const createdPost = await post.createPost(wallet.publicKey);
  });
});
