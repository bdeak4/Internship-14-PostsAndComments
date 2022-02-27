import { getPosts } from "./posts.js";

document.addEventListener("click", function (e) {
  switch (e.target.dataset.action) {
    case "add-tag-filter":
      addTagFilter(e);
      break;

    case "remove-tag-filter":
      removeTagFilter(e);
      break;

    case "set-user-filter":
      setUserIdFilter(e);
      break;

    case "reset-user-filter":
      resetUserIdFilter(e);
      break;
  }
});

function addTagFilter(e) {
  e.preventDefault();
  const { tag } = e.target.dataset;
  const newTags = [...getFilteredByTags(), tag];

  cleanAndGetPosts(getFilteredByUserId(), newTags);
}

function removeTagFilter(e) {
  e.preventDefault();
  const { tag } = e.target.dataset;
  const newTags = getFilteredByTags().filter((t) => t !== tag);

  cleanAndGetPosts(getFilteredByUserId(), newTags);
}

function setUserIdFilter(e) {
  e.preventDefault();

  cleanAndGetPosts(e.target.dataset.userId, getFilteredByTags());
}

function resetUserIdFilter(e) {
  e.preventDefault();

  cleanAndGetPosts(null, getFilteredByTags());
}

function getFilteredByTags() {
  const tagElements = [...document.querySelectorAll(".message [data-tag]")];
  return tagElements.map((t) => t.dataset.tag);
}

function getFilteredByUserId() {
  const userIdElement = document.querySelector(".message [data-user-id]");
  if (userIdElement === null) {
    return undefined;
  }

  return userIdElement.dataset.userId;
}

function getCurrentPage() {
  const nextPageElement = document.querySelector(".posts [data-next-page]");
  if (nextPageElement === null) {
    return 0;
  }

  return parseInt(nextPageElement.dataset.nextPage) - 1;
}

function getNumberOfPosts() {
  return [...document.querySelectorAll(".post")].length;
}

async function cleanAndGetPosts(userId, tags) {
  const currentPage = getCurrentPage();
  document.querySelector(".posts").innerHTML = "";

  for (let p = 0; p <= currentPage; p++) {
    if (getNumberOfPosts() === 0) {
      await getPosts(p, userId, tags);
    }
  }
}

export {
  getFilteredByTags,
  getFilteredByUserId,
  getCurrentPage,
  getNumberOfPosts,
};
