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
      document
        .getElementById(e.target.dataset.modalId)
        .classList.add("modal--active");
      break;

    case "close-simple-modal":
      e.preventDefault();
      document
        .getElementById(e.target.dataset.modalId)
        .classList.remove("modal--active");
      break;
  }
});

export { getCurrentUser };
