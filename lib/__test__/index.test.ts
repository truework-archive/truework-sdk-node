import ava, { TestInterface } from 'ava';
// import sinon from 'sinon'

import { truework, TrueworkSDK } from '../';

const test = ava as TestInterface<{ client: TrueworkSDK }>;

test.before(t => {
  t.context.client = truework({
    token: 'abcdefg',
  });
});

test('client - assertions - config', async t => {
  t.throws(() => {
    // @ts-ignore
    const sdk = truework();
  });

  t.throws(() => {
    // @ts-ignore
    const sdk = truework({});
  });

  t.truthy(truework({ token: 'abcdefg' }));
});

test('verifications.create - assertions', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.create();
  });
});

test('verifications.getOne - assertions', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getOne();
  });
  t.throws(() => {
    // @ts-ignore
    client.verifications.getOne({});
  });
});

test('verifications.cancel - assertions', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel();
  });
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
  t.throws(() => {
    // @ts-ignore
    client.verifications.cancel({ id: 'abcdefg', cancellationReason: 'other' });
  });
});

test('verifications.getReport - assertions', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.verifications.getReport();
  });
  t.throws(() => {
    // @ts-ignore
    client.verifications.getReport({});
  });
});

test('companies.get - assertions', async t => {
  const { client } = t.context;

  t.throws(() => {
    // @ts-ignore
    client.companies.get();
  });
  t.throws(() => {
    // @ts-ignore
    client.companies.get({});
  });
});
