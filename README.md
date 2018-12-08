# baseVX


[![GitHub](https://img.shields.io/badge/GitHub-yeshimei-green.svg)](https://github.com/yeshimei/baseVX) [![npm](https://img.shields.io/badge/npm-v1.0.1-blue.svg)](https://www.npmjs.com/package/base-vx)
[![build passing](https://img.shields.io/badge/build-passing-green.svg)](https://github.com/yeshimei/baseVX) [![MIT](https://img.shields.io/npm/l/express.svg)](https://github.com/yeshimei/baseVX)


baseVX 是一个基于 vuex 状态管理，它只关注一件事让你以最轻量的代码最简单的方式使用状态管理通信 vue 组件。

它拥有以下令人惊叹的特性：
- 足够快，baseVX 基于 vuex，仅注册一个 mutation。vx 辅助函数返回的是一个状态可变的单例模式。
- 足够轻量，gzip 后只有 2kb。
- 足够强大，baseVX 内置了数值、字符串、数组和对象的原生方法和一些扩展的内置方法，并且可以轻松与 lodash 等第三方工具库无缝链接变得更为强大。
- 足够简单，baseVX 只有一个辅助函数 vx，并且通过类似 jq 的选择器查询(vx 实现的是对数据结构的路径查询)和易用易读的链式调用。
- 零成本，baseVX 完全兼容 vuex，无需改动一行代码，开箱即用。baseVX 与 vuex 相辅相成，这是因为 baseVX 使用了 vuex 的状态树。




# 安装

```
npm i base-vx --save
```


# 使用


使用方法和 vuex 完全一致，创建一个 `store.js` 文件管理我们的状态数据。

```js
// store.js

import Vue from 'vue'
import Vuex from 'vuex'
import baseVX from 'base-vx'

baseVX.use(Vuex)
Vue.use(Vuex)


export default BaseVX.Store({
  state: {
    a: {
      b: [1, 2, {
        c: 1
      }]
    }
  },
  mutations: {},
  actions: {}
  // ...
})
```

如果你使用 vue-cli 构建的 vue + vuex 项目，那就可以用了。没使用的话，需要在 `main.js` 或你自己的 vue 根实例所在的文件中导入 **store**


```js
// main.js

import store from './store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

# 辅助函数 vx

当你在组件中修改 state 时，你就会见识到 vx 的强大和便捷。它让你几乎不用写 vuex 的 mutation，因为它内置了很多常用的方法帮助你完成这一切。



比如这里，我们修改 `store.js` 文件中 state 的最深层的 `c`


```html
 <!--Home.vue-->
<div>
  <span>{{a}}</span>
  <button @click="onChangeC">改变</button>
</div>
```


vx 第一个参数是一个路径字符串，你可以深度查询任何层级的数据。第二个参数是一个选项对象。当 vx 通过路径字符串查询到一个有效的数据时，你就能以链式的方式调用内置方法了。

```js
// Home.vue

import { mapState } from 'vuex'
// 在你的 vue 组件中引入 vx 辅助函数
import { vx } from 'base-vx'

export default {
  name: 'home',
  computed: {
    ...mapState(['a'])
  },
  methods: {
    onChangeC () {
      // 通过字符串路径指明需要操作的数据
      // 然后调用内置方法 set 修改它
      vx('a.b[2].c').set(100)
    }
  }
}
```

当你点击 **改变** 按钮时，可以看到对象最内层的 c 变成了 100。你还可以链式调用多个内置方法，有序的处理比较复杂的数据。

```js
import { mapState } from 'vuex'
import { vx } from 'base-vx'

export default {
  name: 'home',
  computed: {
    ...mapState(['a'])
  },
  methods: {
    onChangeC () {
      // 将 c 变成一个空数组
      // 添加三个数值元素
      // 最后，每个元素递增 1
      vx('a.b[2].c').set([]).push(1, 2, 3).map(e => e + 1)
    }
  }
}
```





# 内置方法

内置方法有两种，一种是原生方法，它非常非常非常容易掌握，因为它们就是 js 的原生方法(使用和特性都完全一致)。另外一种是扩展的内置方法，提供一些常用的解决各种痛点的操作数据的工具。

以下列出数值内置的原生方法。

```
toFixed()
toPrecision()
toExponential()
```

以下列出字符串内置的原生方法。

```
includes()            match()
startsWith()          replace()
endsWith()            search()
padEnd()              slice()
padStart()            split()
repeat()              substr()
normalize()           substring()
charAt()              toLowerCase()
charCodeAt()          toUpperCase()
codePointAt()         toLocaleLowerCase()
localeCompare()       toLocaleUpperCase()
concat()              trim()
indexOf()             trimLeft()
lastIndexOf()         trimRight()
```

以下列出数组内置的原生方法。

```
copyWithin()          lastIndexOf()
fill()                flat()
unshift()             forEach()
shift()               find()
push()                findIndex()
pop()                 map()
reverse()             filter()
sort()                some()
splice()              every()
includes()            reduce()
concat()              reduceRight()
join()                flatMap()
slice()               indexOf()
```

以下列出对象的内置原生方法。

```
keys()    // 相当于 Object.keys()
values()  // 相当于 Object.values()
entries() // 相当于 Object.entries()
```

另外是 7 个内置的扩展方法。

```js
set()     // 就是 vue 实例上的 mv.$vue
del()     // 就是 vue 实例上的 mv.$delete
```

```js
// 递增数值，默认为 1
decrease(n = 1)
// 递减数值，默认为 1
increase(n = 1)
```

```js
// 当目标数据是数组时，存在删除不存在添加。
// 比如 [2, 4, 5]，切换为 [1, 3, 4, 5]
toggle(1, 2, 3)
// 当目标数据是布尔值时，比如 false，切换为 true
toggle()
```

```js
// 可用于任何数据的遍历，包括对象和字符串
each((value, key, o) =>  o[key] = value + 1)
// 将对象里每个属性的值加 1
```

```js
// q 是 quite 的缩写。
// 它是一个安静的方法，什么都不做
// 它接受一个回调，参数分别是
// 路径字符串查询到的值，路径字符串最后一个的 key 和它们的对象
q((value, key, o) => o[key] = 1)
```



# 第三方库扩展


baseVX 还提供了扩展内置方法的接口，让你既轻松又足够自由的增强 vx 的能力。

**注意，你必须在实例化 baseVX.Store 之前扩展内置方法**

```js
// store.js

import baseVX from 'base-vx'
const { add } =  baseVX

// 比如，扩展一个让数组中所有元素加 n 的方法
// 第一参数是方法名
// 第二个参数是一个回调，接受三个参数
// 目标对象，字符串路径最后一个 key，和在 vue 组件中调用 increaseAll 方法传入的参数
add('increaseAll', function (o, key, n = 1) {
  // o[key] 可以获取目标数据
  o[key].map(e => e + n)
})
```


这里，演示了一个与最著名的第三方工具库 lodash 的无缝衔接。



```js
// store.js
import _ from 'lodash'
import baseVX from 'base-vx'
const {add, only} baseVX


Object.entries(
  // only 方法可以让你轻松挑选自己想要的方法
  // 这里，我们挑选了 lodash 中 difference 和 compact 方法
  only(_, 'difference compact')
).forEach(([key, value]) => add(name, function (o, key, ...values) {
  // 注意，difference 和 compact 方法都返回一个新数组
  // 不修改原数组，所以你需要覆盖掉原来的数组让修改生效
  o[key] =  fn(o[key], ...values)
}))
```

然后就可以当做普通的内置方法使用了。


```
vx('a.b').difference([2, 3, 4, 5])
vx('a.c').compact()
```



# 手动提交

链式调用时每个方法都会提交一次 mutation，这本身没任何问题，但是在你关注调试或撤销改变时就非常有用了。

你可以在全局、实例和当前调用链三个层级上开启手动提交。手动执行 commit() 方法，让整条链合并成一个 mutation

```js
// 在当前调用链上开启手动提交
// chain 方法的参数默认为 true
vx('chainCount').chain().values().push(2).commit()

// 或者在实例上开启手动提交
const _vx = vx('chainCount', {chain: true})
// 手动提交你必须调用 commit 方法才会使修改生效
_vx.values().push(2).commit()
```

```js
// store.js

// 全局上开启手动提交
baseVX.defaults.chain = true
```

三者的优先级，当前调用链 > 实例 > 全局

