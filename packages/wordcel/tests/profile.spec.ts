import { SDK, Profile } from "../src";
import { DummyWallet } from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import fs from "fs";

import { GraphQLClient } from "graphql-request";

describe("Profile", async () => {
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

    const provider = new anchor.AnchorProvider(rpcConnection, wallet, {
      preflightCommitment,
    });

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

    const sdk = new SDK(provider, "devnet", gqlClient);
    profile = new Profile(sdk);
  });

  const invitationPrefix = Buffer.from("invite");

  const inviteProgramId = new anchor.web3.PublicKey(
    "B9GxBx5cvQVeLmnBnf4sWzP282xxzAdu64Ts9YLsKvLL"
  );

  async function getInviteAccount(key: anchor.web3.PublicKey) {
    const seed = [invitationPrefix, key.toBuffer()];
    const [account, _] = await anchor.web3.PublicKey.findProgramAddress(
      seed,
      inviteProgramId
    );
    return account;
  }

  it("create a new profile", async () => {
    const walletInviteAccount = await getInviteAccount(wallet.publicKey);
    const createdProfile = await profile.createProfile(
      wallet.publicKey,
      walletInviteAccount
    );

    console.log("CREATED Profile", createdProfile);
  });
});
