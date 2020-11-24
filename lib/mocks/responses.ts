import * as types from '../types';
import * as objects from './objects';
import * as constants from './constants';
import { createPaginatedResponse } from './util';

export const verifications = {
  create (
    data: types.RequestVerificationsCreate
  ): [number, types.ResponseVerificationsCreate | types.SDKError] {
    const success = !!data.type ? true : false;

    const res: types.Verification = {
      id: objects.verification.id,
      state: objects.verification.state,
      price: objects.verification.price,
      turnaround_time: objects.verification.turnaround_time,
      created: new Date().toString(),
      target: data.target,
      permissible_purpose: data.permissible_purpose,
      type: data.type,
      date_of_completion: null,
    };

    if (data.documents) {
      res.documents = data.documents;
    }
    if (data.additional_information) {
      res.additional_information = data.additional_information;
    }

    return [success ? 201 : 400, success ? res : objects.errorWithFields];
  },
  get (data: types.RequestVerificationsGet) {
    const v = objects.verification;

    if (data.state) {
      v.state = data.state as types.VERIFICATION_STATES;
    }

    return createPaginatedResponse(v, data);
  },
  cancel ({
    id,
  }: {
    id: string;
  }): [number, types.ResponseVerificationsCancel | types.SDKError] {
    const success = id !== constants.INVALID_VERIFICATION_ID;

    return [
      success ? 200 : 404,
      success ? '' : objects.error, // empty string is platform default body value
    ];
  },
  getOne ({
    id,
  }: {
    id: string;
  }): [number, types.ResponseVerificationsGetOne | types.SDKError] {
    const success = id !== constants.INVALID_VERIFICATION_ID;

    return [
      success ? 200 : 404,
      success
        ? {
            ...objects.verification,
            id: id,
          }
        : objects.error,
    ];
  },
  getReport ({
    id,
  }: {
    id: string;
  }): [number, types.ResponseReportGet | types.SDKError] {
    const success = id !== constants.INVALID_VERIFICATION_ID;

    return [
      success ? 200 : 404,
      success
        ? {
            ...objects.report,
            verification_request: {
              ...objects.report.verification_request,
              id,
            },
          }
        : objects.error,
    ];
  },
};

export const companies = {
  get (data: types.RequestCompaniesGet) {
    return createPaginatedResponse(objects.companySearchResult, data);
  },
};
