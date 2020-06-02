import DateUtil from '@/utils/date';

describe('msToStr', () => {
  const sec = 1000
  const min = sec * 60
  const hour = min * 60
  const day = hour * 24
  const year = day * 365

  it('year', () => {
    expect(DateUtil.msToStr(year)).toEqual('1년 0일 0시간 0분 0초')
  })
  it('day', () => {
    expect(DateUtil.msToStr(day)).toEqual('1일 0시간 0분 0초')
  })
  it('hour', () => {
    expect(DateUtil.msToStr(hour)).toEqual('1시간 0분 0초')
  })
  it('min', () => {
    expect(DateUtil.msToStr(min)).toEqual('1분 0초')
  })
  it('sec', () => {
    expect(DateUtil.msToStr(sec)).toEqual('1초')
  })
  it('min & sec', () => {
    expect(DateUtil.msToStr(min + sec)).toEqual('1분 1초')
  })
  it('hour & min & sec', () => {
    expect(DateUtil.msToStr(hour + min + sec)).toEqual('1시간 1분 1초')
  })
  it('day & hour & min & sec', () => {
    expect(DateUtil.msToStr(day + hour + min + sec)).toEqual('1일 1시간 1분 1초')
  })
  it('year & day & hour & min & sec', () => {
    expect(DateUtil.msToStr(year + day + hour + min + sec)).toEqual('1년 1일 1시간 1분 1초')
  })
  it('hour & sec', () => {
    expect(DateUtil.msToStr(hour + sec)).toEqual('1시간 0분 1초')
  })
})
