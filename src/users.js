import { getApiResponse } from "./utility.js";

document.addEventListener("click", function (e) {
  switch (e.target.dataset.action) {
    case "show-user":
      e.preventDefault();
      getUser(e.target.dataset.userId);
      break;
  }
});

async function getUser(userId) {
  const modal = document.getElementById("user-modal");

  if (modal.classList.contains("modal--active")) {
    closeUserModal();
  } else {
    modal.classList.add("modal--active");
  }

  const user = await getApiResponse(`/user/${userId}`);

  modal.classList.add("modal--active");

  updateUserModal(user);
}

function updateUserModal(user) {
  const modal = document.getElementById("user-modal");

  modal.querySelector(".user__image").src = user.picture || "";

  modal.querySelector(".user__name").innerHTML = user.firstName
    ? `${user.firstName} ${user.lastName}`
    : "Loading...";

  modal.querySelector(".user__register-date").innerHTML = user.registerDate
    ? `<b>Registracija:</b> ${new Date(user.registerDate).toLocaleString()}`
    : "";

  modal.querySelector(".user__birthday").innerHTML = user.dateOfBirth
    ? `<b>Rođendan:</b> ${new Date(user.dateOfBirth).toLocaleString()}`
    : "";

  modal.querySelector(".user__email").innerHTML = user.email
    ? `<b>Email:</b> ${user.email}`
    : "";

  modal.querySelector(".user__phone").innerHTML = user.phone
    ? `<b>Telefon:</b> ${user.phone}`
    : "";
}

document
  .querySelector('[data-action="close-modal"][data-modal-id="user-modal"]')
  .addEventListener("click", () => closeUserModal());

function closeUserModal() {
  const modal = document.getElementById("user-modal");
  modal.classList.remove("modal--active");
  setTimeout(() => updateUserModal({}), 500);
}
