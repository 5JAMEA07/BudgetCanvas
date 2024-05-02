// /components/NotificationsDialog.tsx
"use client";
import React from 'react';
import { FaBell } from 'react-icons/fa';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useData } from '@/context/DataContext';
import { useAuth } from '@clerk/nextjs';

const NotificationsDialog: React.FC = () => {
  const { userId } = useAuth();
  const { notificationEnabled, notificationPercentage, setNotificationEnabled, setNotificationPercentage } = useData();

  const handlePercentageChange = (value: string) => {
    setNotificationPercentage(value);
  };

  const percentageOptions = [
    { value: "30", label: "30%" },
    { value: "50", label: "50%" },
    { value: "70", label: "70%" },
    { value: "100", label: "100%" },
  ];

  const handleEnableNotifications = async (enabled: boolean) => {
    setNotificationEnabled(enabled);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center py-6 px-8 text-gray-800 hover:bg-gray-100 transition duration-300 cursor-pointer">
        <FaBell className="mr-6 text-3xl text-green-500 md:text-4xl lg:text-5xl" />
        <span className="text-xl md:text-2xl lg:text-3xl">Notification settings</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Customize your notification preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Switch checked={notificationEnabled} onCheckedChange={handleEnableNotifications} className="mr-2" />
          <Label htmlFor="notification">Enable Notifications</Label>
        </div>
        <div className="mt-4">
          <Label>Notify me when my budget spent reaches:</Label>
          <RadioGroup value={notificationPercentage} onValueChange={handlePercentageChange} className="mt-2 space-y-2">
            {percentageOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="ml-2">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;