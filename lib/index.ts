import got from 'got'
import assert from 'nanoassert'
import pkg from '../package.json'

const {
  TRUEWORK_API_BASE_URL = 'https://api.truework.com',
  TRUEWORK_API_VERSION = '2019-10-15'
} = process.env

export function truework (config: { token: string }) {
  assert(typeof config === 'object', 'config object is required')
  assert(config.token, 'config.token is required')

  const client = got.extend({
    prefixUrl: TRUEWORK_API_BASE_URL,
    headers: {
      'content-type': 'application/json',
      accept: `application/json; version=${TRUEWORK_API_VERSION}`,
      'user-agent': `Truework Node SDK v${pkg.version}; Node ${process.version}`,
      authorization: `Bearer ${config.token}`
    }
  })

  return {
    verifications: {
      getOne ({ id }: { id: string }) {
        assert(id, 'id is required')
        return client.get(`verification-requests/${id}`)
      }
    }
  }
}
