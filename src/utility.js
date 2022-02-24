import { apiAppId } from "./index.js";

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

async function getApiResponse(path, method, headers) {
  const response = await fetch(`https://dummyapi.io/data/v1${path}`, {
    method: method || "GET",
    headers: {
      "app-id": apiAppId,
      ...headers,
    },
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
    <img src="${object.owner.picture}" alt="" class="owner-image">
    <div class="object__owner">
    ${object.owner.firstName} ${object.owner.lastName}
    </div>
  </div>
  `;
}

export { isElementVisible, getApiResponse, printObjectMetadata };
