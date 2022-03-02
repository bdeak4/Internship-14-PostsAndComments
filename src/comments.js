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

  if (commentsElement.innerHTML !== "") {
    return;
  }

  comments.data.sort(
    (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
  );

  comments.data.forEach((comment) => {
    const canModify =
      commentsElement.dataset.userId !== "" &&
      commentsElement.dataset.userId === comment.owner.id;

    commentsElement.innerHTML += `
    <div class="post__comment" data-comment-id="${comment.id}">
      ${printObjectMetadata(comment)}
      <div class="post__comment__body">
        ${comment.message}
      </div>
      ${
        canModify
          ? `
            <div>
              <a href="#" data-action="edit-comment"
                data-comment-id="${comment.id}">Edit</a>

              <a href="#" data-action="delete-comment"
                data-comment-id="${comment.id}">Delete</a>
            </div>`
          : ""
      }
    </div>
    `;
  });

  if (comments.total === 0) {
    commentsElement.innerHTML = "<p>nema komentara :/</p>";
  }

  if (commentsElement.dataset.userId !== "") {
    commentsElement.innerHTML += `
    <form class="post__comment-form" data-post-id="${postId}"
      data-user-id="${commentsElement.dataset.userId}">
      <input type="text" name="message" placeholder="Write comment"
        class="form__input" minlength="2" maxlength="500" required />
      <button type="submit" class="button">Submit</button>
    </form>
    `;
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

document.addEventListener("submit", async function (e) {
  if (!e.target.classList.contains("post__comment-form")) {
    return;
  }

  e.preventDefault();
  const postId = e.target.dataset.postId;
  const userId = e.target.dataset.userId;
  const message = e.target.querySelector("[name=message]").value;

  await getApiResponse(
    "/comment/create",
    "POST",
    {
      "Content-Type": "application/json",
    },
    {
      message: message,
      owner: userId,
      post: postId,
    }
  );

  collapseComments(postId);
  await getComments(postId);
});

async function deleteComment(commentId) {
  await getApiResponse(`/comment/${commentId}`, "DELETE");
  document
    .querySelector(`.post__comment[data-comment-id="${commentId}"]`)
    .remove();
}

export { getComments, collapseComments, deleteComment };
