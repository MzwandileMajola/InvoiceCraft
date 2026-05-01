/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Download, Save, RefreshCcw, Moon, Sun, Monitor, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { InvoiceData, INITIAL_INVOICE_DATA } from './types';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('invoice_data');
    if (!saved) return INITIAL_INVOICE_DATA;
    try {
      const parsed = JSON.parse(saved);
      // Migration: Force update if using old default business or client names
      if (
        parsed.businessName === 'Your Business' || 
        parsed.businessName === 'Majola Tech Solutions' ||
        parsed.clientName === 'Future Client'
      ) {
        return INITIAL_INVOICE_DATA;
      }
      return { ...INITIAL_INVOICE_DATA, ...parsed }; // Merge to ensure new fields are present
    } catch {
      return INITIAL_INVOICE_DATA;
    }
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('invoice_data', JSON.stringify(invoice));
  }, [invoice]);

  const resetInvoice = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      setInvoice(INITIAL_INVOICE_DATA);
    }
  };

  const exportPDF = async () => {
    if (!previewRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // Higher quality
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300 font-sans",
      isDarkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
    )}>
      {/* Navigation / Header */}
      <nav className={cn(
        "z-50 flex items-center justify-between border-b px-6 py-3 shrink-0",
        isDarkMode ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <Monitor size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">InvoiceCraft</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-2 rounded-md transition-colors",
              isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
            )}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={resetInvoice}
            className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            Reset
          </button>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50",
              "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            )}
          >
            {isExporting ? <RefreshCcw className="animate-spin" size={14} /> : <Download size={14} />}
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Editor */}
        <aside className={cn(
          "w-[400px] flex flex-col h-full border-r shrink-0",
          isDarkMode ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
        )}>
          <div className="flex-1 overflow-y-auto px-6 py-8 hide-scrollbar">
            <header className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-1">Editor</h2>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-slate-400" : "text-slate-500"
              )}>Configure your invoice details.</p>
            </header>
            
            <InvoiceForm data={invoice} onChange={setInvoice} />
          </div>

          <footer className={cn(
            "p-6 border-t",
            isDarkMode ? "border-white/10 bg-slate-950" : "bg-slate-50 border-slate-200"
          )}>
            <div className="flex justify-between mb-4">
              <span className={cn("text-sm", isDarkMode ? "text-slate-400" : "text-slate-500")}>Total Due</span>
              <span className="text-sm font-bold text-blue-600">
                {invoice.currency.symbol}{(invoice.items.reduce((a, b) => a + (b.quantity * b.price), 0) * (1 + invoice.taxRate/100)).toLocaleString()}
              </span>
            </div>
            <button
              onClick={exportPDF}
              disabled={isExporting}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50",
                isExporting && "cursor-not-allowed"
              )}
            >
              {isExporting ? <RefreshCcw className="animate-spin" size={16} /> : <Download size={16} />}
              {isExporting ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </footer>
        </aside>

        {/* Right Pane: Preview */}
        <div className={cn(
          "flex-1 h-full overflow-y-auto p-12 bg-slate-200 relative scroll-smooth",
          isDarkMode && "bg-slate-800"
        )}>
          <div className="sticky top-0 z-10 mb-8 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                Live Preview
              </div>
              <div className={cn("text-[10px] uppercase font-bold tracking-wider", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                Template: <span className={isDarkMode ? "text-white" : "text-slate-800"}>{invoice.template}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center pb-20">
            <div className="w-full max-w-[800px] shadow-2xl">
              <InvoicePreview data={invoice} previewRef={previewRef} />
            </div>

            {/* Attribution Footer */}
            <footer className="mt-12 w-full max-w-[800px] flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <span>Powered by InvoiceCraft</span>
              <a href="https://mzwandile-majola.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                Developed by Mzwandile Majola
              </a>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
