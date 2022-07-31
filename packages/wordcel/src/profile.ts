import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";
import randombytes from "randombytes";

const { SystemProgram } = anchor.web3;
// Temp
const invitationProgram = SystemProgram;

export class Profile {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  profilePDA(randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["profile"], randomHash],
      WORDCEL_PROGRAMS[this.sdk.cluster]
    );
  }

  getProfile(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.profile.fetch(account);
  }

  async createProfile(
    user: anchor.web3.PublicKey,
    inviteAccount: anchor.web3.PublicKey
  ) {
    const randomHash = randombytes(32);
    const [profileAccount, _] = await this.profilePDA(randomHash);
    return this.sdk.program.methods
      .initialize(randomHash)
      .accounts({
        profile: profileAccount,
        user: user,
        invitation: inviteAccount,
        invitationProgram: invitationProgram.programId,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
}
