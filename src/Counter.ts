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

  // @method bad(x: UInt64, n: UInt64) {
  //   const n0 = Number(n.toString());
  //   for (let i = 0; i < n0; i += 1) {
  //     x.equals(UInt64.from(i.toString())).assertFalse();
  //   }
  // }

  // @method good1(x: UInt64) {
  //   for (let y of [0, 1, 2]) {
  //     x.equals(UInt64.from(y)).assertFalse();
  //   }
  // }

}



