
## Promise学习笔记

### What
- MDN解释:
  - Promise用于异步计算
  - 一个Promise表示一个现在、将来或永不可能可用的值
---
### How
- 用于异步计算
- 可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
- 可以在对象之间传递和操作Promise，帮助我们处理队列
---
### Why
- js包含大量异步操作
- node.js无阻赛高并发，对异步的依赖进一步加剧
- 很容易踏入“回调地狱”
  - 嵌套层次很深，难以维护
  - 无法正常使用return和throw
  - 无法正常检索堆栈信息
  - 在多个回调之间难以建立联系
---
### Start

#### init
```js
new Promise(
  /* 执行器 executor */
  function(resolve, reject){
    // 一段耗时很长的异步操作

    resolve(); // 数据处理完成

    reject(); // 数据处理出错
  }
).then(function A(){
  // 成功，下一步
}, function B(){
  // 失败，做相应处理
})
```
#### Details
- Promise
  - 是一个代理对象，它和原先要进行的操作并无关系
  - 它引入一个回调，避免更多的回调
  - 3个状态
    - pending[待定]初始状态
    - fulfilled[实现]操作成功
    - rejected[被否决]操作失败
  - Promise状态发生改变，就会触发.then()里的响应函数处理后续步骤
  - Promise状态一经改变，不会再变
  - Promise实例一经创建，执行器立即执行
    - new Promise(executer)实例声明 => executor执行器 => .then()下一步 => .then()下一步，每一个then都会返回一个新的Promise实例

- .then()
  - 接收两个函数作为参数，分别代表fulfilled和rejected
  - 返回一个新的Promise实例，可以链式调用
  - 当前面的Promise状态改变时，.then()根据其最终状态选择特定的状态响应函数执行
  - 状态响应函数可以返回新的Promise，或其他值
    - 如果返回新的Promise，那么下一级.then()会在新的Promise状态改变之后执行
    - 如果返回其他任何值，则会立刻执行下一级.then()
  - 嵌套
    - 因为.then()返回的还是Promise实例，会等里面的.then()执行完，在执行外面的的。
    - 将其展开，会更好的阅读

- 错误处理：Promise会自动捕获内部异常，并交给rejected响应函数处理
  - reject('错误信息).then(null, message => {})
  - throw new Error('错误信息).catch(message => {})
  - 用第二种方式，更加清晰好读，并且可以捕获前面的错误

- .catch() + .then()：建议在所有队列最后都加上.catch(),以免漏掉错误处理造成意想不到的问题
```js
doSomething()
  .doAnotherThing()
  .doMoreThing()
  .catch(err => {
    console.log(err)
  })
```

- Promise.all()：批量执行
  - Promise.all([p1, p2, p3,...])用于将多个Promise实例包装成一个新的Promise实例
  - 返回的实例就是普通的Promise
  - 接受一个数组作为参数
  - 数组里可以是Promise对象，也可以是别的值，只有Promise会等待状态改变
  - 当所有子Promise都完成，该Promise完成，返回值是全部值的数组
  - 有任何一个失败，该Promise失败，返回值是第一个失败的子Promise的结果
  - 和 .map()连用

- 实现队列
```js
let promise = doSomeThing()
promise = promise.then(doSomethingElse)
promise = promise.then(doSomethingElse2)
promise = promise.then(doSomethingElse3)
...

// foreach
function queue(things) {
  let ptomise = Promise.resolve();

  things.forEach(thing => {
    promise = promise.then(() => {
      return new Promise(resolve => {
        doThing(thing, () => {
          resolve()
        })
      })
    })
  })

  return promise
}

// reduce
function queue(things) {
  return things.reduce((promise, thing) => {
    return promise.then(() =>{
      doThing(thing, () => {
        resolve()
      })
    })
  }, Promise.resolve());
}

queue(['da', 'dsf',...])

```

- 下面四种Promise的区别
```js
/**
 * step1: doSomething
 * step2: doSomethingElse(undefined)
 * step3: finalHanler(resultOfDoSomethingElse)
 */
doSomething()
  .then(function(){
    return doSomethingElse()
  })
  .then(finalHanler)

/**
 * step1: doSomething
 * step2: doSomethingElse(undefined) 和 finalHanler(undefined)
 */
doSomething()
  .then(function(){
    doSomethingElse()
  })
  .then(finalHanler)

/**
 * step1: doSomething和doSomethingElse(undefined)
 * step2：finalHanler(resultOfDoSomething)
 */
doSomething()
  .then(doSomethingElse())
  .then(finalHanler)


/**
 * step1: doSomething
 * step2: doSomethingElse(resultOfDoSomething)
 * step3: finalHanler(resultOfDoSomethingElse)
 */
doSomething()
  .then(doSomethingElse)
  .then(finalHanler)

```


---
## Let's do it
- [最简单的实例](./example/1/index.js)
- [分两次,顺序依次执行](./example/2/index.js)
- [对已完成的Promisez执行then](./example/3/index.js)
- [then里面不返回Promise](./example/4/index.js)
- [then链式调用(嵌套，不推荐)](./example/6/index.js)
- [then链式调用(不嵌套，跟上面返回一样的值，推荐)](./example/6/index2.js)
- [错误处理(throw new Error，可以捕获之前的错误，推荐)](./example/7/index.js)
- [错误处理(reject，不能捕获之前的错误，不推荐)](./example/7/index2.js)
- [catch() + then()](./example/8/index.js)


## Learning from
  - https://www.imooc.com/learn/949
>  to be continued...