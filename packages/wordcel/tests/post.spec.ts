import { SDK, Post } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const opts = {
  preflightCommitment: "processed" as anchor.web3.ConfirmOptions,
};

describe("Post", async () => {
  let post: Post;
  let sdkGlobal;

  before(() => {
    // Set up SDK
    const preflightCommitment = "confirmed";
    const rpcConnection = new anchor.web3.Connection(
      "http://127.0.0.1:8899",
      preflightCommitment
    );

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
    sdkGlobal = sdk;
    post = sdk.post;
  });

  it("Get All Posts by a user", async () => {
    // Owner of the Post
    const postOwner = wallet.publicKey;

    const getAllPostsByAUser = await post.getPost(postOwner);
  });
  it("Should Create a post", async () => {
    const res = await sdkGlobal.profile.getProfilefromUser(wallet.publicKey);
    const creatorOfPost = wallet.publicKey;
    const profileAccount = res[0].publicKey;
    const postURI =
      "https://gist.githubusercontent.com/abishekk92/10593977/raw/589238c3d48e654347d6cbc1e29c1e10dadc7cea/monoid.md";

    const txSig = await post.createPost(creatorOfPost, profileAccount, postURI);
  });
  it("Should Update a post", async () => {
    const getPost = await sdkGlobal.post.getPost(wallet.publicKey);
    const res = await sdkGlobal.profile.getProfilefromUser(wallet.publicKey);
    const creatorOfPost = wallet.publicKey;
    const profileAccount = res[0].publicKey;
    const postURI =
      "https://gist.githubusercontent.com/abishekk92/10593977/raw/589238c3d48e654347d6cbc1e29c1e10dadc7cea/monoid.md";

    const txSig = await post.updatePost(
      creatorOfPost,
      profileAccount,
      getPost,
      postURI
    );
  });
});
