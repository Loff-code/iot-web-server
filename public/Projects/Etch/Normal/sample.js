// Create a container element
const container = [];

// Create and append div elements
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    container.push(document.createElement("div"));
    container[i].style.display = "flex";
    const box = document.createElement("div");
    box.style.width = "6vw";
    box.style.height = "6vh";
    // box.style.backgroundColor = "red";
    // box.style.margin = "1px";
    let name = "box" + i + "a" + j;
    box.className = name;

    container[i].appendChild(box);
    document.body.appendChild(container[i]);
  }
}
for (let index = 0; index < 16; index++) {
  for (let j = 0; j < 16; j++) {
    const box = document.querySelector(".box" + index + "a" + j);
    let red = (index + j) * (255 / 30);
    let blue = index * (255 / 15);
    let green = j * (255 / 15);
    box.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
  }
}

// for (let index = 0; index < 16; index++) {
//   const box01 = document.querySelector(".box" + index + "a1");
//   box01.style.backgroundColor = "rgb(255," + index * 10 + ", 0)";
// }
