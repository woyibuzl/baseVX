import Vue from 'vue'
const {$set, $delete} = new Vue

export let proxies = {
  mutator: {
    'copyWithin': 'copyWithin',
    'fill': 'fill',
    'unshift': 'unshift',
    'shift': 'shift',
    'push': 'push',
    'pop': 'pop',
    'reverse': 'reverse',
    'sort': 'sort',
    'splice': 'splice'
  },

  accessor: {
    'includes': 'includes',
    'concat': 'concat',
    'join': 'join',
    'slice': 'slice',
    'indexOf': 'indexOf',
    'lastIndexOf': 'lastIndexOf',
    'flat': 'flat',
    'toString': 'toString',
    'toLocaleString': 'toLocaleString',
    'forEach': 'forEach',
    'find': 'find',
    'findIndex': 'findIndex',
    'map': 'map',
    'filter': 'filter',
    'some': 'some',
    'every': 'every',
    'reduce': 'reduce',
    'reduceRight': 'reduceRight',
    'flatMap': 'flatMap',
    'keys': 'keys',
    'values': 'values',
    'entries': 'entries',
    'startsWith': 'startsWith',
    'endsWith': 'endsWith',
    'padEnd': 'padEnd',
    'padStart': 'padStart',
    'repeat': 'repeat',
    'normalize': 'normalize',
    'charAt': 'charAt',
    'charCodeAt': 'charCodeAt',
    'codePointAt': 'codePointAt',
    'localeCompare': 'localeCompare',
    'match': 'match',
    'replace': 'replace',
    'search': 'search',
    'split': 'split',
    'substr': 'substr',
    'substring': 'substring',
    'toLowerCase': 'toLowerCase',
    'toUpperCase': 'toUpperCase',
    'toLocaleLowerCase': 'toLocaleLowerCase',
    'toLocaleUpperCase': 'toLocaleUpperCase',
    'trim': 'trim',
    'trimLeft': 'trimLeft',
    'trimRight': 'trimRight',
    'toFixed': 'toFixed',
    'toPrecision': 'toPrecision',
    'toExponential': 'toExponential'
  },
  custom: {
    set,
    del,
    increase,
    decrease,
    toggle,
    each,
    q
  }
}



function set(o, key, ...values) {
  if (values.length === 1) $set(o, key, values[0])
  else if (values.length === 2) $set(o[key], values[0], values[1])
}

function del(o, key, ...values) {
  $delete(o, key, ...values)
}

function increase(o, key, n) {
  o[key] = o[key] - (n && typeof n === 'number' ? n : 1)
}

function decrease(o, key, n) {
  o[key] = o[key] + (n && typeof n === 'number' ? n : 1)
}

function toggle(o, key, ...values) {
  const v = o[key]

  if (Array.isArray(v)) {
    values.forEach(e => {
      const i = v.indexOf(e)
      if (~i) {
        v.splice(i, 1)
      } else {
        v.push(e)
      }
    })
  } else if (typeof v === 'boolean') {
    o[key] = !v
  }
}

function each(o, key, fn, thisArg) {
  let v = o[key]
  if (isObj(v)) v = Object.entries(v)
  else if (Array.isArray(v)) v = v.entries()
  for (let [i, e] of v) {
    fn.call(thisArg, e, i, o[key])
  }
}


function q(o, key, fn) {
  fn(o[key], key, o)
}



export function isObj(o) {
  return o && Object.prototype.toString.call(o) === '[object Object]'
}

export function getTag (method) {
  if (typeof method === 'function') {
    for (let funcName in proxies.custom) {
      const fn =  proxies.custom[funcName]
      if (fn === method) return 'custom'
    }

    return
  }

  for (let name in proxies) {
    const keys = proxies[name]
    if (keys[method]) return name
  }
}



export function tailspin(o, path, fn)  {
  let target = o
  let args = path.match(/[^\.\[\]]+/g)
  if (args) {
    args = args.map(arg => Object.is(Number(arg), NaN) ? arg : Number(arg))
    let len = args.length
    for (let [index, key] of args.entries()) {
      if (target[key] != null) {
        if (len <= index + 1) {
          return fn(target, key)
        }
        target = target[key]
      } else {
        throw new Error(`${path} -> path does not exist`)
      }
    }
  }
}
