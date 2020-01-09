export function getStorage (field = '2048Game') {
  return JSON.parse(localStorage.getItem(field)) || { results: [], score: [], best: 0 };
}

export function setStorage (field = '2048Game', data) {
  localStorage.setItem(field, JSON.stringify(data));
}
