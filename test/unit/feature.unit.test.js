import { expect } from 'chai'
import store from '../store'
import { vx } from '../../dist/base-vx.es.min'

describe('feature', () => {
  it('#字符串路径', () => {
    vx('tailspin.a.b[2].c').set(2)
    expect(store.state.tailspin).deep.equal({a: {b: [1, 2, {c: 2}]}})
  })

  // 你可以在全局、实例和当前调用链三个层级上开启手动提交
  // 手动执行 commit() 方法，让整条链合并成一个 mutations
  it('#手动提交 ☞ 让整条链合并成一个 mutations', () => {
    vx('chainCount').chain().values().push(2).commit()
    expect(store.state.chainCount).deep.equal([ 1, 2, 2 ])

    vx('chainCount', {chain: true}).values().push(2).commit()
    expect(store.state.chainCount).deep.equal([ 1, 2, 2, 2])
  })

  it('#第三方库扩展', () => {
    vx('difference').difference([2, 3, 4, 5])
    expect(store.state.difference).deep.equal([ 1])

    vx('compact').compact()
    expect(store.state.compact).deep.equal([1])
  })

  it('#自定义方法扩展', () => {
    vx('increaseAll').increaseAll()
    expect(store.state.increaseAll).deep.equal([2, 3, 4])
  })
})


