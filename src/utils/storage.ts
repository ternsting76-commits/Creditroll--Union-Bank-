import { UserAccount, Transaction, ServiceRequest } from '../types/index.ts';

const STORAGE_KEY_USER = 'credroll_user_account_v2';
const STORAGE_KEY_TXNS = 'credroll_transactions_v2';
const STORAGE_KEY_REQUESTS = 'credroll_service_requests_v2';

export const AMELIA_AVATAR = '/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg';

export const INITIAL_USER: UserAccount = {
  name: 'Amelia Robert',
  accountNumber: 'CR-774902194',
  routingNumber: '021000021',
  swiftBic: 'CREDDIS1XXX',
  tier: 'Premier Corporate Platinum',
  role: 'Corporate',
  avatar: AMELIA_AVATAR,
  email: 'amelia.robert@credroll.com',
  phone: '+45 924 03018',
  balance: 4990000.00,
  credits: 54406586.00,
  debits: 49416586.00,
  currency: 'USD',
  hasBiometrics: true,
  biometricType: 'Both',
  card: {
    cardNumber: '4832 9901 2345 8892',
    cardHolder: 'AMELIA ROBERT',
    expiry: '09/29',
    cvv: '714',
    isFrozen: false,
    type: 'Corporate Visa',
    color: 'crimson',
    spendingLimit: 250000,
    onlinePaymentsEnabled: true,
    internationalEnabled: true,
  },
  inboxUnreadCount: 3,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    sn: 1,
    id: 'TXN-902181',
    amount: 500000,
    type: 'debit',
    description: 'Phone / Office equipment',
    date: 'Today, 02:14 PM',
    category: 'Equipment',
    reference: 'REF-TECH-001',
    status: 'Completed',
    beneficiary: 'Global Apple Distr.',
    bankName: 'Credroll Union',
  },
  {
    sn: 2,
    id: 'TXN-902180',
    amount: 500000,
    type: 'debit',
    description: 'Travel & Global Logistics',
    date: 'Yesterday, 10:45 AM',
    category: 'Travel',
    reference: 'REF-FLIGHT-998',
    status: 'Completed',
    beneficiary: 'Lufthansa Executive',
    bankName: 'Deutsche Bank AG',
  },
  {
    sn: 3,
    id: 'TXN-902179',
    amount: 500000,
    type: 'debit',
    description: 'Consulting Retainer Q4',
    date: 'Nov 09, 2026',
    category: 'Professional Services',
    reference: 'REF-CONS-449',
    status: 'Completed',
    beneficiary: 'Bain & Partners Inc.',
    bankName: 'Chase Bank',
  },
  {
    sn: 4,
    id: 'TXN-902178',
    amount: 2600000,
    type: 'credit',
    description: 'Real estate housing dividend',
    date: 'Nov 08, 2026',
    category: 'Real Estate',
    reference: 'REF-RE-9921',
    status: 'Completed',
    beneficiary: 'Amelia Robert Trust',
    bankName: 'Barclays Private',
  },
  {
    sn: 5,
    id: 'TXN-902177',
    amount: 1450000,
    type: 'debit',
    description: 'Insurance premium annual',
    date: 'Nov 05, 2026',
    category: 'Insurance',
    reference: 'REF-INS-3312',
    status: 'Completed',
    beneficiary: 'Zurich Financial Services',
    bankName: 'UBS AG Zurich',
  },
  {
    sn: 6,
    id: 'TXN-902176',
    amount: 8000000,
    type: 'debit',
    description: 'Business loan repayment tranche #4',
    date: 'Nov 01, 2026',
    category: 'Loans',
    reference: 'REF-LOAN-880',
    status: 'Completed',
    beneficiary: 'Federal Reserve Syndicate',
    bankName: 'Credroll Credit Union',
  },
  {
    sn: 7,
    id: 'TXN-902175',
    amount: 6250000,
    type: 'debit',
    description: 'Construction/renovation bill',
    date: 'Oct 28, 2026',
    category: 'Capital Expenditure',
    reference: 'REF-CONST-771',
    status: 'Completed',
    beneficiary: 'Skanska Infrastructure',
    bankName: 'Nordea Bank Abp',
  },
  {
    sn: 8,
    id: 'TXN-902174',
    amount: 5800000,
    type: 'debit',
    description: 'Real estate taxes fiscal 2026',
    date: 'Oct 24, 2026',
    category: 'Taxes',
    reference: 'REF-TAX-5521',
    status: 'Completed',
    beneficiary: 'Revenue Commissioner Authority',
    bankName: 'Bank of America',
  },
  {
    sn: 9,
    id: 'TXN-902173',
    amount: 12500000,
    type: 'debit',
    description: 'Mortgage/property payment',
    date: 'Oct 19, 2026',
    category: 'Property',
    reference: 'REF-MORT-1029',
    status: 'Completed',
    beneficiary: 'Manhattan Tower Holdings',
    bankName: 'Citibank N.A.',
  },
  {
    sn: 10,
    id: 'TXN-902172',
    amount: 5000,
    type: 'debit',
    description: 'Phone bill telecommunications',
    date: 'Oct 15, 2026',
    category: 'Utilities',
    reference: 'REF-UTIL-490',
    status: 'Completed',
    beneficiary: 'TDC Global Tel',
    bankName: 'Credroll Credit Union',
  },
  {
    sn: 11,
    id: 'TXN-902171',
    amount: 2000000,
    type: 'debit',
    description: 'Mr William contract money',
    date: 'Oct 12, 2026',
    category: 'Contracts',
    reference: 'REF-CTR-9912',
    status: 'Completed',
    beneficiary: 'William Anderson Esq.',
    bankName: 'Standard Chartered',
  },
  {
    sn: 12,
    id: 'TXN-902170',
    amount: 51806586,
    type: 'credit',
    description: 'Corporate Investment Wire & Equity Yield',
    date: 'Oct 01, 2026',
    category: 'Investment',
    reference: 'REF-INV-00109',
    status: 'Completed',
    beneficiary: 'Vanguard Global Index Fund',
    bankName: 'Credroll International Reserve',
  },
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'SR-1049',
    type: 'Block Card',
    status: 'Completed',
    createdAt: 'Oct 20, 2026',
    details: 'Temporary security pause on secondary virtual card.',
  },
  {
    id: 'SR-1052',
    type: 'Credit Limit Increase',
    status: 'Completed',
    createdAt: 'Nov 02, 2026',
    details: 'Requested expansion of corporate line to $250,000.',
  },
];

export function getStoredUser(): UserAccount {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    const parsed = JSON.parse(data);
    if (parsed.name === 'Amelia Robert' || !parsed.avatar || parsed.avatar.includes('unsplash.com')) {
      parsed.avatar = AMELIA_AVATAR;
    }
    return parsed;
  } catch {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: UserAccount): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user', err);
  }
}

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_TXNS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(txns: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(txns));
  } catch (err) {
    console.error('Failed to save transactions', err);
  }
}

export function getStoredServiceRequests(): ServiceRequest[] {
  if (typeof window === 'undefined') return INITIAL_SERVICE_REQUESTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_SERVICE_REQUESTS));
      return INITIAL_SERVICE_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SERVICE_REQUESTS;
  }
}

export function saveStoredServiceRequests(requests: ServiceRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save service requests', err);
  }
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
  localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_SERVICE_REQUESTS));
}
