export function getRandomNumber() {
  return Math.round(Math.random() * 400);
}

export function debounce(func, timeout = 50) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, timeout);
  };
}
