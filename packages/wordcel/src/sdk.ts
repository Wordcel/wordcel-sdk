import * as anchor from "@project-serum/anchor";
import { WORDCEL_PROGRAMS } from "./constants";
import wordcel_idl from "./idl/wordcel.json";
import { Cluster } from "@solana/web3.js";
import { GraphQLClient } from "graphql-request";

export class SDK {
  readonly program: anchor.Program;
  readonly provider: anchor.AnchorProvider;
  readonly cluster: Cluster | "localnet";
  readonly gqlClient: GraphQLClient;

  constructor(
    provider: anchor.AnchorProvider,
    cluster: Cluster | "localnet",
    gqlClient: GraphQLClient
  ) {
    this.program = new anchor.Program(
      wordcel_idl as anchor.Idl,
      WORDCEL_PROGRAMS[cluster],
      provider
    );
    this.provider = provider;
    this.cluster = cluster;
    this.gqlClient = gqlClient;
  }
}
