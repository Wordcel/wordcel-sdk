import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";

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

  createConnection() {
    throw new Error("Unsupported Action");
  }

  closeConnection() {
    throw new Error("Unsupported Action");
  }
}
