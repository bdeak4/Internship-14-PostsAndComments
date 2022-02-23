import { getPosts } from "./posts.js";
// document.getElementById("links-public").classList.add("hidden");
// document.getElementById("links-private").classList.remove("hidden");

// setInterval(() => {
//   document.querySelector(".loading .dots").innerHTML += ".";
// }, 50);

// (async () => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// })();

const apiAppId = "62156393c84e133f4e16756c";
export { apiAppId };

getPosts(0);
