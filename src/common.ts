import { AccountUpdate, Mina, PrivateKey, PublicKey, SmartContract } from "o1js";

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

export const deploy = async (
    deployerAccount: PublicKey, 
    deployerKey: PrivateKey, 
    zkAppPrivateKey: PrivateKey, 
    zkAppInstance: SmartContract) => {
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount);
        zkAppInstance.deploy();
      });
    await deployTxn.prove();
    console.log(now(), ': proved deploy tx')
    await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
}