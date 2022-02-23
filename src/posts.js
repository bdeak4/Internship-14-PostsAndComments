import { apiAppId } from "./index.js";
import { startLoading, stopLoading } from "./loading.js";
import { isElementVisible } from "./utility.js";

async function getPosts(page) {
  startLoading(".loading--posts");

  const response = await fetch(
    `https://dummyapi.io/data/v1/post?page=${page}`,
    {
      headers: {
        "app-id": apiAppId,
      },
    }
  );
  const json = await response.json();
  console.log(json);

  json.data.forEach((post, i) => {
    let attributes = "";
    if (i + 1 === json.data.length) {
      attributes += ` data-action="load-more" data-next-page="${page + 1}"`;
    }

    document.querySelector(".posts").innerHTML += `
    <div class="post" ${attributes}>
      <div class="post__header">
        <img src="${post.image}" alt="" width="200" height="200" class="post__image">
        <div class="post__header__text">
          <h2 class="post__title">${post.text}</h2>
          <p>${post.likes} ${post.owner.firstName} ${post.owner.lastName}</p>
        </div>
      <div>
    </div>
    `;
  });

  stopLoading(".loading--posts");
}

let loadMoreTimer;

document.addEventListener("scroll", () => {
  clearTimeout(loadMoreTimer);
  loadMoreTimer = setTimeout(() => {
    if (!isElementVisible('[data-action="load-more"]')) {
      return;
    }

    const element = document.querySelector('[data-action="load-more"]');
    const nextPage = parseInt(element.dataset.nextPage);

    delete element.dataset.action;
    delete element.dataset.nextPage;

    getPosts(nextPage);
  }, 100);
});

export { getPosts };
