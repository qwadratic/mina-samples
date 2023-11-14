import { Mina } from "o1js";
import { Counter } from "./Counter";
import { deploy, now, randomKeyPair, testAccounts, useProof } from "./common";

console.log(now(), ': started')

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

await deploy(deployerAccount, deployerKey, zkAppPrivateKey, zkAppInstance);

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