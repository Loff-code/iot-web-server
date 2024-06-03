// sessionStorage.clear();
// localStorage.clear();
const userNameText = document.querySelector(".userName");
const userAgeText = document.querySelector(".userAge");

const saveNameButton = document.querySelector(".saveNameBtn");
const saveAgeButton = document.querySelector(".saveAgeBtn");

const deleteSessionStorageButton = document.querySelector(".deleteSStorageBtn");
const deleteLocalStorageButton = document.querySelector(".deleteLStorageBtn");

deleteLocalStorageButton.addEventListener("click", () => {
  localStorage.clear();
});

deleteSessionStorageButton.addEventListener("click", () => {
  sessionStorage.clear();
});

saveAgeButton.addEventListener("click", () => {
  const userAge = document.querySelector(".age").value;
  userAgeText.textContent = userAge;
  sessionStorage.setItem("age", userAge);
});
saveNameButton.addEventListener("click", () => {
  const userName = document.querySelector(".name").value;
  userNameText.textContent = userName;
  localStorage.setItem("name", userName);
});

function displayUserAge() {
  const ageFromSessionStorage = sessionStorage.getItem("age");

  if (ageFromSessionStorage) {
    userAgeText.textContent = ageFromSessionStorage;
  } else {
    userAgeText.textContent = "No age data in session storage";
  }
}

displayUserAge();

function displayUserName() {
  const nameFromLocalStorage = localStorage.getItem("name");

  if (nameFromLocalStorage) {
    userNameText.textContent = nameFromLocalStorage;
  } else {
    userNameText.textContent = "No name data in local storage";
  }
}

displayUserName();
