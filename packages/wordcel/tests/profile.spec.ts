import { SDK, Connection } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";
import invite_idl from "../src/idl/invite.json";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { GRPAPHQL_ENDPOINT, SEED_PREFIXES, SOLANA_CLUSTER, SOLANA_RPC_ENDPOINT, WORDCEL_INVITE_PROGRAMS } from "../src/constants";
const { SystemProgram } = anchor.web3;

describe("Profile", async () => {
  let sdk: SDK;
  let invitationProgram: anchor.Program;
  let inviteAccount: anchor.web3.PublicKey;

  const preflightCommitment = "confirmed" as anchor.web3.ConfirmOptions;

  const user = wallet.publicKey;
  const rpcConnection = new anchor.web3.Connection(
    SOLANA_RPC_ENDPOINT,
    preflightCommitment
  );

  before(async () => {
    // Set up SDK

    const gqlClient = new GraphQLClient(GRPAPHQL_ENDPOINT);

    const sdkObject = new wordcelSDK.SDK(
      wallet as NodeWallet,
      rpcConnection,
      preflightCommitment,
      SOLANA_CLUSTER,
      gqlClient
    );
    sdk = sdkObject;

    // Set up invite program and account
    invitationProgram = new anchor.Program(
      invite_idl as anchor.Idl,
      WORDCEL_INVITE_PROGRAMS[SOLANA_CLUSTER],
      sdk.provider
    );
    const inviteSeed = [SEED_PREFIXES.invite, wallet.publicKey.toBuffer()];
    const [account, _] = await anchor.web3.PublicKey.findProgramAddress(inviteSeed, invitationProgram.programId);
    inviteAccount = account;
  });

  it("Should Fetch all the Profile Accounts from a GQL Query", async () => {
    const profileOwnerPubkey = new anchor.web3.PublicKey(
      "9iSD3wkC1aq3FcwgjJfEua9FkkZJWv7Cuxs6sKjc3VnR"
    );

    const profiles = await sdk.profile.getProfilesByUserGQL(profileOwnerPubkey);
    expect(profiles.wordcel_0_1_1_decoded_profile.length).to.be.greaterThan(0);
  });

  it("Create a new profile", async () => {

    await invitationProgram.methods
      .initialize()
      .accounts({
        inviteAccount: inviteAccount,
        authority: user,
        payer: user,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const profile = await sdk.profile.createProfile(user, inviteAccount);
    const tx = new anchor.web3.Transaction().add(profile);
    await sdk.provider.sendAndConfirm(tx);

    const data = await sdk.profile.getProfileByUserRPC(user);
    expect(data[0].account.authority.toBase58()).to.equal(user.toBase58());
  });
});
