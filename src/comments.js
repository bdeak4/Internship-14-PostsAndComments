import { startLoading, stopLoading } from "./loading.js";
import { getApiResponse, printObjectMetadata } from "./utility.js";

function toggleExpandButton(postId) {
  const expandButtonSelector = `[data-action$="-comments"][data-post-id="${postId}"]`;
  const expandButtonElement = document.querySelector(expandButtonSelector);

  expandButtonElement.classList.toggle("button--expanded");

  expandButtonElement.dataset.action =
    expandButtonElement.dataset.action === "show-comments"
      ? "hide-comments"
      : "show-comments";
}

async function getComments(postId) {
  const commentsSelector = `.post__comments[data-post-id="${postId}"]`;
  const commentsElement = document.querySelector(commentsSelector);
  if (commentsElement === null) {
    return;
  }

  commentsElement.innerHTML = "";

  startLoading(`${commentsSelector} ~ .loading--comments`);

  toggleExpandButton(postId);

  commentsElement.classList.remove("hidden");

  const comments = await getApiResponse(`/post/${postId}/comment`);

  comments.data.forEach((comment) => {
    commentsElement.innerHTML += `
    <div class="post__comment">
      ${printObjectMetadata(comment)}
      <div>
        ${comment.message}
      </div>
    </div>
    `;
  });

  if (comments.total === 0) {
    commentsElement.innerHTML = "nema komentara :/";
  }

  stopLoading(`${commentsSelector} ~ .loading--comments`);
}

function collapseComments(postId) {
  const commentsSelector = `.post__comments[data-post-id="${postId}"]`;
  const commentsElement = document.querySelector(commentsSelector);
  if (commentsElement === null) {
    return;
  }

  toggleExpandButton(postId);

  commentsElement.classList.add("hidden");

  stopLoading(`${commentsSelector} ~ .loading--comments`);
}

export { getComments, collapseComments };
