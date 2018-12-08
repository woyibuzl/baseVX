import {
  proxies,
  isObj,
  tailspin,
  getTag,
} from './utils'

let stores = {}

export default class BaseVX {
  constructor (...args) {
    this
      ._resetState(...args)
      ._init()
  }

  static use (c) {
    this._vuex = c
  }

  static add (key, fn) {
    proxies.custom[key] = fn
    return this
  }

  static only (obj = {}, keys) {
    if (typeof keys === 'string') keys = keys.split(/ +/)
    return keys.reduce((ret, key) => {
      if (obj[key] == null) return ret
      ret[key] = obj[key]
      return ret
    }, {})
  }

  static singleton (...args) {
    return this.instance && this.instance._resetState(...args) || (this.instance = new BaseVX(...args))
  }

  static Store  (data = {}) {
    if (data.mutations) data.mutations = {}
    Object.assign(data.mutations, { [BaseVX.defaults.interiorKey]: mutation })

    stores = new BaseVX._vuex.Store(data)
    return stores
  }

  chain (b = true) {
    this.options.chain = b
    return this
  }

  commit () {
    stores.commit(BaseVX.defaults.interiorKey, [this.options._chainCallData, this.options])
    return this
  }

  _commit (method, values) {
    this.options._chainCallData.push({
      method,
      values
    })
    if (!this.options.chain) this.commit()
    return this
  }

  _resetState (...args ) {
    const [path, options = {}] = args
    this.options = {
      path,
      chain: options.chain || BaseVX.defaults.chain || false,
      _chainCallData: []
    }
    return this
  }

  _init () {
    for (let name in proxies) {
      const keys =  proxies[name]
      Object.keys(keys).forEach(method => BaseVX.prototype[method] = function (...values) {
        this._commit(keys[method], values)
        return this
      })
    }
    return this
  }
}

BaseVX.defaults = {
  interiorKey: '__BaseVX__Mutation__',
  chain: false
}

export let vx = function (...args) {
  return BaseVX.singleton(...args)
}

function mutation(state, payload) {
  const [data, options] = payload
  const {path} = options
  data.forEach(({method, values}) => {
    tailspin(state, path, function (o, key)  {
      if (['keys', 'values', 'entries'].includes(method)) {
        if (isObj(o[key])) o[key] = Object[method](o[key])
        return
      }
      const tag = getTag(method)
      // if (tag === 'custom') {
      //   // 自定义方法
      //   // 为了区分 mutator 和 accessor
      //   // 在调用自定义方法之前，先保存一份目标数据的副本
      //   // 调用之后进行对比
      //   const _targetData = JSON.stringify(o[key])
      //   const data = method(o, key, ...values)
      //   console.log(_targetData, JSON.stringify(o[key]), data)
      //   if (_targetData === JSON.stringify(o[key]) && data) o[key] = data
      //   return
      // }

      switch (tag) {
        case 'mutator':
          o[key][method](...values)
          break
        case 'accessor':
          o[key] = o[key][method](...values)
          break
        case 'custom':
          method(o, key, ...values)
      }
    })
  })
}


// export const {
//   reateNamespacedHelpers,
//   mapActions,
//   mapGetters,
//   mapMutations,
//   mapState,
//   install
// } = BaseVX.only(BaseVX._vuex, 'reateNamespacedHelpers mapActions mapActions mapGetters mapMutations mapState install')

export const version = '0.0.1'
