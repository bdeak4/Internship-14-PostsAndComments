import { collapseComments, getComments } from "./comments.js";
import { startLoading, stopLoading } from "./loading.js";
import {
  getApiResponse,
  isElementVisible,
  printObjectMetadata,
} from "./utility.js";

async function getPosts(page, userId, tags) {
  startLoading(".loading--posts");

  const posts = await getApiResponse(
    userId ? `/user/${userId}/post?page=${page}` : `/post?page=${page}`
  );

  if (tags && tags.length > 0) {
    posts.data = posts.data.filter((p) =>
      tags.every((t) => p.tags.includes(t))
    );
  }

  posts.data.forEach((post, i) => {
    let attributes = [];
    if (i + 1 === posts.data.length) {
      attributes.push(`data-action="load-more"`);
      attributes.push(`data-next-page="${page + 1}"`);

      if (userId) {
        attributes.push(`data-user-id="${userId}"`);
      }

      if (tags && tags.length > 0) {
        attributes.push(`data-tags="${tags.join(",")}"`);
      }
    }

    document.querySelector(".posts").innerHTML += printPost(post, attributes);
  });

  if (posts.data.length === 0) {
    const message = `<p>nema ${page > 0 ? "više " : ""} rezultata :/</p>`;
    document.querySelector(".posts").innerHTML += message;
  }

  stopLoading(".loading--posts");
}

function printPost(post, attributes) {
  return `
<div class="post" ${attributes.join(" ")}>
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

    let userId;
    if (element.dataset.userId) {
      userId = element.dataset.userId;
      delete element.dataset.userId;
    }

    let tags;
    if (element.dataset.tags) {
      tags = element.dataset.tags.split(",");
      delete element.dataset.tags;
    }

    getPosts(nextPage, userId, tags);
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
