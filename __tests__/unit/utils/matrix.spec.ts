import MatrixUtil from '@/utils/matrix';

describe('multiply', () => {
  test('simple', () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const result = [
      [30, 36, 42],
      [66, 81, 96],
      [102, 126, 150],
    ]
    expect(MatrixUtil.multiply(a, a)).toEqual(result);
  });
  test('identity matrix', () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const b = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    expect(MatrixUtil.multiply(a, b)).toEqual(a);
  });
});
