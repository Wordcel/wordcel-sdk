import * as anchor from "@project-serum/anchor";

export const WORDCEL_PROGRAMS = {
  "mainnet-beta": new anchor.web3.PublicKey(
    "EXzAYHZ8xS6QJ6xGRsdKZXixoQBLsuMbmwJozm85jHp"
  ),
  devnet: new anchor.web3.PublicKey(
    "D9JJgeRf2rKq5LNMHLBMb92g4ZpeMgCyvZkd7QKwSCzg"
  ),
  localnet: new anchor.web3.PublicKey(
    "CTR82i94BRme1qTNNVzDHW78Ssa9wFSmUZ1dpfYPqhp4"
  ),
};

export const SEED_PREFIXES = {
  post: Buffer.from("post"),
  profile: Buffer.from("profile"),
  connection: Buffer.from("connection"),
};
