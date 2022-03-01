import { getPosts } from "./posts.js";
import { switchNavigationIfLoggedIn } from "./navigation.js";
import "./users.js";

getPosts();
switchNavigationIfLoggedIn();
