contract Signing {
  address lastSender;
  bytes32 lastMessageHash;

  function splitSignature(bytes memory sig) 
    public pure returns (bytes32 r, bytes32 s, uint8 v) {
    require(sig.length == 65, "invalid signature length");
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
  }

  function verify(
    address signer, string memory _msg, bytes memory signature
  ) public pure returns (bool) {
    bytes32 messageHash = keccak256(abi.encodePacked(_msg));
    bytes32 ethSignedMessageHash = keccak256(abi.encodePacked(
      "\x19Ethereum Signed Message:\n32", messageHash));
    (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
    return ecrecover(ethSignedMessageHash, v, r, s) == signer;
  }

  function sendMessage(
    address signer, string memory _msg, bytes memory signature) public {
    require(verify(signer, _msg, signature));
    lastSender = signer;
    lastMessageHash = keccak256(abi.encodePacked(_msg));
  }
}

