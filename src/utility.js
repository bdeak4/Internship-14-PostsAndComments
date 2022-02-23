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

export { isElementVisible };
