export default function appear (node: Element,
  { delay = 0, duration = 400 }: AppearTrasnsitionOption)
{
  return {
    delay,
    duration,
    css: (t: number) => {
      const style: CSSStyleDeclaration = getComputedStyle(node);
      const o: number = +style.opacity;
      return `
        transform: scale(${t * o});
        opacity: ${t * o};
      `
    }
  }
};
