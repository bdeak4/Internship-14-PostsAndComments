import { collapseComments, getComments } from "./comments.js";
import { startLoading, stopLoading } from "./loading.js";
import {
  getApiResponse,
  isElementVisible,
  printObjectMetadata,
} from "./utility.js";

async function getPosts(page) {
  startLoading(".loading--posts");

  const posts = await getApiResponse(`/post?page=${page}`);
  console.log(posts);

  posts.data.forEach((post, i) => {
    let attributes = "";
    if (i + 1 === posts.data.length) {
      attributes += ` data-action="load-more" data-next-page="${page + 1}"`;
    }

    document.querySelector(".posts").innerHTML += printPost(post, attributes);
  });

  stopLoading(".loading--posts");
}

function printPost(post, attributes) {
  return `
<div class="post" ${attributes}>
  <div class="post__header">
    <img src="${post.image}" alt="" class="post__image">
    <div class="post__header__text">
      <h2 class="post__title">${post.text}</h2>
      ${printObjectMetadata(post)}
      <div class="post__tags">
        ${post.tags
          .map((tag) => `<div class="post__tag">${tag}</div>`)
          .join("")}
      </div>
      <div class="post__button-container">
        <button type="button" class="button button--like"
          data-action="like-post" data-post-id="${post.id}">
          <span class="like-count">${post.likes}</span>
          &uarr;Like
        </button>
        <button type="button" class="button button--expand"
          data-action="show-comments" data-post-id="${post.id}">
          <div class="line">
            <div class="line__left"></div>
            <div class="line__right"></div>
          </div>
          <div class="line">
            <div class="line__left"></div>
            <div class="line__right"></div>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div class="post__comments hidden" data-post-id="${post.id}">
  </div>
  <div class="loading loading--comments hidden">
    Loading<span class="dots"></span>
  </div>
</div>
  `;
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

document.querySelector(".posts").addEventListener("click", function (e) {
  if (!e.target.dataset.action) {
    e.target.parentElement.click();
    return;
  }

  switch (e.target.dataset.action) {
    case "show-comments":
      getComments(e.target.dataset.postId);
      break;

    case "hide-comments":
      collapseComments(e.target.dataset.postId);
      break;
  }
});

export { getPosts };
