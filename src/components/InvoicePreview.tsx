import React, { useMemo } from 'react';
import { InvoiceData } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface Props {
  data: InvoiceData;
  previewRef?: React.RefObject<HTMLDivElement>;
}

export default function InvoicePreview({ data, previewRef }: Props) {
  const subtotal = useMemo(() => {
    return data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  }, [data.items]);

  const taxAmount = useMemo(() => {
    return subtotal * (data.taxRate / 100);
  }, [subtotal, data.taxRate]);

  const total = subtotal + taxAmount;

  const isBauhaus = data.template === 'bauhaus';
  const isMinimal = data.template === 'minimal';

  return (
    <div 
      ref={previewRef}
      className={cn(
        "aspect-[1/1.414] w-full shadow-2xl transition-all duration-500 flex flex-col",
        isBauhaus ? "p-0" : "p-12",
        isMinimal && "font-mono"
      )}
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a'
      }}
      id="invoice-preview-container"
    >
      {/* Bauhaus Template specific header */}
      {isBauhaus && (
        <div className="flex h-32 text-white" style={{ backgroundColor: '#0f172a' }}>
          <div className="flex flex-1 items-center px-12 text-4xl font-black uppercase tracking-tighter">
            INVOICE
          </div>
          <div className="flex w-32 items-center justify-center text-white" style={{ backgroundColor: '#2563eb' }}>
            <span className="rotate-90 text-[10px] font-bold uppercase tracking-[0.3em]">{data.invoiceNumber}</span>
          </div>
        </div>
      )}

      <div className={cn("flex-1 flex flex-col", isBauhaus && "p-12")}>
        {/* Header */}
        {!isBauhaus && (
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#0f172a' }}>Invoice</h2>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{data.invoiceNumber}</p>
            </div>
            <div className="text-right text-sm">
              {data.businessLogo ? (
                <img 
                  src={data.businessLogo} 
                  alt="Logo" 
                  className="h-12 w-auto ml-auto mb-2 object-contain" 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : (
                <p className="font-bold" style={{ color: '#0f172a' }}>{data.businessName}</p>
              )}
              <p style={{ color: '#64748b' }}>{data.businessEmail}</p>
              <p className="whitespace-pre-line" style={{ color: '#64748b' }}>{data.businessAddress}</p>
            </div>
          </div>
        )}

        {isBauhaus && (
          <div className="mb-12 grid grid-cols-2 gap-12">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>From</p>
              <h3 className="text-lg font-bold uppercase" style={{ color: '#0f172a' }}>{data.businessName}</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.businessEmail}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.businessAddress}</p>
            </div>
            <div className="text-right">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Bill To</p>
              <h3 className="text-lg font-bold uppercase" style={{ color: '#0f172a' }}>{data.clientName}</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.clientEmail}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.clientAddress}</p>
            </div>
          </div>
        )}

        {/* Standard Info for non-bauhaus */}
        {!isBauhaus && (
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Bill To</p>
              <p className="font-bold text-lg" style={{ color: '#1e293b' }}>{data.clientName}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.clientAddress}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{data.clientEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Date</p>
              <p className="font-medium text-sm" style={{ color: '#1e293b' }}>{data.date}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-1" style={{ color: '#94a3b8' }}>Due Date</p>
              <p className="font-medium text-sm" style={{ color: '#1e293b' }}>{data.dueDate}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#0f172a' }}>
                <th className="text-left py-3 font-bold uppercase tracking-wider text-[10px]">Description</th>
                <th className="text-center py-3 font-bold w-16 uppercase tracking-wider text-[10px]">Qty</th>
                <th className="text-right py-3 font-bold w-24 uppercase tracking-wider text-[10px]">Rate</th>
                <th className="text-right py-3 font-bold w-32 uppercase tracking-wider text-[10px]">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-b" style={{ borderColor: '#f1f5f9' }}>
                  <td className="py-4 font-medium" style={{ color: '#1e293b' }}>{item.description || 'Unit'}</td>
                  <td className="py-4 text-center" style={{ color: '#64748b' }}>{item.quantity}</td>
                  <td className="py-4 text-right" style={{ color: '#64748b' }}>{formatCurrency(item.price, data.currency.symbol)}</td>
                  <td className="py-4 text-right font-bold" style={{ color: '#0f172a' }}>
                    {formatCurrency(item.quantity * item.price, data.currency.symbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span className="font-medium" style={{ color: '#1e293b' }}>{formatCurrency(subtotal, data.currency.symbol)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#64748b' }}>Tax ({data.taxRate}%)</span>
              <span className="font-medium" style={{ color: '#1e293b' }}>{formatCurrency(taxAmount, data.currency.symbol)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2" style={{ borderColor: '#0f172a' }}>
              <span className="text-lg font-bold" style={{ color: '#0f172a' }}>Total Due</span>
              <span className="text-2xl font-black" style={{ color: '#2563eb' }}>{formatCurrency(total, data.currency.symbol)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 border-t flex justify-between items-center text-[10px] uppercase tracking-widest font-bold" style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}>
          <div className="flex flex-col gap-1">
            <span>Powered by InvoiceCraft</span>
            {data.notes && <span className="normal-case font-medium italic text-[9px] max-w-xs">{data.notes}</span>}
          </div>
          <span>Ref: {data.invoiceNumber}</span>
        </footer>
      </div>
    </div>
  );
}
