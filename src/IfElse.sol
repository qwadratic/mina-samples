contract IfElse {
  uint n;
  
  function foo(uint x) public {
    if (x < 10) {
      n = 1;
    } else {
      n = 2;
    }
  }

  function bar(uint x) public {
    if (x == 1) {
      n = 3;
    } else if (x == 3) {
      n = 5;
    } else if (x == 5) {
      n = 1;
    } else if (x == 9) {
      n = 11;
    } else {
      n = 42;
    }
  }
}

