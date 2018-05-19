
console.log('here we go')


Promise.all([1, 2, 3])
  .then(all => {
    console.log('1: ', all)
    return Promise.all([function () {
      console.lo('ooxx')
    }, 'xxoo', false])
  })
  .then( all => {
    console.log('2: ', all);
    let p1 = new Promise(resolve => {
      setTimeout(() => {
        resolve('p1')
      }, 1500)
    })

    let p2 = new Promise(resolve => {
      setTimeout(() => {
        resolve('p2')
      }, 1450)
    })
    return Promise.all([p1, p2])
  })
  .then( all => {
    console.log('3: ', all);
    let p1 = new Promise(resolve => {
      setTimeout(() => {
        resolve('p1')
      }, 1500)
    })

    let p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('p2')
      }, 1000)
    })

    let p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('p3')
      }, 3000)
    })

    return Promise.all([p1, p2])
  })
  .then( all => {
    console.log('all', all)
  })
  .catch(err => {
    console.log('catch', err)
  })


  /**
here we go
1:  [ 1, 2, 3 ]
2:  [ [Function], 'xxoo', false ]
3:  [ 'p1', 'p2' ]
catch p2
   */




