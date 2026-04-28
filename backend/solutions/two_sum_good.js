const pairIdx = {};

for (let i = 0; i < array.length; i++) {
    const num = array[i];
    if (goal - num in pairIdx) {
        return [i, pairIdx[goal - num]];
    }
    pairIdx[num] = i;
}
return [];
