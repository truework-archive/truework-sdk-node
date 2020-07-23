import { client } from './client';

export const truework = client;
export type TrueworkSDK = ReturnType<typeof client>;
export * from './types';
