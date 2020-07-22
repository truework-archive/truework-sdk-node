import got, { GotReturn } from 'got';
import assert from 'nanoassert';
import * as qs from 'query-string';

import pkg from '../package.json';
import {
  VerificationRequest,
  ListVerificationsResponse,
  RetrieveVerificationResponse,
  RetrieveReportResponse,
  VerificationRequestData,
  ListCompaniesResponse,
} from './types';
import { handleResponse } from './response';

const {
  TRUEWORK_API_BASE_URL = 'https://api.truework.com',
  TRUEWORK_API_VERSION = '2019-10-15',
} = process.env;

const CANCELLATION_REASONS = [
  'immediate',
  'high-turnaround-time',
  'competitor',
  'wrong-info',
  'other',
];

export function truework (config: { token: string }) {
  assert(typeof config === 'object', 'config object is required');
  assert(config.token, 'config.token is required');

  const client = got.extend({
    prefixUrl: TRUEWORK_API_BASE_URL,
    headers: {
      'content-type': 'application/json',
      accept: `application/json; version=${TRUEWORK_API_VERSION}`,
      'user-agent': `Truework Node SDK v${pkg.version}; Node ${process.version}`,
      authorization: `Bearer ${config.token}`,
    },
  });

  return {
    verifications: {
      get () {
        return handleResponse<GotReturn>(() =>
          client.get<ListVerificationsResponse>('verification-requests')
        );
      },
      getOne ({ requestId }: { requestId: string }) {
        assert(requestId, 'requestId is required');
        return handleResponse<GotReturn>(() =>
          client.get<RetrieveVerificationResponse>(
            `verification-requests/${requestId}`
          )
        );
      },
      getReport ({ requestId }: { requestId: string }) {
        assert(requestId, 'requestId is required');
        return handleResponse<GotReturn>(() =>
          client.get<RetrieveReportResponse>(
            `verification-requests/${requestId}/report`
          )
        );
      },
      create (requestObj: VerificationRequest) {
        assert(typeof requestObj === 'object', 'verification data is required');
        return handleResponse<GotReturn>(() =>
          client.post<VerificationRequestData>({
            url: 'verification-requests',
            method: 'POST',
            json: requestObj,
          })
        );
      },
      cancel ({
        requestId,
        cancellationReason,
        cancellationDetails,
      }: {
        requestId: string;
        cancellationReason: string;
        cancellationDetails: string;
      }) {
        assert(requestId, 'requestId is required');
        assert(
          cancellationReason in CANCELLATION_REASONS,
          'must enter a valid cancellation reason'
        );
        return handleResponse<GotReturn>(() =>
          client.patch({
            url: `verification-requests/${requestId}/cancel`,
            method: 'PATCH',
            json: {
              cancellation_reason: cancellationReason,
              cancellation_details: cancellationDetails,
            },
          })
        );
      },
    },
    companies: {
      get (searchObj: { q: string; offset?: number; limit?: number }) {
        assert(typeof searchObj === 'object', 'search params required');

        const { q, offset = 0, limit = 25 } = searchObj;
        assert(typeof q === 'string', 'must enter a query');

        const params = qs.stringify({
          q,
          offset,
          limit,
        });
        return handleResponse<GotReturn>(() =>
          client.get<ListCompaniesResponse>(`companies/?${params}`)
        );
      },
    },
  };
}
