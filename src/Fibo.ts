import { SmartContract, method, UInt64, state, State } from "o1js";
import { FiboProof } from "./FiboProgram.js";



export class Fibo extends SmartContract {
  @state(UInt64) x = State<UInt64>();
  
  init() {
    super.init();
    this.x.set(UInt64.zero);
  }

  @method submit(proof: FiboProof) {
    this.x.getAndAssertEquals();
    proof.verify();
    this.x.set(proof.publicOutput);
  }

}
