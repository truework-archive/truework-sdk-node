import ava, { TestInterface } from 'ava';
import nock from 'nock';
// import sinon from 'sinon'

import { truework, TrueworkSDK } from '../';
import * as types from '../types';
import * as requests from '../mocks/requests';

const test = ava as TestInterface<{ client: TrueworkSDK }>;
const baseURL = 'https://test.truework.com/';

test.before(t => {
  t.context.client = truework({
    baseURL,
    token: 'abcdefg',
  });
});

test('client - requires config', async t => {
  t.throws(() => {
    // @ts-ignore
    const sdk = truework();
  });
});
test('client - requires token', async t => {
  t.throws(() => {
    // @ts-ignore
    const sdk = truework({});
  });
});
test('client - successfully configured', async t => {
  t.truthy(truework({ token: 'abcdefg' }));
});

test('verifications.create - requires params', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.create();
  });
});
test('verifications.create - request is made', async t => {
  nock(baseURL)
    .post('/verification-requests/')
    .reply(200, { id: '12345' });

  const { client } = t.context;

  const res = await client.verifications.create(requests.verification);

  t.is(res.body.id, '12345');
});

test('verifications.get - requires params to be an object', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.get(true);
  });
});
test('verifications.get - request is made', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/verification-requests/')
    .reply(200, { count: 0 });

  const res = await client.verifications.get();

  t.is(res.body.count, 0);
});
test('verifications.get - supports query params', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/verification-requests/')
    .query({
      state: 'pending-approval',
      limit: 10,
      offset: 10,
    })
    .reply(200, { count: 10 });

  const res = await client.verifications.get({
    state: types.VERIFICATION_STATES.PENDING_APPROVAL,
    limit: 10,
    offset: 10,
  });

  t.is(res.body.count, 10);
});

test('verifications.getOne - requires params', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getOne();
  });
});
test('verifications.getOne - requires id', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getOne({});
  });
});
test('verifications.getOne - request is made', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/verification-requests/12345/')
    .reply(200, { id: '12345' });

  const res = await client.verifications.getOne({ id: '12345' });

  t.is(res.body.id, '12345');
});

test('verifications.cancel - requires params', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel();
  });
});
test('verifications.cancel - requires all fields', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel({});
  });
  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel({ id: 'abcdefg' });
  });
  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel({ id: 'abcdefg', cancellationReason: 'foo' });
  });
});
test('verifications.cancel - request is made', async t => {
  const { client } = t.context;

  nock(baseURL)
    .put('/verification-requests/12345/cancel/')
    .reply(200);

  const res = await client.verifications.cancel({
    id: '12345',
    cancellationReason: types.CANCELLATION_REASONS.OTHER,
  });

  t.is(res.body, '');
});

test('verifications.getReport - requires params', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getReport();
  });
});
test('verifications.getReport - requires id', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getReport({});
  });
});
test('verifications.getReport - request is made', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/verification-requests/12345/report/')
    .reply(200, { verification_request: { id: '12345' } });

  const res = await client.verifications.getReport({
    id: '12345',
  });

  t.is(res.body.verification_request.id, '12345');
});

test('companies.get - requires params', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.companies.get();
  });
});
test('companies.get - requires a query', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.companies.get({});
  });
});
test('companies.get - request is made', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/companies/')
    .query({ q: 'Truework' })
    .reply(200, { count: 1 });

  const res = await client.companies.get({
    query: 'Truework',
  });

  t.is(res.body.count, 1);
});
test('companies.get - supports other query params', async t => {
  const { client } = t.context;

  nock(baseURL)
    .get('/companies/')
    .query({ q: 'Truework', limit: 10, offset: 10 })
    .reply(200, { count: 1 });

  const res = await client.companies.get({
    query: 'Truework',
    limit: 10,
    offset: 10,
  });

  t.is(res.body.count, 1);
});
