import { AccountUpdate, Mina } from "o1js";
import { Counter } from "./Counter";
import { now, randomKeyPair, testAccounts, useProof } from "./common";

const { 
  privateKey: deployerKey, 
  publicKey: deployerAccount 
} = testAccounts[0];
const { 
  privateKey: senderKey, 
  publicKey: senderAccount 
} = testAccounts[1];

const {
  private: zkAppPrivateKey,
  public: zkAppAddress
} = randomKeyPair();
  
if (useProof) {
  await Counter.compile();
  console.log(now(), ': compiled contract')
}

const zkAppInstance = new Counter(zkAppAddress);

const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
console.log(now(), ': proved deploy tx')
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

let x = zkAppInstance.count.get().toString()
console.log(now(), ': deployed with state', x)

const tx = await Mina.transaction(senderAccount, () => {
  zkAppInstance.inc();
});
await tx.prove();
console.log(now(), ': proved method call')
await tx.sign([senderKey]).send();

x = zkAppInstance.count.get().toString();
console.log(now(), ': new state: ', x)