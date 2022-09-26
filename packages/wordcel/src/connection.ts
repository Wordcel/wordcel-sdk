import { SDK } from "./sdk";
import * as anchor from "@project-serum/anchor";
import { SEED_PREFIXES, WORDCEL_PROGRAMS } from "./constants";
import { gql } from "graphql-request";

const { SystemProgram } = anchor.web3;

export class Connection {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }
  /**
   * Return's the PDA Derived from the provided Inputs
   *
   * @remarks
   *
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns A Connection PDA Address
   *
   * @beta
   */
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

  // getConnectionOfUser(account: anchor.web3.PublicKey) {
  //   return this.sdk.program.account.connection.all([
  //     {
  //       memcmp: {
  //         offset: 8 + 32,
  //         bytes: account.toBase58(),
  //       },
  //     },
  //   ]);
  // }

  /**
   * Return's the List of all the posts for a user Publickey
   *
   * @remarks
   *
   *
   * @param user - Publickey of the User
   *
   * @beta
   */
  getAllConnectionPostsGQL(user: anchor.web3.PublicKey) {
    // TODO: Add order by and pagination
    const query = gql`
        query getAllPostsOfYourConnections {
          wordcel_0_1_1_decoded_connection(
            where: {
              authority: { _eq: "${user}" }
            }
          ) {
            authority
            profile
            profile_in_connection {
              authority
              cl_pubkey
              posts_inside_profile {
                metadatauri
              }
            }
          }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }
  /**
   * Fetches the User address of all the addresses followed by a user
   *
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param user - User Publickey
   *
   * @returns the addresses of all the users follower by a user Pubkey
   *
   * @beta
   */
  getConnections(user: anchor.web3.PublicKey) {
    const query = gql`
          query getConnectionsByUser {
              wordcel_0_1_1_decoded_connection(
              where: {authority: {_eq: "${user}"}}
              ) {
                  profile
                  profile_in_connection {
                      authority
                  }
              }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }
  /**
   * Fetches the Data of the Connections for a Profile PDA
   *
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param profile - The Profile PDA pubkey
   *
   * @returns Data of all the Connections for a Profile PDA
   *
   * @beta
   */
  getConnectionsByProfileGQL(profile: anchor.web3.PublicKey) {
    const query = gql`
          query getConnectionsByUser {
              wordcel_0_1_1_decoded_connection(
              where: {profile: {_eq: "${profile}"}}
              ) {
                  authority
                  cl_pubkey
                  profile_in_connection {
                      authority
                  }
              }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }
  /**
   * Return's the data of the Connection PDA Account
   *
   * @remarks
   *
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns The data of the connection PDA Account
   */
  getConnectionPDAData(account: anchor.web3.PublicKey) {
    return this.sdk.program.account.connection.fetch(account);
  }

  /**
   * Return's the Transaction Signature
   *
   * @remarks
   * This is used to follow a Profile
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns The Transaction Signature
   *
   *
   * @beta
   */
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
      .instruction();
  }
  /**
   * Return's the Transaction Signature
   *
   * @remarks
   * This is used to Unfollow a Profile
   *
   * @param follower - The address who wants to unfollow
   * @param profileToFollow  - The Profile PDA of the address to unfollow
   * @returns The Transaction Signature
   *
   * @beta
   */
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
      .instruction();
  }
}
