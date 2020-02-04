export function getProductsFromCollection(config, url) {
  return config.collections
    .find(c => c.url === url)
    .products
    .map(id => config.products.find(p => p.stripe_id === id))
}

export function leaf(obj, path, value) {
  const pList = path.split('.');
  const key = pList.pop();
  const pointer = pList.reduce((accumulator, currentValue) => {
    if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
    return accumulator[currentValue];
  }, obj);
  pointer[key] = value;
  return obj;
}

export function getAspect(d) {
  // try to enforce some basic restraints
  if (d.width / d.height < .9) return "vertical";
  else if (d.width / d.height > 1.1) return "horizontal";
  else return "square";
}

export function URLize(txt) {
  return txt.toLowerCase().replace(/ /g, "-").replace(/[^a-zA-Z0-9-_]/g, '')
}

export function generateID(len) {
  // https://stackoverflow.com/a/10727155
  return Math.round((Math.pow(36, len) - Math.random() * Math.pow(36, len))).toString(36).slice(1)
}