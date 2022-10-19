import { Profile } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { GRPAPHQL_ENDPOINT } from "../src/constants";

describe("Post", async () => {
  let profile: Profile;

  const user = new anchor.web3.PublicKey(
    "9M8NddGMCee9ETXXJTGHJHN1vDEqvasMCCirNW94nFNH"
  );

  const preflightCommitment = "confirmed";
  const rpcConnection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet"),
    preflightCommitment
  );

  const gqlClient = new GraphQLClient(GRPAPHQL_ENDPOINT);

  const sdk = new wordcelSDK.SDK(
    wallet as NodeWallet,
    rpcConnection,
    preflightCommitment as anchor.web3.ConfirmOptions,
    "localnet",
    gqlClient
  );

  before(async () => {
    let profiles = await sdk.profile.getProfilesByUser(user);
    profile = profiles["wordcel_0_1_1_decoded_profile"][0].cl_pubkey;
  });

  it("Get All Posts by a user", async () => {
    const posts = await sdk.post.getPostsByProfile(
      new anchor.web3.PublicKey(profile)
    );
    expect(posts.wordcel_0_1_1_decoded_post.length).to.be.greaterThan(0);
  });
});
