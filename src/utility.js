import { appId } from "./config.js";

function isElementVisible(selector) {
  const element = document.querySelector(selector);
  if (element === null) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );

  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

async function getApiResponse(path, method, headers, body) {
  const response = await fetch(`https://dummyapi.io/data/v1${path}`, {
    method: method || "GET",
    headers: {
      "app-id": appId,
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });
  const json = await response.json();
  return json;
}

function printObjectMetadata(object) {
  const date = new Date(object.publishDate);
  return `
  <div class="metadata">
    ${date.toLocaleString()}
    <div class="metadata__separator">~</div>
    ${printOwner(object.owner)}
  </div>
  `;
}

function printOwner(owner) {
  return `
  <div class="owner">
    <img src="${owner.picture}" alt="" class="owner__image">
    <a href="#" data-action="show-user" data-user-id="${owner.id}" class="owner__name">
      ${owner.firstName} ${owner.lastName}
    </a>
  </div>
  `;
}

export { isElementVisible, getApiResponse, printObjectMetadata, printOwner };
