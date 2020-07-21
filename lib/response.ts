export function handleResponse<T> (loader: () => T) {
  try {
    return loader();
  } catch (e) {
    // as we introduce error codes we'll catch and format here
    throw e;
  }
}
