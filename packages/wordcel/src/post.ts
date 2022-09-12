import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";
import randombytes from "randombytes";

const { SystemProgram } = anchor.web3;
/**
 * Creates a Post Object
 *
 * @remarks
 * This object is used to create,update and read posts.
 *
 *
 * @beta
 */
export class Post {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  /**
   * Get a PDA with seeds post and randomHash
   *
   * @remarks
   * This PDA stores the on-chain details related to a post
   *
   *
   * @beta
   */
  postPDA(randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["post"], randomHash],
      WORDCEL_PROGRAMS[this.sdk.cluster]
    );
  }
  /**
   * Data inside the Post PDA
   *
   * @remarks
   * This function gets the data present in the post PDA
   *
   *
   * @beta
   */
  getPost(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.post.fetch(account);
  }
  /**
   * Creates a new post on-chain
   *
   * @remarks
   * This function is used to create a Post on-chain
   *
   *
   * @beta
   */
  async createPost(
    user: anchor.web3.PublicKey,
    profileAccount: anchor.web3.PublicKey,
    metadataUri: string
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
  /**
   * Updates the on-chain post
   *
   * @remarks
   * This function updates the post account on-chain with updated values
   *
   *
   * @beta
   */
  updatePost(
    user: anchor.web3.PublicKey,
    profileAccount: anchor.web3.PublicKey,
    postAccount: anchor.web3.PublicKey,
    metadataUri: string
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
