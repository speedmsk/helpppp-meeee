
export const mapOrder = (array, order, key) => {
    if (!array || !order) return [];  // Return an empty array if input is invalid

    array.sort((a, b) => {
        const indexA = order.indexOf(a[key]);
        const indexB = order.indexOf(b[key]);
        return indexA - indexB;
    });
    return array;
};
