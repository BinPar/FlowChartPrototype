const getMaxDepth = ({ child, options }) => {
  let max = 0;
  if (options) {
    options.forEach((option) => {
      const newMax = getMaxDepth(option);
      if (newMax > max) {
        max = newMax;
      }
    });
  }
  if (child) {
    max += 1;
    max += getMaxDepth(child);
  }
  return max;
};

const getMaxWidth = (child, options) => {
  let total = 1;
  if (options && options.length) {
    total -= 2;
    options.forEach((option) => {
      total += getMaxWidth(option.child, option.options);
    });
  }
  if (child) {
    total += getMaxWidth(child.child, child.options) - 1;
  }
  return total;
};


const getTotalWidth = (child, options) => {
  let total = 1;
  if (options && options.length) {
    total -= 1;
    options.forEach((option) => {
      total += getMaxWidth(option.child, option.options);
    });
  }
  if (child) {
    total += getTotalWidth(child.child, child.options) - 1;
  }
  return total;
};

export default {
  getMaxDepth,
  getMaxWidth,
  getTotalWidth,
};
