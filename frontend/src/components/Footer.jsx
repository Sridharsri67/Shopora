import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-8 text-neutral-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} Shopora E-Commerce. All rights reserved.
        </div>
        <div className="flex gap-6">
          <span>PostgreSQL</span>
          <span>Express</span>
          <span>React</span>
          <span>Redis</span>
          <span>BullMQ</span>
          <span>Stripe</span>
        </div>
      </div>
    </footer>
  );
}
