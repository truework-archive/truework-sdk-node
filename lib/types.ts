// one of id or name is required
export interface Company {
  id: string;
  name: string;
}

export interface Target {
  first_name: string;
  last_name: string;
  social_security_number: string;
  contact_email?: string;
  company: Pick<Company, 'id'> | Pick<Company, 'name'> | Company;
}

export interface Document {
  filename: string;
  content: string;
}

export interface VerificationRequest {
  type: string;
  permissible_purpose: string;
  target: Target;
  documents?: Document[];
  additional_information?: string;
}
