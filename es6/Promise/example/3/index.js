
console.log('here we go')

let promise = new Promise(resolve => {
  setTimeout(() => {
    console.log('the promise fulfilled');
    resolve('hello world');
  }, 1000);
});

setTimeout(() => {
  promise.then(value => {
    console.log(value)
  });
}, 3000);


/*
here we go
the promise fulfilled
hello world
*/

