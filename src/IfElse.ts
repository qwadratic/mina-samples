import { SmartContract, method, UInt64, state, State, Provable } from "o1js";


export class IfElse extends SmartContract {
  @state(UInt64) n = State<UInt64>();

  @method foo(x: UInt64) {
    const n = Provable.if(
      x.lessThan(UInt64.from(10)),
      UInt64.from(1),
      UInt64.from(2)
    )
    this.n.set(n);
  }

  @method bar(x: UInt64) {
    const ifs = [1, 3, 5, 9].map(_ => x.equals(UInt64.from(_)));
    const thens = [3, 5, 1, 11].map(_ => UInt64.from(_));
    const default_ = UInt64.from(42);
    let n = Provable.switch(ifs, UInt64, thens);
    n = Provable.if(
      n.equals(UInt64.zero),
      default_,
      n
    );
    this.n.set(n);
  }
}
