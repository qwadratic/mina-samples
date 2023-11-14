import { SmartContract, method, state, State, Field, CircuitString, Poseidon } from "o1js";


export class Hashing extends SmartContract {
  @state(Field) answer = State<Field>();

  init() {
    super.init();
    this.answer.set(Field.from(
      "5724269380070954412092476465713312532967243037143255279873900691201697126738"
    ));
  }

  // magic word is "o1js"
  @method guess(word: CircuitString) {
    const answer = this.answer.getAndAssertEquals();
    Poseidon.hash(word.toFields()).assertEquals(answer);
  }
}
