// /components/AccountDialog.tsx
"use client";
import React, { useState } from 'react';
import { FaUser, FaTrash } from 'react-icons/fa';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, } from "@/components/ui/alert-dialog";
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';


const AccountDialog: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        // Call the API route to delete user data, disconnect from Plaid, and delete from Clerk authentication
        await fetch(`/api/plaid-actions?action=deleteAccount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        // Show a success toast
        toast({
          title: 'Success',
          description: 'Account deleted successfully.',
        });

        // Redirect to the home page
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete account. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (user) {
      try {
        await user.updatePassword({
          newPassword: newPassword,
          currentPassword: currentPassword,
        });
        toast({
          title: 'Success',
          description: 'Password changed successfully.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOpen(false);
      } catch (error) {
        console.error('Error changing password:', error);
        // Log the error object
        console.log('Error object:', error);
        toast({
          title: 'Error',
          description: 'Failed to change password. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center py-6 px-8 text-gray-800 hover:bg-gray-100 transition duration-300 cursor-pointer">
        <FaUser className="mr-6 text-3xl text-yellow-500 md:text-4xl lg:text-5xl" />
        <span className="text-xl md:text-2xl lg:text-3xl">Account settings</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account preferences and personal information.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <Input
            type="password"
            placeholder="Current Password"
            className="mb-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            className="mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            className="mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleSavePassword}>Save Password</Button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <FaTrash className="inline-block mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;