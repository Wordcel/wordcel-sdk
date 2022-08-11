import { PublicKey, Keypair, Transaction } from "@solana/web3.js";

export class DummyWallet {
  publicKey: PublicKey;

  constructor() {
    const dummyPair = Keypair.generate();
    this.publicKey = dummyPair.publicKey;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx = new Transaction();
    return Promise.resolve(tx);
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return Promise.resolve(txs);
  }
}
