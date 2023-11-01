import { Proof, UInt64, ZkProgram } from "o1js";

export const FiboProgram = ZkProgram({
    name: 'fibo',
    publicInput: UInt64,
    publicOutput: UInt64,
    methods: {
      fibo: {
        privateInputs: [],
        method(n: UInt64): UInt64 {
          return n
        }
      }
    }
  });

export class FiboProof extends ZkProgram.Proof(FiboProgram) {
    static publcOutput = this.prototype.publicOutput;
}