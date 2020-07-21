/* ----- RESPONSES ----- */

export interface ListVerificationsResponse {
  results: VerificationRequestData[]
  next?: string
  previous?: string
  count: number
}

export interface RetrieveReportResponse {
  created?: string
  current_as_of?: string
  verification_request: VerificationRequestSnippet
  employer: Employer
  employee: Employee
}

export interface RetrieveVerificationResponse {
  id: string
  created: string
  type: string
  permissible_purpose: string
  state: string
  target: Target
  price: Price
  turnaround_time: TurnaroundTime
  documents: Document[]
  additional_information: string
}

/* ----- Other types - alphabetical ----- */

export interface Address {
  line_one: string
  line_two: string
  city: string
  state: string
  country: string
  postal_code: string
}

export interface Company {
  id: string // one of id or name is required
  name: string
}

export interface Document {
  filename: string
  content: string
}

export interface Earnings {
  year: string
  base: string
  overtime: string
  commission: string
  bonus: string
  total: string
}

export interface Employee {
  first_name: string
  last_name: string
  address: Address
  status: string // active, inactive, unknown
  start_date: string
  termination_date: string
  social_security_number: string
  earnings: Earnings[]
  positions: Position[]
  salary: Salary
}

export interface Employer {
  name: string
  address: Address
}

export interface Position {
  title: string
  start_date: string
  employment_type: string // regular-full-time, regular-part-time, contractor, other
}

export interface Price {
  amount: string
  currency: string
}

export interface Salary {
  gross_pay: string
  pay_frequency: string
  hours_per_week: string
}

export interface Target {
  first_name: string
  last_name: string
  social_security_number: string
  contact_email?: string
  company: Pick<Company, 'id'> | Pick<Company, 'name'> | Company
}

export interface TurnaroundTime {
  upper_bound?: string
  lower_bound?: string
}

export interface VerificationRequest {
  type: string
  permissible_purpose: string
  target: Target
  documents?: Document[]
  additional_information?: string
}

export interface VerificationRequestData {
  id: string
  created: string
  type: string
  permissible_purpose: string
  state: string
  cancellation_reason?: string
  cancellation_details?: string
  target: Target
  price: Price
  turnaround_time: TurnaroundTime
  documents?: Document[]
}

export interface VerificationRequestSnippet {
  type: string
  created: string
  id: string
}
