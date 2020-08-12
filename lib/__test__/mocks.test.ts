import ava, { TestInterface } from 'ava';

import { truework, TrueworkSDK } from '../';
import * as types from '../types';
import * as requests from '../mocks/requests';

const test = ava as TestInterface<{ client: TrueworkSDK }>;
const baseURL = 'https://api.truework.com/';
const VERIFICATION_ID =
  'AAAAAAAAAOoAAaDBFruDgadDkwPP0yVjCGf5rWapD3rzwqq5fZT6sqri';

test.before(t => {
  t.context.client = truework({
    baseURL,
    token: 'abcdefg',
    mock: true,
  });
});

/*
 * Verifications Create
 */

test('verifications.create - reflects submitted data', async t => {
  const { client } = t.context;

  const res = await client.verifications.create(requests.verification);

  t.is(res.body.type, requests.verification.type);
  t.is(res.body.target.first_name, requests.verification.target.first_name);
});

/*
 * Verifications Get
 */

test('verifications.get', async t => {
  const { client } = t.context;

  const res = await client.verifications.get();

  t.is(res.body.results.length, 20);
  t.is(res.body.count, 40);
  t.truthy(res.body.next);
  t.is(res.body.previous, undefined);
});
test('verifications.get - respects query params', async t => {
  const { client } = t.context;

  const res = await client.verifications.get({
    limit: 5,
    offset: 5,
  });

  t.is(res.body.results.length, 5);
  t.is(res.body.count, 40);
  t.truthy(res.body.next);
  t.truthy(res.body.previous);
});
test('verifications.get - reflects state', async t => {
  const { client } = t.context;

  const res = await client.verifications.get({
    state: types.VERIFICATION_STATES.PENDING_APPROVAL,
  });

  t.is(res.body.results[0].state, types.VERIFICATION_STATES.PENDING_APPROVAL);
});

/*
 * Verifications Get One
 */

test('verifications.getOne', async t => {
  const { client } = t.context;

  const res = await client.verifications.getOne({
    id: VERIFICATION_ID,
  });

  t.is(res.body.id, VERIFICATION_ID);
});

/*
 * Verifications Cancel
 */

test('verifications.cancel', async t => {
  const { client } = t.context;

  const res = await client.verifications.cancel({
    id: VERIFICATION_ID,
    cancellationReason: types.CANCELLATION_REASONS.OTHER,
  });

  t.is(res.body, '');
});

/*
 * Verifications Get Report
 */

test('verifications.getReport', async t => {
  const { client } = t.context;

  const res = await client.verifications.getReport({
    id: VERIFICATION_ID,
  });

  t.is(res.body.verification_request.id, VERIFICATION_ID);
});

/*
 * Companies Get
 */

test('companies.get', async t => {
  const { client } = t.context;

  const res = await client.companies.get({
    query: 'USWNT',
    limit: 5,
    offset: 5,
  });

  t.is(res.body.results.length, 5);
  t.is(res.body.count, 40);
  t.truthy(res.body.next);
  t.truthy(res.body.previous);
});
