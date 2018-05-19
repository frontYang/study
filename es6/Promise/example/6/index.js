
console.log('here we go')

new Promise(resolve => {
  console.log('step 1')
  setTimeout(() => {
    resolve(100)
  }, 1000);
}).then(value => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(110)
    }, 1000);
  }).then(value => {
    console.log('step 1-1')
    return value;
  }).then(value => {
    console.log('step 1-2')
    return value;
  }).then(value => {
    console.log('step 1-3')
    return value;
  })
}).then(value => {
  console.log(value)
  console.log('step 2')
})


/** here we go
step 1
step 1-1
step 1-2
step 1-3
110
step 2 */


