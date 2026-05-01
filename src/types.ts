export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export type Currency = {
  code: string;
  symbol: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'ZAR', symbol: 'R' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
];

export type Template = 'modern' | 'minimal' | 'bauhaus';

export interface InvoiceData {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessLogo?: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  currency: Currency;
  taxRate: number;
  notes: string;
  template: Template;
}

export const INITIAL_INVOICE_DATA: InvoiceData = {
  businessName: 'Ngqulunga Logistics',
  businessEmail: 'info@ngqulungalogistics.co.za',
  businessAddress: 'Unit 12, Pinetown Industrial Park\n15 Gillitts Rd, Pinetown\nDurban, 3610',
  clientName: 'Xolani Matengele',
  clientEmail: 'xolani@example.co.za',
  clientAddress: '456 Sandton Drive, Johannesburg, 2196',
  invoiceNumber: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  items: [
    { id: '1', description: 'Logistics & Delivery Services', quantity: 1, price: 5000 },
  ],
  currency: CURRENCIES[0],
  taxRate: 15,
  notes: 'Thank you for choosing Ngqulunga Logistics!',
  template: 'modern',
};
