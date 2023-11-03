import { Mina, PrivateKey } from "o1js";

export const useProof = true;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

export const testAccounts = Local.testAccounts;

export const now = () => {
    return new Date().toLocaleString()
}

export const randomKeyPair = () => {
    const priv = PrivateKey.random();
    return {
        private: priv, 
        public: priv.toPublicKey()
    }
}