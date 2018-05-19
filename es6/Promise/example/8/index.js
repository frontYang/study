console.log('here we go')

let promise =  new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, 1000);
})

promise
  .then(() => {
    console.log('start');
    throw new Error('test error');
  })
  .catch(error => {
    console.log('Error：', error.message);
    throw new Error('another error');
  })
  .then(() => {
    console.log('arrive here')
  })
  .then(() => {
    console.log('... and here')
  })
  .catch(error => {
    console.log('Error：', error.message);
  })


/**
 *
 * here we go
 * start
 * Error： test error
 * arrive here
 * ... and here
 */

 /**
  * 如果放开注释会返回
  * here we go
  * start
  * Error： test error
  * Error： another error
  */
