import { AccountUpdate, CircuitString, Mina, Poseidon } from "o1js";
import { Hashing } from "./Hashing";
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
  await Hashing.compile();
  console.log(now(), ': compiled contract')
}

const zkAppInstance = new Hashing(zkAppAddress);

await deploy(deployerAccount, deployerKey, zkAppPrivateKey, zkAppInstance);

let x = zkAppInstance.answer.get().toString()
console.log(now(), ': deployed with state', x)

let tx;
const wrong = CircuitString.fromString('Solidity');
const correct = CircuitString.fromString('o1js');
console.log('wrong hash', wrong.hash().toString());
console.log('correct hash', correct.hash().toString());
try {
  tx = await Mina.transaction(senderAccount, () => {
    zkAppInstance.guess(wrong);
  });
  await tx.prove();
  await tx.sign([senderKey]).send();
} catch (error) {
  console.log(now(), 'wrong guess')

  tx = await Mina.transaction(senderAccount, () => {
    zkAppInstance.guess(correct);
  });
  await tx.prove();
  await tx.sign([senderKey]).send();
  console.log(now(), 'correct guess')
}



