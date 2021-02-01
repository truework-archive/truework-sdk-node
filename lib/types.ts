/*
 * Enums
 */
export enum VERIFICATION_TYPES {
  VOI = 'employment-income',
  VOE = 'employment',
}
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
export enum EMPLOYEE_STATUSES {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNKNOWN = 'unknown',
  FURLOUGHED_COVID = 'furloughed-covid',
  NON_EMPLOYEE = 'non-employee',
}
export enum PAY_REDUCED_COVID {
  YES = 'yes',
  NO = 'no',
  UNKNOWN = 'unknown',
}

/*
 * Generics
 */
export type PaginatedResponse<T> = {
  results: T[];
  next?: string;
  previous?: string;
  count: number;
};

/*
 * Requests method shapes
 */
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
  type: VERIFICATION_TYPES;
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

/*
 * API Responses
 */
export type ResponseVerificationsCreate = Verification;
export type ResponseVerificationsGet = PaginatedResponse<Verification>;
export type ResponseVerificationsGetOne = Verification;
export type ResponseVerificationsCancel = string;
export type ResponseReportGet = {
  created: string;
  current_as_of?: string;
  verification_request: ReportVerificationRequest;
  employer: Employer;
  employee: Employee;
  additional_notes?: string;
  respondent?: Respondent;
};
export type ResponseCompaniesGet = PaginatedResponse<CompanySearchResult>;

/*
 * Errors
 */
export type InvalidFields = { [field: string]: InvalidFields | string[] };
export type SDKError = {
  error: {
    message: string;
    invalid_fields?: InvalidFields;
  };
};

/**
 * Other - alphabetical
 */
export type Address = {
  line_one: string;
  line_two: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};
export type Company = {
  id: string;
  name: string;
};
export type CompanySearchResult = {
  id: string;
  name: string;
  domain?: string;
};
export type Document = {
  filename: string;
  content: string;
};
export type Earnings = {
  year: string;
  base: string;
  overtime: string;
  commission: string;
  bonus: string;
  other: string;
  total: string;
};
export type Employee = {
  first_name: string;
  last_name: string;
  address: Address;
  status: EMPLOYEE_STATUSES;
  hired_date?: string;
  termination_date?: string;
  social_security_number: string;
  earnings?: Earnings[];
  positions: Position[];
  salary: Salary;
};
export type Employer = {
  name: string;
  address: Address;
};
export type Position = {
  title: string;
  start_date: string;
  employment_type?:
    | 'regular-full-time'
    | 'regular-part-time'
    | 'contractor'
    | 'other'
    | 'no-answer';
};
export type Price = {
  amount: string;
  currency: string;
};
export type ReportVerificationRequest = {
  type: VERIFICATION_TYPES;
  created: string;
  id: string;
};
export type Respondent = {
  full_name?: string;
  title?: string;
};
export type Salary = {
  gross_pay: string;
  pay_frequency: string;
  hours_per_week: string;
  reduced_covid?: PAY_REDUCED_COVID;
};
export type Target = {
  first_name: string;
  last_name: string;
  social_security_number: string;
  contact_email?: string;
  company: Pick<Company, 'id'> | Pick<Company, 'name'> | Company; // one of id or name is required
};
export type TurnaroundTime = {
  upper_bound?: string;
  lower_bound?: string;
};
export type Verification = {
  id: string;
  state: string;
  price: Price;
  turnaround_time: TurnaroundTime;
  created: string;
  target: Target;
  permissible_purpose: PERMISSIBLE_PURPOSES;
  type: VERIFICATION_TYPES;
  date_of_completion: string | null;
  documents?: Document[];
  additional_information?: string;
  cancellation_reason?: CANCELLATION_REASONS;
  cancellation_details?: string;
};
