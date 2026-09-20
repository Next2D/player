// Serialized filter parameters consumed by the real renderer usecases.
const displacement = mode => {
    const bitmap = Array.from({ length: 15 * 11 * 4 }, (_, i) => (i * 29 + 71) % 256);
    return [4, bitmap.length, ...bitmap, 15, 11, 2, -1, 1, 2, 4, 3, mode, 0x336699, 0.6];
};
const color = [2, 0.8, 0.1, 0, 0, 12, 0, 0.9, 0.1, 0, 3, 0.1, 0, 0.7, 0, 5, 0, 0, 0, 0.8, 0];
const gradient = type => [type, 2, 35, 3, 0, 0x4499ff, 0xffffff,
    3, 0, 0.7, 1, 3, 0, 128, 255, 3, 4, 1, 1, 2, 0];
export const extendedFilterBatches = [
    [color, [3, 3, 3, 0, -1, 0, -1, 5, -1, 0, -1, 0, 1, 3, 1, 1, 0, 0],
        [0, 2, 35, 0xffffff, 0.8, 0x003366, 0.6, 3, 4, 1, 1, 0, 0]],
    [gradient(7), gradient(8), displacement(0)],
    [[3, 5, 3, ...Array(15).fill(1), 15, 0, 0, 0, 0x446688, 0.4], displacement(1), displacement(2)],
    [displacement(3), color, [0, 3, 55, 0xffcc99, 0.7, 0x004466, 0.8, 4, 3, 2, 1, 2, 1]]
];
