import got from 'got';
import assert from 'nanoassert';
import * as qs from 'query-string';

import pkg from '../package.json';
import { invalid, invalidField, invalidParams, withQueryParams } from './utils';
import * as types from './types';
import { register } from './mocks/register';

export function client (config: {
  token: string;
  baseURL?: string;
  version?: string;
  mock?: boolean;
  environment?: types.ENVIRONMENT;
}) {
  if (config.mock) register();

  assert(
    typeof config === 'object',
    invalid('client was initiated without a config object')
  );

  const { token, version } = config;
  const baseURL = getBaseURL(config);

  assert(token, invalidField('client config', 'token'));

  const versionString = version ? `; version=${version}` : '';
  const client = got.extend({
    prefixUrl: baseURL,
    headers: {
      'content-type': 'application/json',
      accept: `application/json${versionString}`,
      'user-agent': `Truework Node SDK v${pkg.version}; Node ${process.version}`,
      authorization: `Bearer ${token}`,
    },
  });

  return {
    verifications: {
      create (
        params: types.RequestVerificationsCreate,
        syncParams?: types.RequestSyncParameters
      ) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.create')
        );
        if (syncParams) {
          assert(
            typeof syncParams === 'object',
            invalidParams('verifications.create')
          );
        }

        return client.post<types.ResponseVerificationsCreate>({
          url: 'verification-requests/',
          json: params,
          responseType: 'json',
          headers: syncParams
            ? {
                'Request-Sync': buildRequestSyncHeader(syncParams),
              }
            : undefined,
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
      reverify (params: types.RequestVerificationsReverify) {
        assert(
          typeof params === 'object',
          invalidParams('verifications.reverify')
        );

        const { id, report_id } = params;

        assert(id, invalidField('verifications.reverify', 'id'));
        assert(report_id, invalidField('verifications.reverify', 'report_id'));

        return client.put<types.ResponseVerificationsCreate>({
          url: `verification-requests/${id}/reverify/`,
          json: {
            report_id: report_id,
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
    credentials: {
      createSession (params: types.RequestCredentialsSessionCreate) {
        assert(
          typeof params === 'object',
          invalidParams('credentials.createSession')
        );

        return client.post<types.ResponseCredentialsSessionCreate>({
          url: 'credentials/session',
          json: params,
          responseType: 'json',
        });
      },
    },
  };
}

function getBaseURL ({
  baseURL,
  environment,
}: {
  baseURL?: string;
  environment?: types.ENVIRONMENT;
}): string {
  const productionBaseURL = 'https://api.truework.com/';
  const sandboxBaseURL = 'https://api.truework-sandbox.com/';

  switch (environment) {
    case types.ENVIRONMENT.PRODUCTION:
      assert(
        baseURL == undefined,
        invalid(
          'cannot initialize client with ENVIRONMENT.PRODUCTION and baseURL'
        )
      );
      return productionBaseURL;
    case types.ENVIRONMENT.SANDBOX:
      assert(
        baseURL == undefined,
        invalid('cannot initialize client with ENVIRONMENT.SANDBOX and baseURL')
      );
      return sandboxBaseURL;
    default:
      return baseURL ?? productionBaseURL;
  }
}

function buildRequestSyncHeader (params: types.RequestSyncParameters) {
  if (params.strategy === types.REQUEST_SYNC_STRATEGIES.ASYNC) {
    assert(
      !('timeout' in params),
      invalid('async request sync strategy does not accept a timeout')
    );
    return `${params.strategy.valueOf()}`;
  } else {
    assert(
      'timeout' in params,
      invalid('synchronous request sync strategies require a timeout')
    );
    return `${params.strategy.valueOf()}; timeout=${Math.floor(
      params.timeout
    )}`;
  }
}
