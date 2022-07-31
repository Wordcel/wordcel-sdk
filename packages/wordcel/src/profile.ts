import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";

export class Profile {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  profilePDA(sdk: SDK, randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["profile"], randomHash],
      WORDCEL_PROGRAMS[sdk.cluster]
    );
  }

  getProfile(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.profile.fetch(account);
  }

  // @unsupported
  createProfile() {
    throw new Error("Unsupported Action");
  }
}
