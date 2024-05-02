// /components/SignupForm.tsx
"use client";
import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/nextjs';

const SignupForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg">
      {isLogin ? (
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white rounded-lg p-6 mb-8",
              headerTitle: "text-2xl font-bold text-gray-900 mb-4",
              headerSubtitle: "mb-4",
              formFieldLabel: "mb-1",
              formFieldInput: "mt-1 w-full",
              footerActionLink: "text-indigo-600 hover:text-indigo-800 font-bold",
              footerActionText: "text-center",
              formButtonPrimary: "w-full mb-4 bg-[#CBDCE0] hover:bg-[#b3c2c4] text-gray-900 font-bold py-2 px-4 rounded",
              footer: "hidden"
            },
          }}
          afterSignInUrl="/user"
        />
      ) : (
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white rounded-lg p-6 mb-8",
              headerTitle: "text-2xl font-bold text-gray-900 mb-4",
              headerSubtitle: "mb-4",
              formFieldLabel: "mb-1",
              formFieldInput: "mt-1 w-full",
              footerActionLink: "text-[#CBDCE0] hover:text-indigo-800 font-bold",
              footerActionText: "text-center",
              formButtonPrimary: "w-full mb-4 bg-[#CBDCE0] hover:bg-[#b3c2c4] text-gray-900 font-bold py-2 px-4 rounded",
              footer: "hidden"
            },
          }}
          afterSignUpUrl="/user"
        />
      )}
      <p className="ml-6">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[#CBDCE0] hover:text-[#b3c2c4] font-bold"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[#CBDCE0] hover:text-[#b3c2c4] font-bold"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </section>
  );
};

export default SignupForm;
