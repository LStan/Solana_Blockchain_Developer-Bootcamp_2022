import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmAnchor } from "../target/types/gm_anchor";

const args = require('minimist')(process.argv.slice(2));

async function main() {
  const name = args['name'] || "Glass Chewer";

  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.GmAnchor as Program<GmAnchor>;

  //create an account to store the GM name
  const gmAccount = anchor.web3.Keypair.generate();

  console.log('GM account public key: ' + gmAccount.publicKey);
  console.log('user public key: ' + provider.wallet.publicKey);
  console.log('Program ID: ' + program.programId);

  let tx = await program.methods
    .execute(name)
    .accounts({
      gmAccount: gmAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([gmAccount])
    .rpc({ commitment: "confirmed" });

  console.log("Fetching transaction logs...");
  // let t = await provider.connection.getConfirmedTransaction(tx, "confirmed");
  // console.log(t.meta.logMessages);
  let t = await provider.connection.getTransaction(tx, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
  console.log(t!.meta!.logMessages);
  // #endregion main

  // Fetch the account details of the account containing the price data
  const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey);
  console.log('Stored GM Name Is: ' + storedName.name)
}

console.log("Running client...");
main().then(() => console.log("Success"));