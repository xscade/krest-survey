export enum VisitType {
  FirstTime = 'First-Time',
  Returning = 'Returning',
}

export enum ReasonForVisit {
  Pain = 'Pain / Sensitivity',
  Cleaning = 'Cleaning / Check-up',
  Cavity = 'Tooth Cavity',
  Braces = 'Braces / Aligners',
  Cosmetic = 'Cosmetic Concern',
  NotSure = 'Not Sure / Consultation',
}

export enum LeadSource {
  GoogleSearch = 'Google Search',
  GoogleAds = 'Google Ads',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Practo = 'Practo',
  GoogleMaps = 'Google Maps',
  FriendFamily = 'Friend / Family',
  WalkIn = 'Walk-in',
  Other = 'Other',
}

export enum AdType {
  Cleaning = 'Teeth Cleaning Ad',
  Braces = 'Braces / Aligners Ad',
  Implants = 'Implants Ad',
  RootCanal = 'Root Canal Ad',
  DontRemember = 'Don\'t Remember',
}

export interface PatientFormData {
  visitType?: VisitType;
  fullName: string;
  mobileNumber: string;
  reason?: ReasonForVisit;
  leadSource?: LeadSource;
  otherSourceDetails?: string;
  adAttribution?: AdType;
}

export interface SlideProps {
  data: PatientFormData;
  updateData: (fields: Partial<PatientFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}