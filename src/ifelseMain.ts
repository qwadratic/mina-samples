import { Mina, UInt64 } from "o1js";
import { deploy, now, randomKeyPair, testAccounts, useProof } from "./common";
import { IfElse } from "./IfElse";

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
  await IfElse.compile();
  console.log(now(), ': compiled contract')
}

const zkAppInstance = new IfElse(zkAppAddress);

await deploy(deployerAccount, deployerKey, zkAppPrivateKey, zkAppInstance);

let x = zkAppInstance.n.get().toString()
console.log(now(), ': deployed with state', x)

const fooTests = [5, 11].map(_ => UInt64.from(_));
for (let n of fooTests) {
  const tx = await Mina.transaction(senderAccount, () => {
    zkAppInstance.foo(n);
  });
  await tx.prove();
  console.log(now(), ': proved method call')
  await tx.sign([senderKey]).send();

  x = zkAppInstance.n.get().toString();
  console.log(now(), ': new state: ', x)
}

const barTests = [1, 3, 5, 9, 10].map(_ => UInt64.from(_));
for (let n of barTests) {
  const tx = await Mina.transaction(senderAccount, () => {
    zkAppInstance.bar(n);
  });
  await tx.prove();
  console.log(now(), ': proved method call')
  await tx.sign([senderKey]).send();

  x = zkAppInstance.n.get().toString();
  console.log(now(), ': new state: ', x)
}


