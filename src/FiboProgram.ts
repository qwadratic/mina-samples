import { Proof, Provable, SelfProof, UInt64, ZkProgram } from "o1js";

export const FiboProgram = ZkProgram({
    name: 'fibo',
    publicInput: UInt64,
    publicOutput: UInt64,
    methods: {
      fibo: {
        privateInputs: [],
        method(n: UInt64): UInt64 {
          return Provable.if(
            n.lessThanOrEqual(UInt64.from(2)),
            UInt64.one,
            UInt64.zero
          )
        }
      },

      // step: {
      //   privateInputs: [SelfProof<UInt64, UInt64>],
      //   method(n: UInt64, prevProof: SelfProof<UInt64, UInt64>) {
      //     prevProof.publicOutput.add(n);
      //   }
      // }
    }
  });

export class FiboProof extends ZkProgram.Proof(FiboProgram) {}