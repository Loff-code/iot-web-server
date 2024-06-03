let sum = 0;
let price = 0;
let cans = 20;
let fails = 0;

let bit = Array(5);

let canCount = document.querySelector(".canCount");
let priceDsp = document.getElementById("priceDsp");
let sumDsp = document.getElementById("sumDsp");
let textDisplay = document.querySelector(".textDisplay");
canCount.textContent = cans.toString();
priceDsp.value = price.toString();
sumDsp.value = sum.toString();
textDisplay.innerText = "hello";

function buy() {
  if (sum >= price && cans > 0) {
    textDisplay.innerText = "Item bought";
    sum -= price;
    cans -= 1;
    sumDsp.value = sum.toString();
  } else {
    textDisplay.innerText = "Low on cash";
    fails += 1;
  }
  canCount.textContent = cans.toString();
}

function coin2() {
  sum += 2;
  sumDsp.value = sum.toString();
}

function coin5() {
  sum += 5;
  sumDsp.value = sum.toString();
}

function bitUpdate(index) {
  bit[index] = !bit[index];
  priceUpdate();
}

function priceUpdate() {
  price = 0;
  for (let index = 0; index < bit.length; index++) {
    price += bit[index] ? 2 ** index : 0;
    priceDsp.value = price.toString();
  }
  console.log(price);
}

console.log(`cans = ${cans}`);
console.log(`sum=${sum}`);
console.log(`price=${price}`);
