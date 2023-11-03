import { SmartContract, method, UInt64, state, State, Provable, Struct } from "o1js";

export class Input extends Struct({
  value: Provable.Array(UInt64, 3)
}) {}

export class Loop extends SmartContract {
  @state(UInt64) n = State<UInt64>();

  @method sum(secretNumbers: Input) {
    const sum_ = UInt64.zero;
    for (let sn of secretNumbers.value) {
      sum_.add(sn);
    }
    this.n.set(sum_);
  }

  @method good(x: UInt64) {
    for (let y of [0, 1, 2]) {
      // ...
    }
  }

  // @method bad(x: Field, n: Field) {
  //   // n is an abstract private input -> this line fails
  //   const n0 = Number(n.toString()); 
  //   for (let i = 0; i < n0; i += 1) {
  //     // ...
  //   }
  // }
}



