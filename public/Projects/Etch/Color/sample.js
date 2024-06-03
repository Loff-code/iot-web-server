// Create a container element

const inputField = document.createElement("div");
const input = document.createElement("input");
input.type = "number";
input.placeholder = "Enter text";
document.body.appendChild(inputField);
inputField.appendChild(input);
inputField.style.display = "flex";

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    start();
  }
});

function start() {
  clearBoard();
  const inputValue = input.value;
  console.log(inputValue);
  board(inputValue > 100 ? 100 : inputValue);
  // Use the inputValue variable for further processing
}

const button = document.createElement("button");
button.textContent = "Create Variable";
button.addEventListener("click", function () {
  start();
});
inputField.appendChild(button);

const button2 = document.createElement("button");
button2.textContent = "Clear";
button2.addEventListener("click", function () {
  clearBoard();
});

inputField.appendChild(button2);

const biggestBox = document.createElement("div");
biggestBox.className = "biggestBoxOfThemAll";
document.body.appendChild(biggestBox);

function clearBoard() {
  const page = document.querySelector(".biggestBoxOfThemAll");
  page.innerHTML = "";
}

function board(size) {
  const container = [];
  // let size = 100;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const unit = height > width ? "vh" : "vw";
  // Create and append div elements

  const page = document.createElement("div");
  page.className = "bigBox";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      container.push(document.createElement("div"));
      container[i].style.display = "flex";
      const box = document.createElement("div");
      box.style.width = (5 * 16) / size + unit;
      box.style.height = (5 * 16) / size + unit;
      // box.style.backgroundColor = "red";
      // box.style.margin = "1px";
      let name = "box" + i + "a" + j;
      box.className = name;
      container[i].appendChild(box);
      page.appendChild(container[i]);
    }
  }

  biggestBox.appendChild(page);
  page.style.margin = 2 + unit + " " + 10 + unit;

  for (let index = 0; index < size; index++) {
    for (let j = 0; j < size; j++) {
      const box = document.querySelector(".box" + index + "a" + j);
      let red = (index + j) * (255 / (size * 2));
      let blue = index * (255 / size);
      let green = j * (255 / size);
      box.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
    }
  }

  // Add event listener to each box element
  for (let index = 0; index < size; index++) {
    for (let j = 0; j < size; j++) {
      const box = document.querySelector(".box" + index + "a" + j);
      box.addEventListener("mouseover", function (event) {
        if (event.buttons === 1) {
          box.style.backgroundColor = "yellow";
        }
      });
      // box.addEventListener("mouseout", function () {
      //   let red = (index + j) * (255 / 30);
      //   let blue = index * (255 / 15);
      //   let green = j * (255 / 15);
      //   box.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
      // });
    }
  }
}
