import * as types from '../types';
import * as objects from './objects';

export const verification: types.RequestVerificationsCreate = {
  type: types.VERIFICATION_TYPES.VOE,
  permissible_purpose: types.PERMISSIBLE_PURPOSES.EMPLOYMENT,
  target: objects.target,
  documents: [objects.document],
  additional_information: 'Some more info',
};
