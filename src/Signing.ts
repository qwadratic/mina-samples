import { 
  SmartContract, method, state, State, 
  Signature, PublicKey, CircuitString, Field 
} from "o1js";


export class Signing extends SmartContract {
  @state(PublicKey) lastSender = State<PublicKey>();
  @state(Field) lastMessageHash = State<Field>();

  @method sendMessage(signer: PublicKey, msg: CircuitString, signature: Signature) {
    signature.verify(signer, msg.toFields()).assertTrue();
    this.lastSender.set(signer);
    this.lastMessageHash.set(msg.hash());
  }
}

