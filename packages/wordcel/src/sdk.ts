import * as anchor from "@project-serum/anchor";
import { WORDCEL_PROGRAMS } from "./constants";
import { Wordcel } from "./idl/wordcel";
import IDL from "./idl/wordcel.json";
import { Cluster } from "@solana/web3.js";
import { GraphQLClient } from "graphql-request";
import { Post } from "./post";
// import { Connection } from "./connection";
import { Profile } from "./profile";
import { Program } from "@project-serum/anchor";

export const getProvider = (
  wallet: anchor.Wallet,
  connection: anchor.web3.Connection,
  opts: anchor.web3.ConfirmOptions
) => {
  // const connectionURI =
  //   process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
  // const connection = new anchor.web3.Connection(
  //   connectionURI,
  //   opts.preflightCommitment
  // );

  const provider = new anchor.AnchorProvider(connection, wallet, opts);
  return provider;
};
/**
 * Creates a SDK Object
 *
 * @remarks
 * This object is used to interact with Wordcel's on-chain programs.
 *
 *
 * @beta
 */
export class SDK {
  readonly program: anchor.Program;
  readonly provider: anchor.AnchorProvider;
  readonly cluster: Cluster | "localnet";
  readonly gqlClient: GraphQLClient;

  constructor(
    wallet: anchor.Wallet,
    connection: anchor.web3.Connection,
    cluster: Cluster | "localnet",
    gqlClient: GraphQLClient
  ) {
    const provider = getProvider(
      wallet,
      connection,
      // The Opts needs to be taken from user i think
      anchor.AnchorProvider.defaultOptions()
    );
    this.program = new anchor.Program(
      IDL as anchor.Idl,
      WORDCEL_PROGRAMS[cluster],
      provider
    );
    // as unknown as Program<Wordcel>;
    this.provider = provider;
    this.cluster = cluster;
    this.gqlClient = gqlClient;
  }

  // public post = new Post(this);
  // public connection = new Connection(this);
  // public profile = new Profile(this);
}
