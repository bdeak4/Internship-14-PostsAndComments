const intervalIds = {};

function startLoading(loadingSelector) {
  const loadingSelectorElement = document.querySelector(loadingSelector);

  loadingSelectorElement.querySelector(".dots").innerHTML = "";

  loadingSelectorElement.classList.remove("hidden");

  intervalIds[loadingSelector] = setInterval(() => {
    loadingSelectorElement.querySelector(".dots").innerHTML += ".";
  }, 50);
}

function stopLoading(loadingSelector) {
  const loadingSelectorElement = document.querySelector(loadingSelector);

  loadingSelectorElement.classList.add("hidden");

  if (intervalIds[loadingSelector] !== undefined) {
    clearInterval(intervalIds[loadingSelector]);
    delete intervalIds[loadingSelector];
  }

  loadingSelectorElement.querySelector(".dots").innerHTML = "";
}

export { startLoading, stopLoading };
