import { expect } from 'chai'
import store from '../store'
import { vx } from '../../dist/base-vx.es.min'

describe('mutator', () => {
  // keys()，values()，entries() 仅对象有效，相当于 Object.keys()，Object.values()，Object.entries()
  it('#keys', () => {
    vx('keys').keys().push('c')
    expect(store.state.keys).deep.equal(['a', 'b', 'c'])
  })

  it('#values', () => {
    vx('values').values().push(3)
    expect(store.state.values).deep.equal([1, 2 , 3])
  })

  it('#entries', () => {
    vx('entries').entries()
    expect(store.state.entries).deep.equal([['a', 1], ['b', 2]])
  })
})



describe('custom', () => {
  it('#set', () => {
    vx('custom.set[0]').set(2)
    expect(store.state.custom.set).deep.equal([2, 2])
    vx('custom.set').set(2, 3)
    expect(store.state.custom.set).deep.equal([2, 2, 3])
  })

  it('#del', () => {
    vx('custom.del[1]').del()
    expect(store.state.custom.del).deep.equal([1])
    vx('custom.del').del(0)
    expect(store.state.custom.del).deep.equal([])
  })

  it('#decrease', () => {
    vx('custom.decrease').decrease()
    expect(store.state.custom.decrease).deep.equal(2)
    vx('custom.decrease').decrease(10)
    expect(store.state.custom.decrease).deep.equal(12)
  })

  it ('#increase', () => {
    vx('custom.increase').increase()
    expect(store.state.custom.increase).deep.equal(0)
    vx('custom.increase').increase(10)
    expect(store.state.custom.increase).deep.equal(-10)
  })

  it ('#toggle array', () => {
    vx('custom.toggleArr').toggle(4, 5)
    expect(store.state.custom.toggleArr).deep.equal([1, 2, 3, 4, 5])
    vx('custom.toggleArr').toggle(4, 5)
    expect(store.state.custom.toggleArr).deep.equal([1, 2, 3])
  })

  it ('#toggle boolean', () => {
    vx('custom.toggleBool').toggle()
    expect(store.state.custom.toggleBool).deep.equal(true)
    vx('custom.toggleBool').toggle()
    expect(store.state.custom.toggleBool).deep.equal(false)
  })

  it ('#each', () => {
    vx('custom.each').each((value, key, o) => o[key] = value + 1)
    expect(store.state.custom.each).deep.equal({a: 2, b: 3})
  })

  it ('#q ☞ this is quite method, do nothing', () => {
    vx('custom.q').q((value, key, o) => o[key] = 1)
    expect(store.state.custom.q).deep.equal(1)
  })
})

