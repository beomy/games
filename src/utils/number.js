export function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function ratioRandom (values, ratios) {
  const list = []
  for (let i = 0; i < ratios.length; i++) {
    const ratio = ratios[i]
    const value = values[i]
    for (let j = 0; j < ratio; j++) {
      list.push(value)
    }
  }
  console.log(list)
  return list[random(0, list.length - 1)]
}