// app/page.tsx

import Hero from '@/components/Hero';
import SignupForm from '@/components/SignupForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-image bg-cover flex flex-col">
      <header className="bg-cover bg-fixed bg-image shadow-lg">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    <h1 className="text-4xl font-bold text-[#4d5354] drop-shadow-md">Budget Canvas</h1>
    <button className="bg-[#CBDCE0] hover:bg-[#b3c2c4] text-gray-900 font-bold py-2 px-4 rounded">
      Get Started
    </button>
  </div>
</header>

      <main className="flex-grow">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 mb-8 sm:mb-0 sm:mr-8">
              <Hero />
            </div>
            <div className="w-full sm:w-1/2 p-6 bg-white rounded-lg shadow-md">
              <SignupForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
