import { Mina, UInt64 } from "o1js";
import { deploy, now, randomKeyPair, testAccounts, useProof } from "./common";
import { Input, Loop } from "./Loop";

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
  await Loop.compile();
  console.log(now(), ': compiled contract')
}

const zkAppInstance = new Loop(zkAppAddress);

await deploy(deployerAccount, deployerKey, zkAppPrivateKey, zkAppInstance);

let x = zkAppInstance.n.get().toString()
console.log(now(), ': deployed with state', x)

const arr = [1, 2, 3].map(x => UInt64.from(x));
const tx = await Mina.transaction(senderAccount, () => {
  zkAppInstance.sum(new Input({value: arr}));
});
await tx.prove();
console.log(now(), ': proved method call')
await tx.sign([senderKey]).send();

x = zkAppInstance.n.get().toString();
console.log(now(), ': new state: ', x)
