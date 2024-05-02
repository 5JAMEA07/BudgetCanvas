// /components/Hero.tsx

import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="text-center p-10">
      <h2 className="text-5xl font-bold mb-6">Budgeting? Saving? Investing?</h2>
      <p className="text-xl  mb-8">Discover tools for every financial goal!</p>
      <div className="relative w-full mx-auto mb-8">
        <Image
          src="/image/image.webp"
          alt="Hero"
          width={900}
          height={600}
        />
      </div>
      
    </section>
  );
};

export default Hero;
