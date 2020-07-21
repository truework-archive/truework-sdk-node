import got from 'got'
import assert from 'nanoassert'
import pkg from '../package.json'
import { VerificationRequest } from './types.js'

const {
  TRUEWORK_API_BASE_URL = 'https://api.truework.com',
  TRUEWORK_API_VERSION = '2019-10-15'
} = process.env

const CANCELLATION_REASONS = [
  'immediate',
  'high-turnaround-time',
  'competitor',
  'wrong-info',
  'other'
]

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
      get () {
        return client.get('verification-requests')
      },
      getOne ({ requestId }: { requestId: string }) {
        assert(requestId, 'requestId is required')
        return client.get(`verification-requests/${requestId}`)
      },
      getReport ({ requestId }: { requestId: string }) {
        assert(requestId, 'requestId is required')
        return client.get(`verification-requests/${requestId}/report`)
      },
      create (requestObj: VerificationRequest) {
        return client.post({
          url: 'verification-requests',
          method: 'POST',
          json: requestObj
        })
      },
      cancel ({
        requestId,
        cancellationReason,
        cancellationDetails
      }: {
        requestId: string
        cancellationReason: string
        cancellationDetails: string
      }) {
        assert(requestId, 'requestId is required')
        assert(
          cancellationReason in CANCELLATION_REASONS,
          'must enter a valid cancellation reason'
        )
        return client.patch({
          url: `verification-requests/${requestId}/cancel`,
          method: 'PATCH',
          json: {
            cancellation_reason: cancellationReason,
            cancellation_details: cancellationDetails
          }
        })
      }
    }
  }
}
