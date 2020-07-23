export function invalid (message: string) {
  return `@truework/sdk - ${message}`;
}

export function invalidParams (scope: string) {
  return `@truework/sdk - ${scope} missing parameters`;
}

export function invalidField (scope: string, field: string) {
  return `@truework/sdk - ${scope} missing required field "${field}"`;
}

export function withQueryParams (url: string, params: string) {
  return params ? url + '?' + params : url;
}
