contract Loop {
  uint public n;

  function sum(uint[] memory numbers) public {
    uint sum_;
    for (uint i = 0; i < numbers.length; i++) {
      sum_ += numbers[i];
    }
    n = sum_;
  }

  function good(uint n) public {
    for (uint i; i < n; i++) {
      // ...
    }
  }
}

