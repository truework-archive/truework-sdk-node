# @truework/sdk ![npm](https://img.shields.io/npm/v/@truework/sdk) [![](https://badgen.net/bundlephobia/minzip/@truework/sdk)](https://bundlephobia.com/result?p=@truework/sdk)

The official Truework API Node.js SDK.

```bash
npm i @truework/sdk
```

## Basic usage

```ts
const { truework } = require('@truework/sdk');

const client = truework({ token: TRUEWORK_ACCESS_TOKEN });

client.companies
  .get()
  .then(res => {})
  .catch(e => {});
```

## Resources

- 📚 [Documentation](https://www.truework.com/docs/api)
- 🏠 [Truework](https://www.truework.com)
- 👷‍♀️ [Careers](https://www.truework.com/careers)

### License

MIT License © [Truework](https://truework.com)
