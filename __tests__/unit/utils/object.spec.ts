import ObjectUtil from '@/utils/object';

describe('IsEmpty', () => {
  test('null', () => {
    expect(ObjectUtil.IsEmpty(null)).toEqual(true);
  });
  test('undefined', () => {
    expect(ObjectUtil.IsEmpty(undefined)).toEqual(true);
  });
  test('empty object', () => {
    expect(ObjectUtil.IsEmpty({})).toEqual(true);
  });
  test('not empty object', () => {
    expect(ObjectUtil.IsEmpty({t: 1})).toEqual(false);
  });
});

describe('IsUndef', () => {
  test('null', () => {
    expect(ObjectUtil.IsUndef(null)).toEqual(true);
  });
  test('undefined', () => {
    expect(ObjectUtil.IsUndef(undefined)).toEqual(true);
  });
  test('object', () => {
    expect(ObjectUtil.IsUndef({})).toEqual(false);
  });
});

describe('EnumToArray', () => {
  enum Difficulty {
    EASY = 43,
    NORMAL = 50,
    HARD = 55,
  };

  test('null', () => {
    expect(ObjectUtil.EnumToArray(Difficulty)).toEqual([
      { id: 43, value: 'EASY' },
      { id: 50, value: 'NORMAL' },
      { id: 55, value: 'HARD' },
    ]);
  });
});
