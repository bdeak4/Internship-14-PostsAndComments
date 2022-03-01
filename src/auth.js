async function getCurrentUser() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return null;
  }

  const user = await getApiResponse(`/user/${userId}`);
  console.log(user);
  return user;
}

document.addEventListener("click", function (e) {
  if (!e.target.dataset.action) {
    e.target.parentElement.click();
    return;
  }

  switch (e.target.dataset.action) {
    case "open-simple-modal":
      e.preventDefault();
      openModal(e.target.dataset.modalId);
      break;

    case "close-simple-modal":
      e.preventDefault();
      closeModal(e.target.dataset.modalId);
      break;
  }
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  modal.classList.add("modal--active");

  const formError = modal.querySelector(".form__error");
  if (formError) {
    formError.innerHTML = "";
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("modal--active");
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  this.querySelector(".form__error").innerHTML = "neki err";
});

export { getCurrentUser };
