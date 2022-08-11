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

    const sdk = new SDK(provider, "localnet", gqlClient);
    connection = new Connection(sdk);
  });

  it("should create a connection", async () => {
    const follower = new anchor.web3.PublicKey(
      "FB9xn5x8y5w5J4W8GRZr7bB1WnVkTBPVtsH53DhfCSD8"
    );
    const profileToFollow = new anchor.web3.PublicKey(
      "HXSm9FhAa7BJ5UK53iBqj1yF9KgMBqNBySYcgduX5smf"
    );
    const res = connection.createConnection(follower, profileToFollow);
  });
  it("should create a connection", async () => {
    const follower = new anchor.web3.PublicKey(
      "FB9xn5x8y5w5J4W8GRZr7bB1WnVkTBPVtsH53DhfCSD8"
    );
    const profileToFollow = new anchor.web3.PublicKey(
      "HXSm9FhAa7BJ5UK53iBqj1yF9KgMBqNBySYcgduX5smf"
    );
    const res = connection.createConnection(follower, profileToFollow);
  });
});
