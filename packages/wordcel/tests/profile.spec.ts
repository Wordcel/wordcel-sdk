import { SDK, Connection } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

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

    const graphqlEndpoint = "https://wordcel.conciselabs.io/v1/graphql";

    const gqlClient = new GraphQLClient(graphqlEndpoint, {
      headers: {
        "x-hasura-admin-secret": process.env["CONCISE_LABS_SECRET"] || "",
      },
    });

    const sdkObject = new wordcelSDK.SDK(
      wallet as NodeWallet,
      rpcConnection,
      opts.preflightCommitment,
      "localnet",
      gqlClient
    );
    sdk = sdkObject;
  });

  it("Should create a Profile Account on-chain", async () => {
    const { blockhash } = await rpcConnection.getLatestBlockhash();

    const transaction = new anchor.web3.Transaction({
      recentBlockhash: blockhash,
      feePayer: wallet.publicKey,
    });

    // Got this from the local Validator through a Script
    const inviteAccount = new anchor.web3.PublicKey(
      "GDwGrpZBP6QBFRGeo932uLxYSiz4LPRySBaugX4vxEXm"
    );

    const createProfileIx = await sdk.profile.createProfile(
      wallet.publicKey,
      inviteAccount
    );

    transaction.add(createProfileIx);

    wallet.signTransaction(transaction);
    const rawTx = transaction.serialize();
    const sig = await rpcConnection.sendRawTransaction(rawTx);

    await rpcConnection.confirmTransaction(sig, "confirmed");

    console.log("Created A Profile Account :- ", sig);
  });

  it("Should Get a Profile Account Based on the profile Account PDA", async () => {
    const profileAccountPDA = new anchor.web3.PublicKey("");

    const profileAccountData = await sdk.profile.getProfile(profileAccountPDA);

    console.log("THE Profile data on-chain", profileAccountData);
  });
  it("Should get all The Profile Account of a User/publickey from on-chain RPC Call", async () => {
    const profileOwnerPubkey = wallet.publicKey;

    const profilesData = await sdk.profile.getProfileByUserRPC(
      profileOwnerPubkey
    );
    console.log("List of on-chain profiles and its data", profilesData);
  });

  // Work's only on mainnet-beta So mainnet address needs to be passed here instead of local
  it("Should Fetch all the Profile Accounts from a GQL Query", async () => {
    const profileOwnerPubkey = new anchor.web3.PublicKey(
      "9iSD3wkC1aq3FcwgjJfEua9FkkZJWv7Cuxs6sKjc3VnR"
    );

    const profilesData = await sdk.profile.getProfilesByUserGQL(
      profileOwnerPubkey
    );

    console.log("List of on-chain profiles and its data", profilesData);
  });
});

// My Profile PDA EW8yRoHiGdvzK8rjAtaTS5MgZyVRUbBR35eKFF9e4mu8
// My Connection Account 9h6o2jfmDD3VFbWVg6bJngFdx96QhdjXkfX1p4dVAUSw
