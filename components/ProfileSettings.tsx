// /components/ProfileSettings.tsx
"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';
import LinkedAccountsDialog from './LinkedAccountsDialog';
import NotificationsDialog from './NotificationsDialog';
import AccountDialog from './AccountDialog';

const ProfileSettings: React.FC = () => {
  const { user } = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  const joinedDate = user.createdAt ? new Date(user.createdAt) : null;
  const joinedMonthYear = joinedDate ? `${joinedDate.toLocaleString('default', { month: 'long' })} ${joinedDate.getFullYear()}` : 'Unknown';

  return (
    <div className="bg-image rounded-lg shadow-md overflow-hidden md:flex">
      <div className="md:w-1/3 lg:w-1/4 relative">
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-full h-64 object-cover md:h-auto"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 md:p-6">
          <h2 className="text-2xl font-semibold text-white md:text-3xl lg:text-4xl">
            {user.firstName} {user.lastName}
          </h2>
          <span className="text-sm text-gray-300 md:text-base lg:text-lg">
            Member since {joinedMonthYear}
          </span>
        </div>
      </div>
      <div className="md:w-2/3 lg:w-3/4">
        <ul className="divide-y divide-gray-200">
          <li>
            <LinkedAccountsDialog />
          </li>
          <li>
            <NotificationsDialog />
          </li>
          <li>
            <AccountDialog />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSettings;