"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  subitens?: MenuItem[];
}

export default function MobileMenu({ items }: { items: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleSubmenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if they just want to open the submenu
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu}
        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="Alternar menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[calc(100vh-64px)] z-50 animate-fade-in-up">
          <nav className="flex flex-col p-4 space-y-2">
            {items?.map((item) => (
              <div key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 pb-2 last:pb-0">
                <div className="flex items-center justify-between">
                  <Link 
                    href={item.url}
                    onClick={() => { if (!item.subitens?.length) setIsOpen(false); }}
                    className="flex-1 py-3 text-lg font-medium text-slate-800 dark:text-slate-200"
                  >
                    {item.label}
                  </Link>
                  {item.subitens && item.subitens.length > 0 && (
                    <button 
                      onClick={(e) => toggleSubmenu(item.id, e)}
                      className="p-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {item.subitens && item.subitens.length > 0 && openSubmenu === item.id && (
                  <div className="pl-4 pb-2 space-y-1 mt-1 border-l-2 border-blue-500/30 ml-2">
                    {item.subitens.map((sub) => (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        onClick={() => setIsOpen(false)}
                        className="block py-2.5 px-4 text-base text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
