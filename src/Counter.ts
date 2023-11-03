import { SmartContract, method, UInt64, state, State, Provable, Field, Struct } from "o1js";


export class Counter extends SmartContract {
  @state(UInt64) count = State<UInt64>();

  @method get(): UInt64 {
    return this.count.getAndAssertEquals();
  }

  @method inc() {
    const count = this.count.getAndAssertEquals();
    this.count.set(count.add(1));
  }

}
