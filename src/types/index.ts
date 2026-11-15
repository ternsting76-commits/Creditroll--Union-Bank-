export interface Transaction {
  sn: number;
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  date: string;
  category: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Processing';
  beneficiary?: string;
  bankName?: string;
}

export interface BankCard {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  type: 'Corporate Visa' | 'Platinum Mastercard' | 'Black Diamond';
  color: 'crimson' | 'navy' | 'gold' | 'emerald';
  spendingLimit: number;
  onlinePaymentsEnabled: boolean;
  internationalEnabled: boolean;
}

export interface UserAccount {
  name: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  tier: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  balance: number;
  credits: number;
  debits: number;
  currency: string;
  hasBiometrics: boolean;
  biometricType: 'Face ID' | 'Touch ID' | 'Both' | 'None';
  card: BankCard;
  inboxUnreadCount: number;
}

export interface TransferPayload {
  recipientName: string;
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  amount: number;
  description: string;
  category: string;
  requireBiometric: boolean;
}

export interface ServiceRequest {
  id: string;
  type: 'Block Card' | 'Generate PIN' | 'Unlock Card' | 'Reissue Card' | 'Account Statement' | 'Credit Limit Increase';
  status: 'Submitted' | 'In Review' | 'Completed';
  createdAt: string;
  details: string;
}
