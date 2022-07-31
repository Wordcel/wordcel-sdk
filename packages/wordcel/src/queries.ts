import * as anchor from "@project-serum/anchor";
import { gql, GraphQLClient } from "graphql-request";

export function getPostsByProfile(
  client: GraphQLClient,
  profile: anchor.web3.PublicKey
) {
  // TODO: Add order by and pagination
  const query = gql`
      query getAllPostsOfAProfile {
        wordcel_0_1_1_decoded_profile( where: {
            cl_pubkey: { _eq: "${profile}" }
          }
        ) {
          authority
          cl_pubkey
          posts_inside_profile {
            cl_pubkey
            metadatauri
          }
        }
      }
    `;
  return client.request(query);
}

export function getAllConnectionPosts(
  client: GraphQLClient,
  user: anchor.web3.PublicKey
) {
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
  return client.request(query);
}

export function getConnections(
  client: GraphQLClient,
  user: anchor.web3.PublicKey
) {
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
  return client.request(query);
}

export function getConnectionsByProfile(
  client: GraphQLClient,
  profile: anchor.web3.PublicKey
) {
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
  return client.request(query);
}

export function getProfileByUser(
  client: GraphQLClient,
  user: anchor.web3.PublicKey
) {
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
  return client.request(query);
}
