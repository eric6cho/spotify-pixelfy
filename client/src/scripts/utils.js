
export const fetchGet = async (url) => new Promise (resolve =>
  fetch(url).then(res => res.json()).then(data => resolve(data)));
