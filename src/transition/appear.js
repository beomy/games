export default function appear (node, {
  delay = 0,
  duration = 400,
}) {
  return {
    delay,
    duration,
    css: (t) => {
      const style = getComputedStyle(node);
      const o = +style.opacity;
      return `
        transform: scale(${t * o});
        opacity: ${t * o};
      `
    }
  }
}
