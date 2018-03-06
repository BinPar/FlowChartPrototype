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
  if (options && options.length > 1) {
    total -= 1;
    options.forEach((option) => {
      total += getMaxWidth(option.child, option.options);
    });
  }
  if (child) {
    total += getMaxWidth(child.child, child.options) - 1;
  }
  return total === 3 ? 1 : total;
};

const getAllLeavesFromNode = (node, list, first = false) => {
  if (node.child && !first) {
    getAllLeavesFromNode(node.child, list);
  } else if (node.options) {
    node.options.forEach((option) => {
      if (option.child) {
        getAllLeavesFromNode(option.child, list);
      } else {
        list.push(option);
      }
    });
  } else if (!first) {
    list.push(node);
  }
  return list;
};

const findRecursiveParentChild = (node) => {
  if (node.options && node.child) {
    return node.child;
  }
  return findRecursiveParentChild(node.parents[0]);
};
const recalculateParentNodes = (flowData, parents) => {
  const node = flowData;
  node.parents = parents ? [...parents] : [];
  if (node.options) {
    node.options = node.options.map((option) => {
      const newOption = { ...option };
      newOption.parents = [node];
      if (newOption.child) {
        newOption.child = recalculateParentNodes(newOption.child, [newOption]);
      } else if (node.child) {
        newOption.childRef = node.child;
      } else {
        newOption.childRef = findRecursiveParentChild(node);
      }
      return newOption;
    });
    if (node.child) {
      node.child = recalculateParentNodes(node.child, getAllLeavesFromNode(node, [], true));
    }
  } else if (node.child) {
    node.child = recalculateParentNodes(node.child, [node]);
  }
  return node;
};

let newFocusNode = null;

const deselectRec = (flowData, node) => {
  const res = flowData;
  if (res.active) {
    res.oldActive = true;
  } else {
    delete res.oldActive;
  }
  delete res.active;
  delete res.focused;
  if (res.options) {
    res.options = res.options.map(option => deselectRec(option, node));
  }
  if (res.child) {
    res.child = deselectRec(res.child, node);
  }
  if (flowData === node) {
    res.focused = true;
    newFocusNode = res;
  }
  return res;
};
const wasActive = (node) => {
  if (node.oldActive) return 1;
  else if (node.parents && node.parents.length === 1 && !node.parents[0].options) {
    return wasActive(node.parents[0]);
  }
  return 0;
};
const selectNodeRec = (node) => {
  const ref = node;
  ref.active = true;
  if (node.parents.length === 1) {
    selectNodeRec(node.parents[0]);
  } else if (node.parents.length) {
    const parents = [...node.parents];
    parents.sort((a, b) => (wasActive(a) < wasActive(b) ? 1 : -1));
    selectNodeRec(parents[0]);
  }
};

const selectNode = (flowData, node) => {
  newFocusNode = null;
  const newFlow = deselectRec(flowData, node);
  if (newFocusNode) {
    selectNodeRec(newFocusNode);
  }
  return newFlow;
};

export default {
  getMaxDepth,
  getMaxWidth,
  recalculateParentNodes,
  selectNode,
};
