import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { GRPAPHQL_ENDPOINT, SOLANA_CLUSTER, SOLANA_RPC_ENDPOINT } from "../src/constants";
import { AnchorError } from "@project-serum/anchor";

describe("Connection", async () => {
  let profile: wordcelSDK.Profile;
  let randomUser: anchor.web3.Keypair;
  let profileAccount: anchor.web3.PublicKey;

  const user = new anchor.web3.PublicKey(
    "9M8NddGMCee9ETXXJTGHJHN1vDEqvasMCCirNW94nFNH"
  );
  const testUser = wallet.publicKey;

  const preflightCommitment = "confirmed" as anchor.web3.ConfirmOptions;
  const rpcConnection = new anchor.web3.Connection(
    SOLANA_RPC_ENDPOINT,
    preflightCommitment
  );

  const gqlClient = new GraphQLClient(GRPAPHQL_ENDPOINT);

  const sdk = new wordcelSDK.SDK(
    wallet as NodeWallet,
    rpcConnection,
    preflightCommitment as anchor.web3.ConfirmOptions,
    SOLANA_CLUSTER,
    gqlClient
  );

  before(async () => {
    let profiles = await sdk.profile.getProfilesByUser(user);
    profile = profiles["wordcel_0_1_1_decoded_profile"][0].cl_pubkey;
    randomUser = anchor.web3.Keypair.generate();
    const airdropSig = await sdk.provider.connection.requestAirdrop(randomUser.publicKey, 1000000000);
    await sdk.provider.connection.confirmTransaction(airdropSig);
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

  it("Create a new connection", async () => {
    profileAccount = await sdk.profile.getProfileByUserRPC(testUser).then((res) => {
      return res[0].publicKey;
    });
    const connection = await sdk.connection.createConnection(
      randomUser.publicKey,
      profileAccount
    );
    const tx = new anchor.web3.Transaction().add(connection);
    await sdk.provider.sendAndConfirm(tx, [randomUser]);
    const getConnections = await sdk.program.account.connection.all();
    expect(getConnections[0].account.profile.toBase58()).to.be.equal(profileAccount.toBase58());
  })

  it("should not let a user to follow themselves", async () => {
    try {
      const connection = await sdk.connection.createConnection(
        testUser,
        profileAccount
      );
      const tx = new anchor.web3.Transaction().add(connection);
      await sdk.provider.sendAndConfirm(tx);
    } catch (error) {
      const anchorError = AnchorError.parse(error.logs);
      expect(anchorError && anchorError.error.errorCode.code).to.equal("SelfFollow");
    }
  });

  it("should not let a user to follow a user twice", async () => {
    try {
      const connection = await sdk.connection.createConnection(
        randomUser.publicKey,
        profileAccount
      );
      const tx = new anchor.web3.Transaction().add(connection);
      await sdk.provider.sendAndConfirm(tx, [randomUser]);
    } catch (error) {
      expect(error).to.be.an("error");
      expect(JSON.stringify(error)).to.contain("custom program error: 0x0");
    }
  });

  it("Close a connection", async () => {
    const connection = await sdk.connection.closeConnection(
      randomUser.publicKey,
      profileAccount
    );
    const tx = new anchor.web3.Transaction().add(connection);
    await sdk.provider.sendAndConfirm(tx, [randomUser]);
    try {
      const getConnections = await sdk.program.account.connection.all();
      expect(getConnections[0].account.profile.toBase58()).to.be.equal(profileAccount.toBase58());
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});
