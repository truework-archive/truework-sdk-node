/* ----- CONSTS ----- */

export enum CANCELLATION_REASONS {
  IMMEDIATE = 'immediate',
  HIGH_TURNAROUND_TIME = 'high-turnaround-time',
  COMPETITOR = 'competitor',
  WRONG_INFO = 'wrong-info',
  OTHER = 'other',
}

export enum VERIFICATION_STATES {
  PENDING_APPROVAL = 'pending-approval',
  ACTION_REQUIRED = 'action-required',
  INVALID = 'invalid',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum PERMISSIBLE_PURPOSES {
  CHILD_SUPPORT = 'child-support',
  CREDIT_APPLICATION = 'credit-application',
  EMPLOYEE_ELIGIBILITY = 'employee-eligibility',
  EMPLOYEE_REQUEST = 'employee-request',
  EMPLOYEE_REVIEW_OR_COLLECTION = 'employee-review-or-collection',
  EMPLOYMENT = 'employment',
  INSURANCE_UNDERWRITING_APPLICATION = 'insurance-underwriting-application',
  LEGITIMATE_REASON_INITIATED = 'legitimate-reason-initiated',
  LEGITIMATE_REASON_REVIEW = 'legitimate-reason-review',
  RISK_ASSESSMENT = 'risk-assessment',
  SUBPOENA = 'subpoena',
}

/* ----- GENERICS ----- */

export type PaginatedResponse<T> = {
  results: T[];
  next?: string;
  previous?: string;
  count: number;
};

/* ----- REQUESTS ----- */

export type RequestVerificationsGet = {
  state?: VERIFICATION_STATES;
  offset?: number;
  limit?: number;
};
export type RequestVerificationsGetOne = {
  id: string;
};
export type RequestVerificationsCancel = {
  id: string;
  cancellationReason: CANCELLATION_REASONS;
  cancellationDetails?: string;
};
export type RequestVerificationsCreate = {
  type: string;
  permissible_purpose: PERMISSIBLE_PURPOSES;
  target: Target;
  documents?: Document[];
  additional_information?: string;
};
export type RequestVerificationsGetReport = {
  id: string;
};
export type RequestCompaniesGet = {
  query: string;
  offset?: number;
  limit?: number;
};

/* ----- RESPONSES ----- */

export type ResponseVerificationsCreate = Verification;
export type ResponseVerificationsGet = PaginatedResponse<Verification>;
export type ResponseVerificationsGetOne = Verification;
export type ResponseReportGet = {
  created?: string;
  current_as_of?: string;
  verification_request: ReportVerificationRequest;
  employer: Employer;
  employee: Employee;
};
export type ResponseCompaniesGet = PaginatedResponse<CompanySearchResult>;

/* ----- OTHER TYPES - ALPHABETICAL ----- */

export interface Address {
  line_one: string;
  line_two: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface CompanySearchResult {
  id: string;
  name: string;
  domain?: string;
}

export interface Document {
  filename: string;
  content: string;
}

export interface Earnings {
  year: string;
  base: string;
  overtime: string;
  commission: string;
  bonus: string;
  total: string;
}

export interface Employee {
  first_name: string;
  last_name: string;
  address: Address;
  status: 'active' | 'inactive' | 'unknown';
  start_date: string;
  termination_date: string;
  social_security_number: string;
  earnings: Earnings[];
  positions: Position[];
  salary: Salary;
}

export interface Employer {
  name: string;
  address: Address;
}

export interface Position {
  title: string;
  start_date: string;
  employment_type:
    | 'regular-full-time'
    | 'regular-part-time'
    | 'contractor'
    | 'other';
}

export interface Price {
  amount: string;
  currency: string;
}

export type ReportVerificationRequest = {
  type: string;
  created: string;
  id: string;
};

export interface Salary {
  gross_pay: string;
  pay_frequency: string;
  hours_per_week: string;
}

export interface Target {
  first_name: string;
  last_name: string;
  social_security_number: string;
  contact_email?: string;
  company: Pick<Company, 'id'> | Pick<Company, 'name'> | Company; // one of id or name is required
}

export interface TurnaroundTime {
  upper_bound?: string;
  lower_bound?: string;
}

export interface Verification {
  id: string;
  state: string;
  price: Price;
  turnaround_time: TurnaroundTime;
  created: string;
  target: Target;
  permissible_purpose: PERMISSIBLE_PURPOSES;
  type: string;
  documents?: Document[];
  additional_information?: string;
  cancellation_reason?: CANCELLATION_REASONS;
  cancellation_details?: string;
}
