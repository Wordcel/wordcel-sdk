import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";

export class Post {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  getPostPDA(sdk: SDK, randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["post"], randomHash],
      WORDCEL_PROGRAMS[sdk.cluster]
    );
  }

  getPost(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.post.fetch(account);
  }

  createPost() {
    throw new Error("Unsupported Action");
  }

  updatePost() {
    throw new Error("Unsupported Action");
  }

  deletePost() {
    throw new Error("Unsupported Action");
  }
}
