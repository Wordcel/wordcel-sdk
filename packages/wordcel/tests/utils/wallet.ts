import * as anchor from "@project-serum/anchor";
import fs from "fs";

const jsonKeypair = fs.readFileSync("tests/keypairs/id.json", "utf8");

const keypair = anchor.web3.Keypair.fromSecretKey(
  Buffer.from(JSON.parse(jsonKeypair))
);

const wallet = new anchor.Wallet(keypair);

export default wallet;
