import ArrayUtil from '../../../src/utils/array';

describe('toMatrix', () => {
  test('simple', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(ArrayUtil.toMatrix(src, 3)).toEqual(result);
  });
});
