import * as types from '../types';
import * as constants from './constants';
import { PAY_REDUCED_COVID, VERIFICATION_USE_CASES } from '../types';

export const error: types.SDKError = {
  error: {
    message: 'error', // a helpful message, will differ by request
  },
};

// example for a verifications.create() request missing the "type" field
export const errorWithFields: types.SDKError = {
  error: {
    message: 'Invalid field values provided',
    invalid_fields: {
      type: ['This field is required.'],
    },
  },
};

export const company: types.Company = {
  id: '2',
  name: 'USWNT',
};

export const companySearchResult: types.CompanySearchResult = {
  ...company,
  domain: 'https://www.ussoccer.com',
};

export const target: types.Target = {
  first_name: 'Megan',
  last_name: 'Rapinoe',
  social_security_number: '***-**-1234',
  company: company,
  date_of_birth: '2006-01-01',
};

export const credentialsTarget: types.CredentialsTarget = {
  first_name: 'Megan',
  last_name: 'Rapinoe',
  social_security_number: '***-**-1234',
  company: company,
  date_of_birth: '2006-01-01',
  contact_email: 'm@gmail.com',
};

export const document: types.Document = {
  filename: 'hello.pdf',
  content: 'aGVsbG8gd29ybGQ=',
};

export const address: types.Address = {
  line_one: 'U.S. Soccer Federation',
  line_two: '1801 S. Prairie Ave.',
  city: 'Chicago',
  state: 'IL',
  country: 'USA',
  postal_code: '60616',
};

export const employer: types.Employer = {
  name: 'USWNT',
  address,
};

export const position: types.Position = {
  title: 'Midfielder',
  start_date: '2006-01-01',
};

export const price: types.Price = {
  amount: '34.95',
  currency: 'USD',
};

export const respondent: types.Respondent = {
  full_name: 'First Last',
  title: 'Some Title',
};

export const salary: types.Salary = {
  gross_pay: '123456.00',
  pay_frequency: 'annually',
  hours_per_week: '40',
  months_per_year: '4.5',
  reduced_covid: PAY_REDUCED_COVID.NO,
};

export const earning: types.Earnings = {
  year: '2020',
  base: '100000.00',
  bonus: '100000.00',
  commission: '100000.00',
  overtime: '100000.00',
  other: '100000.00',
  total: '500000.00',
};

export const employee: types.Employee = {
  first_name: 'Megan',
  last_name: 'Rapinoe',
  address,
  status: types.EMPLOYEE_STATUSES.ACTIVE,
  social_security_number: '***-**-1234',
  positions: [position],
  earnings: [earning],
  hired_date: '2016-02-11',
  salary,
};

export const turnaroundTime: types.TurnaroundTime = {
  upper_bound: '24',
  lower_bound: '2',
};

export const cancelledVerification: types.Verification = {
  id: constants.VALID_VERIFICATION_ID,
  state: types.VERIFICATION_STATES.CANCELED,
  price,
  turnaround_time: turnaroundTime,
  created: '2020-08-11T15:14:51.444036Z',
  target: target,
  permissible_purpose: types.PERMISSIBLE_PURPOSES.EMPLOYMENT,
  type: types.VERIFICATION_TYPES.VOE,
  documents: [document],
  additional_information: 'Notes about the verification',
  cancellation_reason: types.CANCELLATION_REASONS.OTHER,
  cancellation_details: 'Cancellation in more detail',
  date_of_completion: null,
  use_case: VERIFICATION_USE_CASES.MORTGAGE,
};

export const report: types.ResponseReportGet = {
  id: '1',
  created: '2020-08-11T15:14:51.444036Z',
  current_as_of: new Date().toString(),
  verification_request: {
    type: types.VERIFICATION_TYPES.VOE,
    created: new Date().toString(),
    id: constants.VALID_VERIFICATION_ID,
  },
  employer: employer,
  employee: employee,
  respondent: respondent,
  du_reference_id: '12345',
  additional_notes: 'some free form text',
};

export const verification: types.Verification = {
  id: constants.VALID_VERIFICATION_ID,
  state: types.VERIFICATION_STATES.PENDING_APPROVAL,
  price,
  turnaround_time: turnaroundTime,
  created: '2020-08-11T15:14:51.444036Z',
  target: target,
  permissible_purpose: types.PERMISSIBLE_PURPOSES.EMPLOYMENT,
  type: types.VERIFICATION_TYPES.VOE,
  documents: [document],
  additional_information: 'Notes about the verification',
  date_of_completion: null,
  reports: [report],
  loan_id: '12345',
  use_case: VERIFICATION_USE_CASES.MORTGAGE,
};
