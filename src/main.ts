import { AccountUpdate, Field, Mina, PrivateKey } from "o1js";
import { PingPong } from "./PingPong.js";

const useProof = true;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

if (useProof) await PingPong.compile();

const zkAppInstance = new PingPong(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

const txn1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.ping(Field(0));
  });
await txn1.prove();
await txn1.sign([senderKey]).send();
