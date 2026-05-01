import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { InvoiceData, CURRENCIES, Template } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: Props) {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      price: 0,
    };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    updateField(
      'items',
      data.items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-8">
      {/* Business Details */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Business Details</h3>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Ngqulunga Logistics"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={data.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Logo URL (e.g. https://...)"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={data.businessLogo || ''}
              onChange={(e) => updateField('businessLogo', e.target.value)}
            />
            <input
              type="email"
              placeholder="info@ngqulungalogistics.co.za"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={data.businessEmail}
              onChange={(e) => updateField('businessEmail', e.target.value)}
            />
            <input
              type="text"
              placeholder="15 Gillitts Rd, Pinetown"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={data.businessAddress}
              onChange={(e) => updateField('businessAddress', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Client Details */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Client Details</h3>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Xolani Matengele"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={data.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3">
            <input
              type="email"
              placeholder="Client Email"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={data.clientEmail}
              onChange={(e) => updateField('clientEmail', e.target.value)}
            />
            <input
              type="text"
              placeholder="Client Address"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={data.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Invoice Meta */}
      <section className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice #</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={data.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </div>
      </section>

      {/* Line Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Line Items</h3>
          <button
            onClick={addItem}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {data.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex gap-2"
              >
                <div className="flex-grow grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    className="col-span-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    className="col-span-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="col-span-8 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 px-3 self-start mt-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Settings */}
      <section className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Currency</label>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none"
            value={data.currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(c => c.code === e.target.value);
              if (selected) updateField('currency', selected);
            }}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tax (%)</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none"
            value={data.taxRate}
            onChange={(e) => updateField('taxRate', parseFloat(e.target.value))}
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {(['modern', 'minimal', 'bauhaus'] as Template[]).map(t => (
              <button
                key={t}
                onClick={() => updateField('template', t)}
                className={cn(
                  "rounded-md border py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                  data.template === t 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Notes</h3>
        <textarea
          placeholder="Additional notes..."
          className="h-24 w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={data.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </section>
    </div>
  );
}
