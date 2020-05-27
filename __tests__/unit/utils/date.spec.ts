import DateUtil from '@/utils/date';

describe('MsToStr', () => {
  const sec = 1000
  const min = sec * 60
  const hour = min * 60
  const day = hour * 24
  const year = day * 365

  it('year', () => {
    expect(DateUtil.MsToStr(year)).toEqual('1년 0일 0시간 0분 0초')
  })
  it('day', () => {
    expect(DateUtil.MsToStr(day)).toEqual('1일 0시간 0분 0초')
  })
  it('hour', () => {
    expect(DateUtil.MsToStr(hour)).toEqual('1시간 0분 0초')
  })
  it('min', () => {
    expect(DateUtil.MsToStr(min)).toEqual('1분 0초')
  })
  it('sec', () => {
    expect(DateUtil.MsToStr(sec)).toEqual('1초')
  })
  it('min & sec', () => {
    expect(DateUtil.MsToStr(min + sec)).toEqual('1분 1초')
  })
  it('hour & min & sec', () => {
    expect(DateUtil.MsToStr(hour + min + sec)).toEqual('1시간 1분 1초')
  })
  it('day & hour & min & sec', () => {
    expect(DateUtil.MsToStr(day + hour + min + sec)).toEqual('1일 1시간 1분 1초')
  })
  it('year & day & hour & min & sec', () => {
    expect(DateUtil.MsToStr(year + day + hour + min + sec)).toEqual('1년 1일 1시간 1분 1초')
  })
  it('hour & sec', () => {
    expect(DateUtil.MsToStr(hour + sec)).toEqual('1시간 0분 1초')
  })
})
