import assert from 'assert';
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmAnchor } from "../target/types/gm_anchor";

describe("gm-anchor", () => {
  const name = "test name";

  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const gmAccount = anchor.web3.Keypair.generate();
  const program = anchor.workspace.GmAnchor as Program<GmAnchor>;

  it("Should save a name", async () => {
    // Add your test here.
    const tx = await program.methods
      .execute(name)
      .accounts({
        gmAccount: gmAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([gmAccount])
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);

    const account = await program.account.greetingAccount.fetch(gmAccount.publicKey);
    assert.ok(account.name === name);
  });
});
