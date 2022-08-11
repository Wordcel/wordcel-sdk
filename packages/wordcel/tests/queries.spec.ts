import { expect } from "chai";
import {
  getAllConnectionPosts,
  getConnections,
  getPostsByProfile,
  getProfileByUser,
} from "../src/queries";

import { PublicKey } from "@solana/web3.js";

import { GraphQLClient } from "graphql-request";

describe("Graph Queries", async () => {
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

  it("should get connections", async () => {
    const user = new PublicKey("JAnUxaoNAnABRLLsJh4911CM1h5BEGNQrAuTBa7CzpV2");
    const result = await getConnections(gqlClient, user);
    expect(result["wordcel_0_1_1_decoded_connection"].length).to.be.greaterThan(
      0
    );
  });

  it("should get profiles by user", async () => {
    const user = new PublicKey("JAnUxaoNAnABRLLsJh4911CM1h5BEGNQrAuTBa7CzpV2");
    const result = await getProfileByUser(gqlClient, user);
    expect(result["wordcel_0_1_1_decoded_profile"].length).to.be.greaterThan(0);
  });

  it("should get all posts for your connections", async () => {
    const user = new PublicKey("JAnUxaoNAnABRLLsJh4911CM1h5BEGNQrAuTBa7CzpV2");
    const result = await getAllConnectionPosts(gqlClient, user);
    expect(result["wordcel_0_1_1_decoded_connection"].length).to.be.greaterThan(
      0
    );
  });

  it("should get all posts given your profile", async () => {
    const user = new PublicKey("9TcgsKZBUgQAdwMC2XtJE5TWdtssg9KmbHiL6X72GRhh");
    const result = await getPostsByProfile(gqlClient, user);
    expect(result["wordcel_0_1_1_decoded_profile"].length).to.be.greaterThan(0);
  });
});
