# @truework/sdk

```bash
npm i @truework/sdk
```

## Usage

```ts
const { truework } = require('@truework/sdk')

const sdk = truework({ token: TRUEWORK_ACCESS_TOKEN })

sdk.verifications
  .get()
  .then(res => {})
  .catch(e => {})
```

### License

MIT License © [Truework](https://truework.com)
