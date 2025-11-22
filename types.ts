export enum VisitType {
  FirstTime = 'First-Time',
  Returning = 'Returning',
}

// Default constants for initialization and fallback
export const DEFAULT_REASONS = [
  'Pain / Sensitivity',
  'Cleaning / Check-up',
  'Tooth Cavity',
  'Braces / Aligners',
  'Cosmetic Concern',
  'Not Sure / Consultation'
];

export const DEFAULT_SOURCES = [
  'Google Search',
  'Google Ads',
  'Instagram',
  'Facebook',
  'Practo',
  'Google Maps',
  'Friend / Family',
  'Walk-in',
  'Other'
];

// Sources that trigger the Ad Attribution slide
export const AD_SOURCES = ['Google Ads', 'Instagram', 'Facebook'];

export enum AdType {
  Cleaning = 'Teeth Cleaning Ad',
  Braces = 'Braces / Aligners Ad',
  Implants = 'Implants Ad',
  RootCanal = 'Root Canal Ad',
  DontRemember = 'Don\'t Remember',
}

export interface FormOptions {
  reasons: string[];
  sources: string[];
}

export interface PatientFormData {
  visitType?: VisitType;
  fullName: string;
  mobileNumber: string;
  reason?: string;
  leadSource?: string;
  otherSourceDetails?: string;
  adAttribution?: AdType;
}

export interface Patient extends PatientFormData {
  _id: string;
  submittedAt: string;
  status?: string;
}

export interface SlideProps {
  data: PatientFormData;
  updateData: (fields: Partial<PatientFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  options?: string[]; // Added for dynamic options
}