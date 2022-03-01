import { showPrivateNavigation, showPublicNavigation } from "./navigation.js";
import { reloadPosts } from "./postFilters.js";
import { getApiResponse } from "./utility.js";

async function getCurrentUser() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) {
    return null;
  }

  const user = await getApiResponse(`/user/${userId}`);
  return user;
}

function setCurrentUser(userId) {
  localStorage.setItem("currentUserId", userId);

  showPrivateNavigation();

  reloadPosts();
}

function logoutCurrentUser() {
  localStorage.removeItem("currentUserId");

  showPublicNavigation();

  reloadPosts();
}

document.addEventListener("click", function (e) {
  if (!e.target.dataset.action && e.target.parentElement) {
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

    case "logout":
      e.preventDefault();
      logoutCurrentUser();
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

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = this.querySelector("[name=firstName]");
    const lastName = this.querySelector("[name=lastName]");
    const email = this.querySelector("[name=email]");

    const submitButton = this.querySelector(".form__submit-button");
    submitButton.innerHTML = "Loading. Please wait";
    submitButton.disabled = true;

    const { success, error, userId } = await userExists(
      firstName.value,
      lastName.value,
      email.value
    );

    submitButton.innerHTML = "Login";
    submitButton.disabled = false;

    if (!success) {
      this.querySelector(".form__error").innerHTML = error;
      return;
    }

    setCurrentUser(userId);

    closeModal("login-modal");
    firstName.value = "";
    lastName.value = "";
    email.value = "";
  });

document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = this.querySelector("[name=firstName]");
    const lastName = this.querySelector("[name=lastName]");
    const email = this.querySelector("[name=email]");
    const phone = this.querySelector("[name=phone]");
    const picture = this.querySelector("[name=picture]");

    const submitButton = this.querySelector(".form__submit-button");
    submitButton.innerHTML = "Loading. Please wait";
    submitButton.disabled = true;

    const { success, errors, userId } = await createUser(
      firstName.value,
      lastName.value,
      email.value,
      phone.value,
      picture.value
    );

    submitButton.innerHTML = "Registracija";
    submitButton.disabled = false;

    if (!success) {
      const errorList =
        "<ul><li>" + Object.values(errors).join("</li><li>") + "</li></ul>";
      this.querySelector(".form__error").innerHTML = errorList;
      return;
    }

    setCurrentUser(userId);

    closeModal("signup-modal");
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    phone.value = "";
    picture.value = "";
  });

async function userExists(firstName, lastName, email, page = 0) {
  const users = await getApiResponse(`/user?page=${page}&limit=50`);
  if (users.data.length === 0) {
    return {
      success: false,
      error: `ne postoji korisnik sa imenom "${firstName}" i prezimenom "${lastName}"`,
    };
  }

  const user = users.data.find(
    (u) => u.firstName === firstName && u.lastName === lastName
  );
  if (!user) {
    return userExists(firstName, lastName, email, page + 1);
  }

  const userData = await getApiResponse(`/user/${user.id}`);

  if (userData.email !== email) {
    return {
      success: false,
      error: `email "${email}" nije točan`,
    };
  }

  return {
    success: true,
    userId: user.id,
  };
}

async function createUser(firstName, lastName, email, phone, picture) {
  const user = await getApiResponse(
    "/user/create",
    "POST",
    {
      "Content-Type": "application/json",
    },
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      picture: picture,
    }
  );

  if (user.error === "BODY_NOT_VALID") {
    return {
      success: false,
      errors: user.data,
    };
  }

  return {
    success: true,
    userId: user.id,
  };
}

export { getCurrentUser };
