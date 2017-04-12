import test from 'ava'
import Promise from 'bluebird'

const cache = require('./index')

test('get nothing', t => {
  t.is(cache.get('notExist'), undefined)
})

test('get foo', t => {
  cache.set('foo', 'bar')
  t.is(cache.get('foo'), 'bar')
})

test('maxAge expired', async t => {
  cache.set('foo', 'bar', {maxAge: 1})
  return Promise.delay(1000)
    .then(() => {
      cache.debug()
      t.is(cache.get('foo'), undefined)
    })
})

test('maxAge expired but force', async t => {
  cache.set('foo', 'bar', {maxAge: 1})
  return Promise.delay(1100)
    .then(() => {
      cache.debug()
      t.is(cache.get('foo', true), 'bar')
    })
})

test('expire method works', t => {
  cache.set('foo', 'bar', {maxAge: 1})
  cache.expire('foo')
  t.is(cache.get('foo'), undefined)
})

test('maxAge not expired', t => {
  cache.set('foo', 'bar', {maxAge: 1})
  return Promise.delay(800)
    .then(() => {
      cache.debug()
      t.is(cache.get('foo'), 'bar')
    })
})

test('expires expired', t => {
  cache.set('foo', 'bar', {expires: new Date()})
  return Promise.delay(1)
    .then(() => {
      cache.debug()
      t.is(cache.get('foo'), undefined)
    })
})

test('expires not expired', t => {
  let expires = new Date(Date.now() + 1000)
  cache.set('foo', 'bar', {expires: expires})
  return Promise.delay(800)
    .then(() => {
      cache.debug()
      t.is(cache.get('foo'), 'bar')
    })
})

test('delete', t => {
  cache.set('foo', 'bar')
  cache.delete('foo')
  cache.debug()
  t.is(cache.get('foo'), undefined)
})

test('getClone false', t => {
  cache.set('obj', {foo: 'bar'})
  let val = cache.get('obj')
  val.foo = 'baz'
  cache.debug()
  t.is(cache.get('obj').foo, 'baz')
})

test('getClone true', t => {
  cache.set('obj', {foo: 'bar'}, {getClone: true})
  let val = cache.get('obj')
  val.foo = 'baz'
  cache.debug()
  t.is(cache.get('obj').foo, 'bar')
})

test('setClone false', t => {
  let obj = {foo: 'bar'}
  cache.set('obj', obj)
  obj.foo = 'baz'
  cache.debug()
  t.is(cache.get('obj').foo, 'baz')
})

test('setClone true', t => {
  let obj = {foo: 'bar'}
  cache.set('obj', obj, {setClone: true})
  obj.foo = 'baz'
  cache.debug()
  t.is(cache.get('obj').foo, 'bar')
})

