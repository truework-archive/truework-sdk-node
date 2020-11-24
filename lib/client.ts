import got from 'got';
import assert from 'nanoassert';
import * as qs from 'query-string';

import pkg from '../package.json';
import { invalid, invalidParams, invalidField, withQueryParams } from './utils';
import * as types from './types';
import { register } from './mocks/register';

export function client (config: {
  token: string;
  baseURL?: string;
  version?: string;
  mock?: boolean;
}) {
  if (config.mock) register();

  assert(
    typeof config === 'object',
    invalid('client was initiated without a config object')
  );

  const {
    token,
    baseURL = 'https://api.truework.com/',
    version = '2019-10-15',
  } = config;

  assert(token, invalidField('client config', 'token'));

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
      create (params: types.RequestVerificationsCreate) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.create')
        );

        return client.post<types.ResponseVerificationsCreate>({
          url: 'verification-requests/',
          json: params,
          responseType: 'json',
        });
      },
      get (params: types.RequestVerificationsGet = {} as any) {
        assert(
          params === undefined || typeof params === 'object',
          invalidParams('verifications.get')
        );

        const { state, limit, offset } = params;

        const url = withQueryParams(
          'verification-requests/',
          qs.stringify({
            state,
            limit,
            offset,
          })
        );

        return client.get<types.ResponseVerificationsGet>(url, {
          responseType: 'json',
        });
      },
      getOne (params: types.RequestVerificationsGetOne) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.getOne')
        );

        const { id } = params;

        assert(id, invalidField('verifications.getOne', 'id'));

        return client.get<types.ResponseVerificationsGetOne>(
          `verification-requests/${id}/`,
          {
            responseType: 'json',
          }
        );
      },
      cancel (params: types.RequestVerificationsCancel) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.cancel')
        );

        const { id, cancellationReason, cancellationDetails } = params;

        assert(id, invalidField('verifications.cancel', 'id'));
        assert(
          cancellationReason &&
            Object.values(types.CANCELLATION_REASONS).includes(
              cancellationReason
            ),
          invalidField('verifications.cancel', 'cancellationReason')
        );

        return client.put({
          url: `verification-requests/${id}/cancel/`,
          json: {
            cancellation_reason: cancellationReason,
            cancellation_details: cancellationDetails,
          },
          responseType: 'json',
        });
      },
      getReport (params: types.RequestVerificationsGetReport) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.getReport')
        );

        const { id } = params;

        assert(id, invalidField('verifications.getReport', 'id'));

        return client.get<types.ResponseReportGet>(
          `verification-requests/${id}/report/`,
          {
            responseType: 'json',
          }
        );
      },
    },
    companies: {
      get (params: types.RequestCompaniesGet) {
        assert(typeof params === 'object', invalidParams('companies.get'));

        const { query, offset, limit } = params;

        assert(query, invalidField('companies.get', 'query'));

        const url = withQueryParams(
          'companies/',
          qs.stringify({
            q: query,
            offset,
            limit,
          })
        );

        return client.get<types.ResponseCompaniesGet>(url, {
          responseType: 'json',
        });
      },
    },
  };
}
