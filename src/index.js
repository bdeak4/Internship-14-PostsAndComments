// document.getElementById("links-public").classList.add("hidden");
// document.getElementById("links-private").classList.remove("hidden");

setInterval(() => {
  document.querySelector(".loading .dots").innerHTML += ".";
}, 50);

(async () => {
  try {
    const response = await fetch("https://dummyapi.io/data/v1/post", {
      headers: {
        "app-id": "62156393c84e133f4e16756c",
      },
    });
    const json = await response.json();
    console.log(json);

    json.data.forEach((post) => {
      document.querySelector(".posts").innerHTML += `
      <div class="post">
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
    document.querySelector(".loading").classList.add("hidden");
  } catch (error) {
    console.log(error);
  }
})();
