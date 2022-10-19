import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { GRPAPHQL_ENDPOINT } from "../src/constants";

describe("Connection", async () => {
  let profile: wordcelSDK.Profile;

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

  it("Get all out going connections of a user", async () => {
    const connections = await sdk.connection.getConnections(user);
    expect(
      connections.wordcel_0_1_1_decoded_connection.length
    ).to.be.greaterThan(0);
  });

  it("Get all incoming connections to a profile", async () => {
    const connections = await sdk.connection.getConnectionsByProfileGQL(
      new anchor.web3.PublicKey(profile)
    );
    expect(
      connections.wordcel_0_1_1_decoded_connection.length
    ).to.be.greaterThanOrEqual(0);
  });
});
