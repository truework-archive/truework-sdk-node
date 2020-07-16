require('dotenv').config()
import test from 'ava'

import { truework } from './'

const { TRUEWORK_API_TOKEN } = process.env

test('config required', async t => {
  t.throws(() => {
    // @ts-ignore
    const sdk = truework()
  })
})

test('config.token required', async t => {
  t.throws(() => {
    // @ts-ignore
    const sdk = truework({})
  })
})

test('instance created', async t => {
  const sdk = truework({ token: TRUEWORK_API_TOKEN as string })
  t.truthy(sdk)
})
