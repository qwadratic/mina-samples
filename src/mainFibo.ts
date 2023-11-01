import { AccountUpdate, Mina, PrivateKey, UInt64 } from "o1js";
import { Fibo } from "./Fibo.js";
import { FiboProgram } from "./FiboProgram.js";

await FiboProgram.compile();
const proof = await FiboProgram.fibo(UInt64.from(5));

const useProof = true;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

if (useProof) await Fibo.compile();

const zkAppInstance = new Fibo(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

const tx = await Mina.transaction(senderAccount, () => {
    zkAppInstance.submit(proof);
  });
await tx.prove();
await tx.sign([senderKey]).send();

console.log(zkAppInstance.x.get())