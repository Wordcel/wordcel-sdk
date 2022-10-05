import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";
import randombytes from "randombytes";
import { gql, GraphQLClient } from "graphql-request";
const { SystemProgram } = anchor.web3;

/**
 * Object that contains the Publickey of the invitation Program
 *
 *
 * @beta
 */
const invitationProgram = {
  programId: new anchor.web3.PublicKey(
    "7yZdmhNtEFBXTioxxp6qb8k1GoQw3uxrqRn1675FhV9n"
  ),
};
/**
 * This Class contains all the Function's that includes interaction with Profile Account on-chain
 *
 *
 * @beta
 */
export class Profile {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }
  /**
   * Returns the Profile PDA
   *
   * @remarks
   * This function takes in the randomHash and returns a PDA
   *
   *
   * @beta
   */
  profilePDA(randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddress(
      [SEED_PREFIXES["profile"], randomHash],
      WORDCEL_PROGRAMS[this.sdk.cluster]
    );
  }

  /**
   * Return's the Data for all the profile accounts created by a user Pubkey
   *
   * @remarks
   * This function does a GraphQL Query and is much faster and efficient in fetching data
   *
   *@param user - Pubkey of the creator of the profile account
   *
   * @beta
   */
  getProfilesByUserGQL(user: anchor.web3.PublicKey) {
    const query = gql`
        query getProfileByUser {
          wordcel_0_1_1_decoded_profile( where: {
              authority: { _eq: "${user}" }
            }
          ) {
            cl_pubkey
          }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }
  /**
   * Returns the Profile Account for a Pubkey
   *
   *
   *
   *@param account - Pubkey of the creator of the profile account
   *
   * @beta
   */
  getProfileByUserRPC(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.profile.all([
      {
        memcmp: {
          offset: 8,
          bytes: account.toBase58(),
        },
      },
    ]);
  }

  /**
   * Fetches the List of all the Profile's created by a user Pubkey
   *EW8yRoHiGdvzK8rjAtaTS5MgZyVRUbBR35eKFF9e4mu8
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param profile - User Pubkey
   *
   * @returns all the Profiles created by a User
   *
   * @beta
   */
  getProfilesByUser(user: anchor.web3.PublicKey) {
    const query = gql`
        query getProfileByUser {
          wordcel_0_1_1_decoded_profile( where: {
              authority: { _eq: "${user}" }
            }
          ) {
            cl_pubkey
          }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }

  /**
   * This Function return's the data for a profile account PDA
   *
   * @remarks
   * This fetches the data of the profile account
   *
   * @param account - Profile PDA Pubkey
   *
   * @beta
   */
  getProfile(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.profile.fetch(account);
  }

  /**
   * Return's the Instruction for creating a profile
   *
   * @remarks
   * This is used to create a profile
   *
   * @param user - The Publickey for which the profile account is getting created
   * @param inviteAccount  - The Publickey that invited to create the account
   * @returns A Instruction
   *
   *
   * @beta
   */
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
      .instruction();
  }
}
