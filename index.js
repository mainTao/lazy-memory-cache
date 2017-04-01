'use strict'
const _ = require('lodash')

const cache = {}

exports.debug = () => {
  console.log(JSON.stringify(cache, ' ', 2))
}

exports.get = (key) => {
  let obj = cache[key]
  if(obj){
    if(Date.now() > obj.deadline){
      delete cache[key]
    }
    else{
      if(obj.getClone){
        return _.cloneDeep(obj.value)
      }
      return obj.value
    }
  }
}

exports.set = (key, value, options) => {
  let deadline
  let setClone
  let getClone
  if(typeof options === 'object'){
    if(typeof options.maxAge === 'number'){
      deadline = Date.now() + options.maxAge * 1000
    }
    if(options.expires instanceof Date){
      deadline = options.expires.getTime()
    }
    if(options.setClone){
      setClone = true
    }
    if(options.getClone){
      getClone = true
    }
    if(options.clone){
      setClone = true
      getClone = true
    }
  }
  cache[key] = {
    value: setClone ? _.cloneDeep(value) : value,
    deadline: deadline,
    getClone: getClone
  }
}

exports.delete = (key) => {
  delete cache[key]
}
