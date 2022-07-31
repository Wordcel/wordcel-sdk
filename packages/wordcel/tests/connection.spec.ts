import { SDK, Connection } from "../src";
import { DummyWallet } from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";

import { clusterApiUrl, Cluster, PublicKey } from "@solana/web3.js";

import { GraphQLClient } from "graphql-request";

describe("connection", async () => {
  let connection: Connection;

  before(() => {
    // Set up SDK
    // When testing on mainnet make sure the tests don't mutate and its readonly
    const cluster: Cluster = "mainnet-beta";
    const preflightCommitment = "confirmed";
    const rpcConnection = new anchor.web3.Connection(
      clusterApiUrl(cluster),
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

    const sdk = new SDK(provider, cluster, gqlClient);
    connection = new Connection(sdk);
  });

  // it("should get connections", async () => {
  //   const user = new PublicKey("JAnUxaoNAnABRLLsJh4911CM1h5BEGNQrAuTBa7CzpV2");
  //   const result = await connection.getConnections(user);
  //   expect(result["wordcel_0_1_1_decoded_connection"].length).to.be.greaterThan(
  //     0
  //   );
  // });
});
