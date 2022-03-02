import { getCurrentUser } from "./auth.js";
import { collapseComments, getComments } from "./comments.js";
import { countLocalLikes, isPostLiked, likePost, unlikePost } from "./likes.js";
import { startLoading, stopLoading } from "./loading.js";
import { getFilteredByTags } from "./postFilters.js";
import {
  getApiResponse,
  isElementVisible,
  printObjectMetadata,
} from "./utility.js";

async function getPosts(page = 0, userId, tags) {
  startLoading(".loading--posts");
  await setMessage(userId, tags);

  const posts = await getApiResponse(
    userId ? `/user/${userId}/post?page=${page}` : `/post?page=${page}`
  );

  const hasTags = tags && tags.length > 0;

  if (hasTags) {
    posts.data = posts.data.filter((p) =>
      tags.every((t) => p.tags.includes(t))
    );
  }

  const currentUser = await getCurrentUser();

  posts.data.forEach((post, i) => {
    let attributes = [];
    if (i + 1 === posts.data.length) {
      attributes.push(`data-action="load-more"`);
      attributes.push(`data-next-page="${page + 1}"`);

      if (userId) {
        attributes.push(`data-user-id="${userId}"`);
      }

      if (hasTags) {
        attributes.push(`data-tags="${tags.join(",")}"`);
      }
    }

    const postHTML = printPost(post, attributes, currentUser);
    document.querySelector(".posts").innerHTML += postHTML;
  });

  stopLoading(".loading--posts");

  if (isElementVisible('[data-action="load-more"]')) {
    loadMore();
  }
}

function printPost(post, attributes, currentUser) {
  const isPostedByCurrentUser =
    currentUser !== null && post.owner.id === currentUser.id;
  const canLike = currentUser !== null && !isPostedByCurrentUser;
  const isLiked = canLike ? isPostLiked(currentUser.id, post.id) : false;

  return `
<div class="post" data-post-id="${post.id}" ${attributes.join(" ")}>
  <div class="post__header">
    <img src="${post.image}" alt="" class="post__image">
    <div class="post__header__text">
      <h2 class="post__title">${post.text}</h2>
      ${printObjectMetadata(post)}
      <div class="post__tags">
        ${post.tags
          .map((tag) => {
            const action = getFilteredByTags().includes(tag)
              ? "remove-tag-filter"
              : "add-tag-filter";

            return `<div class="post__tag" data-action="${action}" data-tag="${tag}">
                      ${tag}
                    </div>`;
          })
          .join("")}
      </div>
      <div class="post__button-container">
        <button type="button" class="button button--like"
          data-action="${!isLiked ? "like-post" : "unlike-post"}"
          data-post-id="${post.id}" ${!canLike ? "disabled" : ""}>
          <span class="like-count">
            ${post.likes + countLocalLikes(post.id)}
          </span>
          ${isLiked ? "&darr;Unlike" : "&uarr;Like"}
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
        ${
          isPostedByCurrentUser
            ? `<button type="button" class="button"
                data-action="delete-post" data-post-id="${post.id}">
                Delete
              </button>`
            : ""
        }
      </div>
    </div>
  </div>
  <div class="post__comments hidden" data-post-id="${post.id}"
    data-user-id=${currentUser !== null ? currentUser.id : ""}>
  </div>
  <div class="loading loading--comments hidden">
    Loading<span class="dots"></span>
  </div>
</div>
  `;
}

async function setMessage(userId, tags) {
  let message = "";
  if (userId && tags && tags.length > 0) {
    message = `Postovi filtrirani po korisniku (${await printUser(userId)})
               i tagovima (${printTags(tags)})`;
  } else if (userId) {
    message = `Postovi filtrirani po korisniku (${await printUser(userId)})`;
  } else if (tags && tags.length > 0) {
    message = `Postovi filtrirani po tagovima (${printTags(tags)})`;
  }
  document.querySelector(".message").innerHTML = message;
}

async function printUser(userId) {
  const user = await getApiResponse(`/user/${userId}`);
  return `<a data-action="reset-user-filter" data-user-id="${userId}"
             href="#">${user.firstName} ${user.lastName}</a>`;
}

function printTags(tags) {
  return tags
    .map(
      (tag) =>
        `<a href="#" data-action="remove-tag-filter" data-tag="${tag}">${tag}</a>`
    )
    .join(", ");
}

let loadMoreTimer;

document.addEventListener("scroll", () => {
  clearTimeout(loadMoreTimer);
  loadMoreTimer = setTimeout(() => {
    if (!isElementVisible('[data-action="load-more"]')) {
      return;
    }

    loadMore();
  }, 100);
});

function loadMore() {
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
}

async function deletePost(postId) {
  await getApiResponse(`/post/${postId}`, "DELETE");
  document.querySelector(`.post[data-post-id="${postId}"]`).remove();
}

document.querySelector(".posts").addEventListener("click", function (e) {
  if (!e.target.dataset.action && e.target.parentElement) {
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

    case "like-post":
      likePost(e.target.dataset.postId);
      break;

    case "unlike-post":
      unlikePost(e.target.dataset.postId);
      break;

    case "delete-post":
      deletePost(e.target.dataset.postId);
      break;
  }
});

export { getPosts };
