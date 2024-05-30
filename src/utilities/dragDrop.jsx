export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (!Array.isArray(arr)) {
    throw new Error("The first argument to applyDrag must be an array.");
  }
  if (removedIndex === null && addedIndex === null) return arr;

  console.log("Payload:", payload);

  if (!payload) {
    console.error('Payload is undefined in applyDrag function');
    return arr;
  }

  let result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
  }

  return result.filter(item => item !== undefined);
};
