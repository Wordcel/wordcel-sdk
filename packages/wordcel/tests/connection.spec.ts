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

describe("Connection", async () => {
  let connection: Connection;

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

    const sdk = new wordcelSDK.SDK(
      wallet as NodeWallet,
      rpcConnection,
      opts.preflightCommitment,
      "localnet",
      gqlClient
    );
    connection = sdk.connection;
  });

  it("Create a Connection", async () => {
    const follower = wallet.publicKey;
    // This is a Profile Account
    const profileToFollow = new anchor.web3.PublicKey("");

    const { blockhash } = await rpcConnection.getLatestBlockhash();

    const transaction = new anchor.web3.Transaction({
      recentBlockhash: blockhash,
      feePayer: wallet.publicKey,
    });

    const createConnectionIx = await connection.createConnection(
      follower,
      profileToFollow
    );

    transaction.add(createConnectionIx);

    wallet.signTransaction(transaction);
    const rawTx = transaction.serialize();
    const sig = await rpcConnection.sendRawTransaction(rawTx);

    await rpcConnection.confirmTransaction(sig, "confirmed");

    console.log("Created A Connection :- ", sig);
  });
  it("Should Close the Connection", async () => {
    const follower = wallet.publicKey;
    // This is a Profile Account
    const profileToFollow = new anchor.web3.PublicKey("");

    const { blockhash } = await rpcConnection.getLatestBlockhash();

    const transaction = new anchor.web3.Transaction({
      recentBlockhash: blockhash,
      feePayer: wallet.publicKey,
    });

    const closeConnectionIx = await connection.closeConnection(
      follower,
      profileToFollow
    );

    transaction.add(closeConnectionIx);

    wallet.signTransaction(transaction);
    const rawTx = transaction.serialize();
    const sig = await rpcConnection.sendRawTransaction(rawTx);

    await rpcConnection.confirmTransaction(sig, "confirmed");

    console.log("Closed the Connection 😔 :- ", sig);
  });
  it("Should Fetch the Data from a Connection PDA", async () => {
    const follower = wallet.publicKey;
    // This is a Profile Account
    const profileToFollow = new anchor.web3.PublicKey("");

    const connectionPDA = connection.connectionPDA(follower, profileToFollow);
    const data = await connection.getConnectionPDAData(connectionPDA[0]);

    console.log("Data of the ConnectionPDA Account", data);
  });
  it("Should Derive the Connection PDA", async () => {
    const follower = wallet.publicKey;
    // This is a Profile Account
    const profileToFollow = new anchor.web3.PublicKey("");

    const [connectionPDA, connectionPDABump] = await connection.connectionPDA(
      follower,
      profileToFollow
    );

    console.log("Connection PDA Address", connectionPDA.toString());
  });
});
