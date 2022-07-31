import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";

const { SystemProgram } = anchor.web3;

export class Connection {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  connectionPDA(
    follower: anchor.web3.PublicKey,
    profileToFollow: anchor.web3.PublicKey
  ) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        SEED_PREFIXES["connection"],
        follower.toBuffer(),
        profileToFollow.toBuffer(),
      ],
      WORDCEL_PROGRAMS[this.sdk.cluster]
    );
  }

  getConnection(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.connection.fetch(account);
  }

  async createConnection(
    follower: anchor.web3.PublicKey,
    profileToFollow: anchor.web3.PublicKey
  ) {
    const [connectionAccount, _] = await this.connectionPDA(
      follower,
      profileToFollow
    );
    return this.sdk.program.methods
      .initializeConnection()
      .accounts({
        connection: connectionAccount,
        profile: profileToFollow,
        authority: follower,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async closeConnection(
    follower: anchor.web3.PublicKey,
    profileToFollow: anchor.web3.PublicKey
  ) {
    const [connectionAccount, _] = await this.connectionPDA(
      follower,
      profileToFollow
    );
    return this.sdk.program.methods
      .closeConnection()
      .accounts({
        connection: connectionAccount,
        profile: profileToFollow,
        authority: follower,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
}
