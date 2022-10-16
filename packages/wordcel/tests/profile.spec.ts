import { SDK, Connection } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { GRPAPHQL_ENDPOINT } from "../src/constants";

const opts = {
  preflightCommitment: "processed" as anchor.web3.ConfirmOptions,
};

describe("Profile", async () => {
  let sdk: SDK;

  const preflightCommitment = "confirmed";

  const rpcConnection = new anchor.web3.Connection(
    "http://127.0.0.1:8899",
    preflightCommitment
  );

  before(() => {
    // Set up SDK

    const gqlClient = new GraphQLClient(GRPAPHQL_ENDPOINT);

    const sdkObject = new wordcelSDK.SDK(
      wallet as NodeWallet,
      rpcConnection,
      opts.preflightCommitment,
      "localnet",
      gqlClient
    );
    sdk = sdkObject;
  });

  it("Should Fetch all the Profile Accounts from a GQL Query", async () => {
    const profileOwnerPubkey = new anchor.web3.PublicKey(
      "9iSD3wkC1aq3FcwgjJfEua9FkkZJWv7Cuxs6sKjc3VnR"
    );

    const profiles = await sdk.profile.getProfilesByUserGQL(profileOwnerPubkey);
    expect(profiles.wordcel_0_1_1_decoded_profile.length).to.be.greaterThan(0);
  });
});
