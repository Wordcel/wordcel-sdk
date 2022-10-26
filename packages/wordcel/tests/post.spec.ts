import { Profile } from "../src";
import wallet from "./utils/wallet";
import { expect } from "chai";
import * as anchor from "@project-serum/anchor";
import * as wordcelSDK from "../src";
import invite_idl from "../src/idl/invite.json";

import { GraphQLClient } from "graphql-request";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import randombytes from "randombytes";
const { SystemProgram } = anchor.web3;
import {
  GRPAPHQL_ENDPOINT,
  SEED_PREFIXES,
  SOLANA_CLUSTER,
  SOLANA_RPC_ENDPOINT,
  WORDCEL_INVITE_PROGRAMS
} from "../src/constants";

describe("Post", async () => {
  let profile: Profile;
  let postAccount: anchor.web3.PublicKey;
  let profileAccount: anchor.web3.PublicKey;
  let invitationProgram: anchor.Program;
  let inviteAccount: anchor.web3.PublicKey;

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

  it("Get All Posts by a user", async () => {
    const posts = await sdk.post.getPostsByProfile(
      new anchor.web3.PublicKey(profile)
    );
    expect(posts.wordcel_0_1_1_decoded_post.length).to.be.greaterThan(0);
  });

  it("Create a new post", async () => {
    const metadataUri = "https://arweave.net/NXsp-pJAOCJ_1nPsc6NzH92Oim3fWeGSvI4mw8N8DSA";
    profileAccount = await sdk.profile.getProfileByUserRPC(testUser).then((res) => {
      return res[0].publicKey;
    });
    const post = await sdk.post.createPost(
      testUser,
      profileAccount,
      metadataUri
    );
    const tx = new anchor.web3.Transaction().add(post);
    await sdk.provider.sendAndConfirm(tx);

    const allPost = await sdk.program.account.post.all();
    postAccount = allPost[0].publicKey;
    const getPost: any = await sdk.post.getPost(postAccount);
    expect(getPost.metadataUri).to.equal(metadataUri);
  });

  it("Update a post", async () => {
    const metadataUri =
      "https://gist.githubusercontent.com/shekdev/10593977/raw/589238c3d48e654347d6cbc1e29c1e10dadc7cea/monoid.md";
    const post = await sdk.post.updatePost(
      testUser,
      profileAccount,
      postAccount,
      metadataUri
    );
    const tx = new anchor.web3.Transaction().add(post);
    await sdk.provider.sendAndConfirm(tx);
    const getPost: any = await sdk.post.getPost(postAccount);
    expect(getPost.metadataUri).to.equal(metadataUri);
  });

  it("should only allow the post to be edited with the original profile", async () => {
    const randomHash = randombytes(32);
    const profileSeed = [Buffer.from("profile"), randomHash];
    const [newProfileAccount, _] =
      await anchor.web3.PublicKey.findProgramAddress(
        profileSeed,
        sdk.program.programId
      );

    // Initialize Invitation Account
    await sdk.program.methods
      .initialize(randomHash)
      .accounts({
        profile: newProfileAccount,
        user: testUser,
        invitation: inviteAccount,
        invitationProgram: invitationProgram.programId,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const metadataUri =
      "https://gist.githubusercontent.com/shekdev/10593977/raw/589238c3d48e654347d6cbc1e29c1e10dadc7cea/monoid.md";
    try {
      const post = await sdk.post.updatePost(
        testUser,
        newProfileAccount,
        postAccount,
        metadataUri
      );
      const tx = new anchor.web3.Transaction().add(post);
      await sdk.provider.sendAndConfirm(tx);
    }
    catch (error) {
      expect(error).to.be.an("error");
      expect(JSON.stringify(error)).to.contain("Error Code: ConstraintHasOne");
    }
  });
});
