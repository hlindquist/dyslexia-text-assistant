export const scrollToTarget = (parent: string, target: string) => {
  const targetSpan = document.querySelector(target) as HTMLElement;

  if (targetSpan) {
    const parentDiv = document.querySelector(parent) as HTMLElement;

    if (parentDiv) {
      const targetPosition = targetSpan.offsetTop;
      const parentHeight = parentDiv.offsetHeight;

      parentDiv.scrollTo({
        top: targetPosition - 16 * 1.25 * getLinesNumber(parentHeight),
        behavior: 'smooth',
      });
    }
  }
};

export const getLinesNumber = (height: number) => {
  const leftSide = height / 2;
  const rightSide = 16 * 1.25;

  const x = Math.ceil(leftSide / rightSide);

  return x;
};
