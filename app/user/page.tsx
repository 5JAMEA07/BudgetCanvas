// app/user/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import TotalBalance from '@/components/TotalBalance';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@clerk/nextjs';
import IncomeExpenses from '@/components/IncomeExpenses';
import Statistics from '@/components/Statistics';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#bfdae0] mb-4" />
    </div>
  </div>
);

const ConnectBankPrompt = ({ onConnectClick }: { onConnectClick: () => void }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Connect Your Bank Account</h2>
      <button
        onClick={onConnectClick}
        className="bg-[#359ab1] hover:bg-[#9cc3cb] text-white font-bold py-2 px-4 rounded"
      >
        Connect with Plaid
      </button>
    </div>
  </div>
);

const DisclaimerModal = ({ onAgree, onDisagree }: { onAgree: () => void; onDisagree: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
      <p className="mb-4">
        By connecting your bank account, you agree to our terms and conditions.
        We will retrieve your transaction data to link your created budget with transactions.
      </p>
      <div className="flex justify-end">
        <button
          onClick={onDisagree}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Disagree
        </button>
        <button
          onClick={onAgree}
          className="bg-[#359ab1] hover:bg-[#9cc3cb] text-white font-bold py-2 px-4 rounded"
        >
          Agree
        </button>
      </div>
    </div>
  </div>
);

export default function UserPage() {
  const { user } = useUser();
  const userId = user?.id;
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const [linkToken, setLinkToken] = useState('');
  const { setAccessToken, setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken: string) => {
      try {
        const response = await fetch(`/api/plaid-actions?action=exchangePublicToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicToken, userId, userEmail }),
        });
        const { access_token } = await response.json();
        setAccessToken(access_token);
        setIsAuthenticated(true);
        setIsBankConnected(true);
        setIsLoading(false);
        setIsConnecting(false);
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setIsLoading(false);
        setIsConnecting(false);
      }
    },
  });

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(`/api/firebase-actions?userId=${userId}`);
        const { accessToken, isBankConnected } = await response.json();
        if (accessToken && isBankConnected) {
          setAccessToken(accessToken);
          setIsAuthenticated(true);
          setIsBankConnected(true);
        } else {
          setShowDisclaimer(true);
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userEmail) {
      fetchAccessToken();
    }
  }, [userId, userEmail]);

  const handleDisclaimerAgree = async () => {
    setDisclaimerAgreed(true);
    setShowDisclaimer(false);
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/plaid-actions?action=createLinkToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const { link_token } = await response.json();
      setLinkToken(link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
      setIsLoading(false);
      setIsConnecting(false);
    }
  };

  const handleDisclaimerDisagree = () => {
    setDisclaimerAgreed(false);
    setShowDisclaimer(false);
  };

  const handleConnectPlaid = () => {
    if (disclaimerAgreed) {
      handleDisclaimerAgree();
    } else {
      setShowDisclaimer(true);
    }
  };

  useEffect(() => {
    if (ready && linkToken) {
      open();
    }
  }, [ready, linkToken, open]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (showDisclaimer) {
    return (
      <DisclaimerModal
        onAgree={handleDisclaimerAgree}
        onDisagree={handleDisclaimerDisagree}
      />
    );
  }

  if (!isBankConnected) {
    if (isConnecting) {
      return <LoadingSpinner />;
    } else {
      return <ConnectBankPrompt onConnectClick={handleConnectPlaid} />;
    }
  }

  return (
    <div className="mb-4">
      <TotalBalance />
      <IncomeExpenses />
      <Statistics />
    </div>
  );
}