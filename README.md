# @truework/sdk ![npm](https://img.shields.io/npm/v/@truework/sdk) [![install size](https://packagephobia.com/badge?p=@truework/sdk)](https://packagephobia.com/result?p=@truework/sdk)

The official Truework API Node.js SDK.

## Quick Links

- [Getting Started](#getting-started)
- [Terminology](#terminology)
- [Usage](#getting-started)
  - [Verifications](#verifications)
  - [Companies](#companies)
- [Testing](#testing)
  - [Verifications](#verification-mocks)
  - [Companies](#company-mocks)
- [Contributing](#contributing)

## Resources

- 📚 [API Documentation](https://www.truework.com/docs/api)
- 🏠 [Truework](https://www.truework.com)
- 👷‍♀️ [Careers](https://www.truework.com/careers)

# Getting Started

```bash
npm i @truework/sdk --save
```

```ts
const { truework } = require('@truework/sdk');

const client = truework({ token: TRUEWORK_ACCESS_TOKEN });
```

By default, the SDK will use the latest version of our API. To request a
different version, pass it when configuring your client.

```ts
const client = truework({
  token: TRUEWORK_ACCESS_TOKEN,
  version: '2019-10-15',
});
```

To set a timeout on requests, pass in the timeout value in milliseconds when configuring the client. If a request times
out, it will abort with [got.TimeoutError](https://www.npmjs.com/package/got#gottimeouterror). Most applicable when
used in conjunction with [synchronous creation of verifications](#verificationscreateparams-syncparams).

```ts
const client = truework({
  token: TRUEWORK_ACCESS_TOKEN,
  timeout: 6000,
});
```

To use the SDK to call the Truework Sandbox, configure the client for the sandbox environment.

```ts
const { truework, ENVIRONMENT } = require('@truework/sdk');

const client = truework({
  token: TRUEWORK_SANDBOX_TOKEN,
  environment: ENVIRONMENT.SANDBOX,
});
```

# Terminology

Please review the [API Documentation](https://www.truework.com/docs/api) for all
terminology. If you're using Typescript, have a look at the
[types](https://github.com/truework/truework-sdk-node/blob/master/lib/types.ts).

# Usage

All requests are made using [got](https://github.com/sindresorhus/got), and so
responses implement a got
[response](https://github.com/sindresorhus/got#response) object.

```ts
const {
  body: { count, results },
} = await client.verifications.get();
```

## Verifications

### `verifications.get([params])`

**Request**

- `params` - `object` - optional
  - `state` - `string` - required
  - `limit` - `number`
  - `offset` - `number`

**Response**

Returns a `PaginatedResponse` containing an array of `Verification`s.

**Example**

```ts
await client.verifications.get();
await client.verifications.get({ limit: 10 });
```

### `verifications.getOne(params)`

**Request**

- `params` - `object` - required
  - `id` - `string` - required

**Response**

Returns a `Verification` object.

**Example**

```ts
await client.verifications.getOne({ id: 'abc123' });
```

### `verifications.create(params)`

**Request**

- `params` - `object` - required
  - `type` - `VerificationType` - required
  - `permissible_purpose` - `PermissiblePurpose` - required
  - `target` - `Target` - required
  - `documents` - `Document`
  - `additional_information` - `string`

**Response**

Returns the full `Verification` object.

**Example**

```ts
await client.verifications.create({
  type: 'employment',
  permissible_purpose: 'employment',
  target: {
    first_name: 'Megan',
    last_name: 'Rapinoe',
    social_security_number: '123121234',
    company: {
      name: 'USWNT',
    },
  },
  additional_information: 'Lorem ipsum dolor...',
});
```

### `verifications.create(params, syncParams)`

Executes the request synchronously, attempting to return the completed verification rather than sending a webhook on
completion. It is recommended to use the [client](#getting-started) `timeout` param in conjunction with this method.

**Request**

- `params` - `object` - required
  - `type` - `VerificationType` - required
  - `permissible_purpose` - `PermissiblePurpose` - required
  - `target` - `Target` - required
  - `documents` - `Document`
  - `additional_information` - `string`
- `syncParams` - `object`
  - `strategy` - `RequestSyncStrategy`

**Response**

Returns the full `Verification` object, with `reports` if successful.

**Example**

```ts
const {
  truework,
  REQUEST_SYNC_STRATEGIES,
  VERIFICATION_TYPES,
  PERMISSIBLE_PURPOSES,
} = require('@truework/sdk');

const client = truework({
  token: TRUEWORK_ACCESS_TOKEN,
  timeout: 6000,
});

const res = await client.verifications.create(
  {
    type: VERIFICATION_TYPES.EMPLOYMENT,
    permissible_purpose: PERMISSIBLE_PURPOSES.EMPLOYMENT,
    target: {
      first_name: 'Megan',
      last_name: 'Rapinoe',
      social_security_number: '123121234',
      date_of_birth: '1990-09-26',
    },
    additional_information: 'Lorem ipsum dolor...',
  },
  {
    strategy: REQUEST_SYNC_STRATEGIES.SYNC,
  }
);

if (res.body.reports?.length) {
  // verification completed synchronously
}
```

### `verifications.cancel(params)`

**Request**

- `params` - `object` - required
  - `id` - `string` - required
  - `cancellationReason` - `CancellationReason` - required
  - `cancellationDetails` - `string`

**Response**

Returns status code `200` on success.

**Example**

```ts
await client.verifications.cancel({
  id: 'abc123',
  cancellationReason: 'other',
});
```

### `verifications.reverify(params)`

**Request**

- `params` - `object` - required
  - `id` - `string` - required
  - `report_id` - `string` - required

**Response**

Returns the full `Verification` object.

**Example**

```ts
await client.verifications.reverify({
  id: 'abc123',
  rerport_id: 'def123',
});
```

### `verifications.getReport(params)`

**Request**

- `params` - `object` - required
  - `id` - `string` - required, the ID of the Verification

**Response**

Returns the full `Report` object associated with the Verification.

**Example**

```ts
await client.verifications.getReport({ id: 'abc123' });
```

## Companies

### `companies.get(params)`

**Request**

- `params` - `object` - required
  - `query` - `string` - required
  - `limit` - `number`
  - `offset` - `number`

**Response**

Returns a `PaginatedResponse` containing an array of `Company`s.

**Example**

```ts
await client.companies.get({ query: 'USWNT' });
```

## Credentials

### `credentials.createSession(params)`

**Request**

- `params` - `object` - required
  - `type` - `VerificationType` - required
  - `permissible_purpose` - `PermissiblePurpose` - required
  - `use_case` - `UseCase` - required
  - `target` - `Target` - required

**Response**

Returns a `CredentialsSession`

**Example**

```ts
await client.credentials.createSession({
  type: 'employment',
  permissible_purpose: 'employment',
  use_case: 'mortgage',
  target: {
    first_name: 'Megan',
    last_name: 'Rapinoe',
    social_security_number: '123121234',
    date_of_birth: '2020-02-02',
    company: {
      name: 'USWNT',
    },
  },
});
```

# Testing

This SDK provides a naive "mock" mode that can be used for basic testing during
CI, etc. It is _stateless_, meaning no data is persisted between API calls. When
enabled, each SDK method will either return stub objects, or simple reflections
of the data submitted.

To enable mock mode, initialize your SDK client like this:

```ts
const client = truework({
  token: TRUEWORK_ACCESS_TOKEN,
  mock: true,
});
```

## Verification Mocks

### `verifications.get`

Returns a stubbed array of verifications, respective of all query params.

```ts
const res = await client.verifications.get({ state: 'processing', limit: 5 });

res.body.results.length; // => 5
res.body.results[0].state; // => processing
```

### `verifications.getOne`

Returns a stubbed verification object with the same `id` as is passed to
`getOne({ id })`.

#### Error States

Any `id` value is valid, except `"AAAA"`, which will trigger a `404` error
response.

```ts
try {
  await client.verifications.getOne({ id: 'AAAA' });
} catch (e) {
  console.log(e.response); // error response body
}
```

### `verifications.create`

Returns a stubbed verification object.

#### Error States

To trigger an error response, do not pass a `type` property.

```ts
try {
  await client.verifications.create(
    // type: 'employment',
    permissible_purpose: 'employment',
    target: {
      first_name: 'Megan',
      last_name: 'Rapinoe',
      social_security_number: '123121234',
      company: {
        name: 'USWNT',
      },
    },
    additional_information: 'Lorem ipsum dolor...',
  })
} catch (e) {
  console.log(e.response) // error response body
}
```

### `verifications.cancel`

Returns `200` if successful.

#### Error States

Any `id` value is valid, except `"AAAA"`, which will trigger an error response.

```ts
try {
  await client.verifications.cancel({ id: 'AAAA' });
} catch (e) {
  console.log(e.response); // error response body
}
```

### `verifications.getReport`

Returns a stubbed report object if successful.

#### Error States

Any `id` value is valid, except `"AAAA"`, which will trigger an error response.

```ts
try {
  await client.verifications.getReport({ id: 'AAAA' });
} catch (e) {
  console.log(e.response); // error response body
}
```

## Company Mocks

### `companies.get`

Returns a stubbed array of companies, respective of `limit` and `offset` query
params.

```ts
const res = await client.companies.get({ limit: 5 });

res.body.results.length; // => 5
```

## Contributing

### Issues

If you run into problems, or simply have a question, feel free to [open an
issue](https://github.com/truework/truework-sdk-node/issues/new)!

### Commiting

This repo uses [commitizen](https://github.com/commitizen/cz-cli) to nicely
format commit messages. Upon making edits, stage your changes and simply run
`git commit` to enter the commitizen UI in your terminal.

**Note:** if you are not prompted with the commitizen UI, run `npm ci` to re-install
and run `postinstall` hooks to set it up.

### Releases

This project is versioned and published automatically using
[semantic-release](https://github.com/semantic-release/semantic-release). Via a
GitHub Action, `semantic-release` will use the commit message pattern provided
by `commitizen` to automatically version the package. It will then publish to
npm, as well as create a new
[release](https://github.com/truework/truework-sdk-node/releases) here in the
main repo.

**Do not publish this library manually from the command line.**

## License

MIT License © [Truework](https://truework.com)
