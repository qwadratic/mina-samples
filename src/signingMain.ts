import { CircuitString, Mina, Signature } from "o1js";
import { deploy, now, randomKeyPair, testAccounts, useProof } from "./common";
import { Signing } from "./Signing";

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

console.log('sender', senderAccount.toBase58());
console.log('deployer', deployerAccount.toBase58());
console.log('zkApp', zkAppAddress.toBase58());

if (useProof) {
  await Signing.compile();
  console.log(now(), ': compiled contract')
}

const zkAppInstance = new Signing(zkAppAddress);

await deploy(deployerAccount, deployerKey, zkAppPrivateKey, zkAppInstance);

console.log(now(), ': deployed');

let lastSender = zkAppInstance.lastSender.get().toBase58();
let lastMessageHash = zkAppInstance.lastMessageHash.get().toString();
console.log(now(), ': lastMessageHash', lastMessageHash, 'by', lastSender)

const message = CircuitString.fromString("hello");
const signature = Signature.create(senderKey, message.toFields());

const tx = await Mina.transaction(senderAccount, () => {
  zkAppInstance.sendMessage(senderAccount, message, signature);
});
await tx.prove();
console.log(now(), ': proved method call')
await tx.sign([senderKey]).send();

lastSender = zkAppInstance.lastSender.get().toBase58();
lastMessageHash = zkAppInstance.lastMessageHash.get().toString();
console.log(now(), ': lastMessageHash', lastMessageHash, 'by', lastSender);
