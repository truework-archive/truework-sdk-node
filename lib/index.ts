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

const CANCELLATION_REASONS = [
  'immediate',
  'high-turnaround-time',
  'competitor',
  'wrong-info',
  'other',
];

export function truework (config: {
  token: string;
  baseURL?: string;
  version?: string;
}) {
  assert(typeof config === 'object', 'config object is required');

  const {
    token,
    baseURL = 'https://api.truework.com/',
    version = '2019-10-15',
  } = config;

  assert(token, 'config.token is required');

  const client = got.extend({
    prefixUrl: baseURL,
    headers: {
      'content-type': 'application/json',
      accept: `application/json; version=${version}`,
      'user-agent': `Truework Node SDK v${pkg.version}; Node ${process.version}`,
      authorization: `Bearer ${token}`,
    },
  });

  return {
    verifications: {
      get () {
        return handleResponse<GotReturn>(() =>
          client.get<ListVerificationsResponse>('verification-requests/')
        );
      },
      getOne ({ id }: { id: string }) {
        assert(id, 'request Id is required');
        return handleResponse<GotReturn>(() =>
          client.get<RetrieveVerificationResponse>(
            `verification-requests/${id}`
          )
        );
      },
      getReport ({ id }: { id: string }) {
        assert(id, 'request Id is required');
        return handleResponse<GotReturn>(() =>
          client.get<RetrieveReportResponse>(
            `verification-requests/${id}/report`
          )
        );
      },
      create (requestObj: VerificationRequest) {
        assert(typeof requestObj === 'object', 'verification data is required');
        return handleResponse<GotReturn>(() =>
          client.post<VerificationRequestData>({
            url: 'verification-requests/',
            method: 'POST',
            json: requestObj,
          })
        );
      },
      cancel ({
        id,
        cancellationReason,
        cancellationDetails,
      }: {
        id: string;
        cancellationReason: string;
        cancellationDetails: string;
      }) {
        assert(id, 'request Id is required');
        assert(
          CANCELLATION_REASONS.includes(cancellationReason),
          'must enter a valid cancellation reason'
        );
        return handleResponse<GotReturn>(() =>
          client.patch({
            url: `verification-requests/${id}/cancel/`,
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
        return handleResponse(() =>
          client.get<ListCompaniesResponse>(`companies/?${params}`, {
            responseType: 'json',
          })
        );
      },
    },
  };
}
