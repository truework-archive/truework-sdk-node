import nock from 'nock';
import * as qs from 'query-string';

import * as types from '../types';
import * as responses from './responses';

/**
 * Note: these are matched in the order they're defined
 */

export function register () {
  /*
   * Verifications - Get Report
   */
  nock('https://api.truework.com/')
    .persist()
    .get(/verification\-requests\/[^\/]+\/report/)
    .reply((uri, body, cb) => {
      const [, id] = uri.match(/verification\-requests\/([^\/]+)\//) || [];
      cb(null, responses.verifications.getReport({ id }));
    });

  /*
   * Verifications - Cancel
   */
  nock('https://api.truework.com/')
    .persist()
    .put(/verification\-requests\/[^\/]+\/cancel/)
    .reply((uri, body, cb) => {
      const [, id] = uri.match(/verification\-requests\/([^\/]+)\//) || [];
      cb(null, responses.verifications.cancel({ id }));
    });

  /*
   * Verifications Get One
   */
  nock('https://api.truework.com/')
    .persist()
    .get(/verification\-requests\/[^\/]+\//)
    .reply((uri, body, cb) => {
      const [, id] = uri.match(/verification\-requests\/([^\/]+)\//) || [];
      cb(null, responses.verifications.getOne({ id }));
    });

  /*
   * Verifications Get
   */
  nock('https://api.truework.com/')
    .persist()
    .get('/verification-requests/')
    .query(true)
    .reply(200, uri => {
      const { query } = qs.parseUrl(uri);
      return responses.verifications.get(query);
    });

  /*
   * Verifications Create
   */
  nock('https://api.truework.com/')
    .persist()
    .post('/verification-requests/')
    .reply((uri, body, cb) => {
      cb(
        null,
        responses.verifications.create(body as types.RequestVerificationsCreate)
      );
    });

  /*
   * Companies Get
   */
  nock('https://api.truework.com/')
    .persist()
    .get('/companies/')
    .query(true)
    .reply(200, (uri, body: types.RequestVerificationsCreate) => {
      const { query } = qs.parseUrl(uri);
      return responses.companies.get(query as types.RequestCompaniesGet);
    });

  /*
   * Credentials Create Session
   */
  nock('https://api.truework.com/')
    .persist()
    .post('/credentials/session')
    .reply(201, responses.credentials.createSession());
}
