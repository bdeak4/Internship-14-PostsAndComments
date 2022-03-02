import { getCurrentUser } from "./auth.js";

function getLikedPosts(currentUserId) {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");

  if (currentUserId in likedPosts) {
    return likedPosts[currentUserId];
  }
  return [];
}

function setLikedPosts(currentUserId, posts) {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
  const newLikedPosts = {
    ...likedPosts,
    [currentUserId]: posts,
  };

  localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
}

async function likePost(postId) {
  const user = await getCurrentUser();
  const likedPosts = getLikedPosts(user.id);
  likedPosts.push(postId);

  setLikedPosts(user.id, [...new Set(likedPosts)]);

  handleLikeButton(postId, "like");
}

async function unlikePost(postId) {
  const user = await getCurrentUser();
  let likedPosts = getLikedPosts(user.id);
  likedPosts = likedPosts.filter((id) => id !== postId);

  setLikedPosts(user.id, likedPosts);

  handleLikeButton(postId, "unlike");
}

function isPostLiked(currentUserId, postId) {
  const likedPosts = getLikedPosts(currentUserId);
  return likedPosts.includes(postId);
}

function handleLikeButton(postId, action) {
  const isLike = action === "like";
  const antiAction = isLike ? "unlike" : "like";

  const likeButtonSelector = `[data-action="${action}-post"][data-post-id="${postId}"]`;
  const likeButtonElement = document.querySelector(likeButtonSelector);

  if (likeButtonElement === null) {
    return;
  }

  likeButtonElement.dataset.action = `${antiAction}-post`;

  const likeText = "↑Like";
  const unlikeText = "↓Unlike";

  likeButtonElement.innerHTML = likeButtonElement.innerHTML.replace(
    isLike ? likeText : unlikeText,
    !isLike ? likeText : unlikeText
  );

  const likeCount = likeButtonElement.querySelector(".like-count");
  likeCount.innerHTML = parseInt(likeCount.innerHTML) + (isLike ? 1 : -1);
}

function countLocalLikes(postId) {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
  const likedIds = Object.values(likedPosts).flat();
  return likedIds.filter((id) => id === postId).length;
}

export { likePost, unlikePost, isPostLiked, countLocalLikes };
