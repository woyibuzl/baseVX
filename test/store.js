import Vuex from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
import baseVX from '../dist/base-vx.es.min'
const {add, only} = baseVX

Vue.use(Vuex)
baseVX.use(Vuex)

Object.entries(
  only(_, 'difference compact')
).forEach(([name, fn]) => add(name, function (o, key, ...values) {
  o[key] = fn(o[key], ...values)
}))


add('increaseAll', function (o, key, n = 1) {
  o[key] = o[key].map(e => e + n)
})

let store =  baseVX.Store({
  state: {
    tailspin: {
      a: {
        b: [1, 2, {
          c: 1
        }]
      }
    },
    chainCount: {
      a: 1,
      b: 2
    },

    name: 'sunny',

    keys: {
      a: 1,
      b: 2
    },
    values: {
      a: 1,
      b: 2
    },
    entries: {
      a: 1,
      b: 2
    },
    custom: {
      set: [1, 2],
      del: [1, 2],
      increase: 1,
      decrease: 1,
      toggleArr: [1, 2, 3],
      toggleBool: false,
      each: {
        a: 1,
        b: 2
      },
      q: {
        a: 1,
        b: 2
      },
    },
    difference: [1, 2, 3],
    compact: [false, '', 1],
    increaseAll: [1, 2, 3],
  },
  mutations: {

  },
  actions: {

  }
})

export default store