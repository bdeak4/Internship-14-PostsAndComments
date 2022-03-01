import { getCurrentUser } from "./auth.js";
import { printOwner } from "./utility.js";

async function showPrivateNavigation() {
  document.querySelector(".actions-public").classList.add("hidden");
  document.querySelector(".actions-private").classList.remove("hidden");

  const user = await getCurrentUser();
  document.querySelector(".actions-private__user").innerHTML = printOwner(user);
}

function showPublicNavigation() {
  document.querySelector(".actions-public").classList.remove("hidden");
  document.querySelector(".actions-private").classList.add("hidden");

  document.querySelector(".actions-private__user").innerHTML = "";
}

async function switchNavigationIfLoggedIn() {
  const user = await getCurrentUser();
  if (user) {
    await showPrivateNavigation();
  }
}

export {
  showPrivateNavigation,
  showPublicNavigation,
  switchNavigationIfLoggedIn,
};
