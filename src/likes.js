function getLikedPosts() {
  return JSON.parse(localStorage.getItem("likedPosts") || "[]");
}

function setLikedPosts(posts) {
  localStorage.setItem("likedPosts", JSON.stringify(posts));
}

function likePost(postId) {
  const likedPosts = getLikedPosts();
  likedPosts.push(postId);
  setLikedPosts([...new Set(likedPosts)]);

  handleLikeButton(postId, "like");
}

function unlikePost(postId) {
  let likedPosts = getLikedPosts();
  likedPosts = likedPosts.filter((id) => id !== postId);
  setLikedPosts(likedPosts);

  handleLikeButton(postId, "unlike");
}

function isPostLiked(postId) {
  const likedPosts = getLikedPosts();
  return likedPosts.includes(postId);
}

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || "";

function handleLikeButton(postId, action) {
  const isLike = action === "like";
  const antiAction = isLike ? "unlike" : "like";

  const likeButtonSelector = `[data-action="${action}-post"][data-post-id="${postId}"]`;
  const likeButtonElement = document.querySelector(likeButtonSelector);
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

export { likePost, unlikePost, isPostLiked };
