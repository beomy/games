import ObjectUtil from '@/utils/object';

describe('isEmpty', () => {
  test('null', () => {
    expect(ObjectUtil.isEmpty(null)).toEqual(true);
  });
  test('undefined', () => {
    expect(ObjectUtil.isEmpty(undefined)).toEqual(true);
  });
  test('empty object', () => {
    expect(ObjectUtil.isEmpty({})).toEqual(true);
  });
  test('not empty object', () => {
    expect(ObjectUtil.isEmpty({t: 1})).toEqual(false);
  });
});

describe('isUndef', () => {
  test('null', () => {
    expect(ObjectUtil.isUndef(null)).toEqual(true);
  });
  test('undefined', () => {
    expect(ObjectUtil.isUndef(undefined)).toEqual(true);
  });
  test('object', () => {
    expect(ObjectUtil.isUndef({})).toEqual(false);
  });
});

describe('enumToArray', () => {
  enum Difficulty {
    EASY = 43,
    NORMAL = 50,
    HARD = 55,
  };

  test('null', () => {
    expect(ObjectUtil.enumToArray(Difficulty)).toEqual([
      { id: 43, value: 'EASY' },
      { id: 50, value: 'NORMAL' },
      { id: 55, value: 'HARD' },
    ]);
  });
});
