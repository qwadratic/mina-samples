import { Field, SmartContract, method, Provable } from "o1js";

export class PingPong extends SmartContract {

  @method ping(n: Field) {
    const me = new PingPong(this.address);
    Provable.log(n);
    me.pong(n.add(1));
  }

  @method pong(n: Field) {
    const me = new PingPong(this.address);
    me.ping(n);
  }
}