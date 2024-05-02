// /components/Navigation.tsx
import React from 'react';
import Link from 'next/link';
import { FaHome, FaChartPie, FaCog } from 'react-icons/fa';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <Link href="/user">
            <div className="flex flex-col items-center justify-center py-2 px-4 text-gray-500 hover:text-[#4f99a9] transition duration-300">
              <FaHome className="text-2xl" />
              <span className="text-xs font-semibold mt-1">Home</span>
            </div>
          </Link>
          <Link href="/user/budget-details">
            <div className="flex flex-col items-center justify-center py-2 px-4 text-gray-500 hover:text-[#4f99a9] transition duration-300">
              <FaChartPie className="text-2xl" />
              <span className="text-xs font-semibold mt-1">Budget</span>
            </div>
          </Link>
          <Link href="/user/settings">
            <div className="flex flex-col items-center justify-center py-2 px-4 text-gray-500 hover:text-[#4f99a9] transition duration-300">
              <FaCog className="text-2xl" />
              <span className="text-xs font-semibold mt-1">Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;