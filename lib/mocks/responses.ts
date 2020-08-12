import * as types from '../types';
import * as objects from './objects';
import { createPaginatedResponse } from './util';

export const verifications = {
  create (data: types.RequestVerificationsCreate) {
    const res: types.Verification = {
      id: objects.verification.id,
      state: objects.verification.state,
      price: objects.verification.price,
      turnaround_time: objects.verification.turnaround_time,
      created: new Date().toString(),
      target: data.target,
      permissible_purpose: data.permissible_purpose,
      type: data.type,
    };

    if (data.documents) {
      res.documents = data.documents;
    }
    if (data.additional_information) {
      res.additional_information = data.additional_information;
    }

    return res;
  },
  get (data: types.RequestVerificationsGet) {
    const v = objects.verification;

    if (data.state) {
      v.state = data.state as types.VERIFICATION_STATES;
    }

    return createPaginatedResponse(v, data);
  },
  getOne ({ id }: { id: string }) {
    return {
      ...objects.verification,
      id: id,
    };
  },
  getReport ({ id }: { id: string }) {
    return {
      ...objects.report,
      verification_request: {
        ...objects.report.verification_request,
        id,
      },
    };
  },
};

export const companies = {
  get (data: types.RequestCompaniesGet) {
    return createPaginatedResponse(objects.companySearchResult, data);
  },
};
