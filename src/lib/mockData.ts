
export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: 'personal' | 'work' | 'finance' | 'social' | 'other';
  favorite: boolean;
  lastUpdated: string;
  strengthScore: number;
}

export const mockPasswords: PasswordEntry[] = [
  {
    id: '1',
    title: 'Gmail Account',
    username: 'user@gmail.com',
    password: 'P@ssw0rd123!',
    url: 'https://gmail.com',
    category: 'personal',
    favorite: true,
    lastUpdated: '2023-12-15T10:30:00Z',
    strengthScore: 70,
  },
  {
    id: '2',
    title: 'Facebook',
    username: 'user.name',
    password: 'Fb4c3b00k!',
    url: 'https://facebook.com',
    category: 'social',
    favorite: false,
    lastUpdated: '2023-11-05T14:20:00Z',
    strengthScore: 65,
  },
  {
    id: '3',
    title: 'Company Portal',
    username: 'employee.name',
    password: 'CorpAccess2023@',
    url: 'https://company.internal',
    category: 'work',
    favorite: true,
    lastUpdated: '2024-01-10T09:15:00Z',
    strengthScore: 85,
    notes: 'Requires rotation every 90 days',
  },
  {
    id: '4',
    title: 'Bank Account',
    username: '1234567890',
    password: 'S3cur3B@nkPwd!',
    url: 'https://mybank.com',
    category: 'finance',
    favorite: true,
    lastUpdated: '2024-02-01T16:45:00Z',
    strengthScore: 95,
  },
  {
    id: '5',
    title: 'Amazon',
    username: 'user.shop',
    password: 'ShopSafe2023',
    url: 'https://amazon.com',
    category: 'personal',
    favorite: false,
    lastUpdated: '2023-10-20T11:50:00Z',
    strengthScore: 60,
  },
  {
    id: '6',
    title: 'Netflix',
    username: 'user.watch',
    password: 'MovieTime!24',
    url: 'https://netflix.com',
    category: 'personal',
    favorite: true,
    lastUpdated: '2023-12-28T20:10:00Z',
    strengthScore: 70,
  },
  {
    id: '7',
    title: 'Twitter',
    username: 'user_handle',
    password: 'Tw33tM3!',
    url: 'https://twitter.com',
    category: 'social',
    favorite: false,
    lastUpdated: '2023-09-15T15:25:00Z',
    strengthScore: 55,
  },
  {
    id: '8',
    title: 'GitHub',
    username: 'dev.coder',
    password: 'C0d3R3p0$!',
    url: 'https://github.com',
    category: 'work',
    favorite: true,
    lastUpdated: '2024-01-30T08:40:00Z',
    strengthScore: 80,
  },
];

export interface SecurityAlert {
  id: string;
  type: 'weak' | 'reused' | 'breach' | 'outdated';
  message: string;
  affectedItems: string[];
  severity: 'critical' | 'warning' | 'info';
  date: string;
}

export const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'weak',
    message: '2 passwords are considered weak',
    affectedItems: ['5', '7'],
    severity: 'warning',
    date: '2024-05-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'breach',
    message: 'Data breach detected on 1 website you use',
    affectedItems: ['1'],
    severity: 'critical',
    date: '2024-05-10T00:00:00Z',
  },
  {
    id: '3',
    type: 'outdated',
    message: '3 passwords haven\'t been updated in over 1 year',
    affectedItems: ['2', '5', '7'],
    severity: 'info',
    date: '2024-05-12T00:00:00Z',
  },
];

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const mockCategories: Category[] = [
  { id: 'personal', name: 'Personal', icon: 'user', count: 3 },
  { id: 'work', name: 'Work', icon: 'briefcase', count: 2 },
  { id: 'finance', name: 'Finance', icon: 'credit-card', count: 1 },
  { id: 'social', name: 'Social', icon: 'users', count: 2 },
  { id: 'other', name: 'Other', icon: 'more-horizontal', count: 0 },
];
