// user/settings/page.tsx

import ProfileSettings from '@/components/ProfileSettings';
import { NextPage } from "next";
import Navigation from '@/components/Navigation';

const ProfileSettingsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-image p-4 sm:p-6">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSettings />
      </div>
      <Navigation />
    </div>
  );
};

export default ProfileSettingsPage;