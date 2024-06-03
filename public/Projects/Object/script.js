function name(params) {
  let user = {
    name: "John",
    age: 30,
  };

  let key = prompt("What do you want to know about the user?", "name");

  // access by variable
  alert(user[key]); // John (if enter "name")
}

let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert(bag.apple); // 5 if fruit="apple"
