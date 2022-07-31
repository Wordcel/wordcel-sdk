import { SDK, Connection } from "../src";
import { DummyWallet } from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";

import { GraphQLClient } from "graphql-request";

describe("Connection", async () => {
  let connection: Connection;

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

    const gqlClient = new GraphQLClient(graphqlEndpoint, {
      headers: {
        "x-hasura-admin-secret": process.env["CONCISE_LABS_SECRET"],
      },
    });

    const sdk = new SDK(provider, "localnet", gqlClient);
    connection = new Connection(sdk);
  });

  it("should do something", async () => {});
});
