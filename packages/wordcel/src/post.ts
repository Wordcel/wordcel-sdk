import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";
import randombytes from "randombytes";

const { SystemProgram } = anchor.web3;

export class Post {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  postPDA(randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["post"], randomHash],
      WORDCEL_PROGRAMS[this.sdk.cluster]
    );
  }

  getPost(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.post.fetch(account);
  }

  async createPost(
    user: anchor.web3.PublicKey,
    profileAccount: anchor.web3.PublicKey,
    metadataUri: String
  ) {
    const randomHash = randombytes(32);
    const [postAccount, _] = await this.postPDA(randomHash);
    return this.sdk.program.methods
      .createPost(metadataUri, randomHash)
      .accounts({
        post: postAccount,
        profile: profileAccount,
        authority: user,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  updatePost(
    user: anchor.web3.PublicKey,
    profileAccount: anchor.web3.PublicKey,
    postAccount: anchor.web3.PublicKey,
    metadataUri: String
  ) {
    return this.sdk.program.methods
      .updatePost(metadataUri)
      .accounts({
        post: postAccount,
        profile: profileAccount,
        authority: user,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
}
