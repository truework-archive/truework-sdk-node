import {
  VERIFICATION_TYPES,
  PERMISSIBLE_PURPOSES,
  RequestVerificationsCreate,
} from '../types';

export const MockVerificiation: RequestVerificationsCreate = {
  type: VERIFICATION_TYPES.VOE,
  permissible_purpose: PERMISSIBLE_PURPOSES.EMPLOYMENT,
  target: {
    first_name: 'Megan',
    last_name: 'Rapinoe',
    social_security_number: '123451234',
    company: {
      name: 'USWNT',
    },
  },
};
