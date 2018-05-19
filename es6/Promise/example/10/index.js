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

function queue(things) {
  return things.reduce((promise, thing) => {
    return promise.then(() =>{
      doThing(thing, () => {
        resolve()
      })
    })
  }, Promise.resolve());
}




