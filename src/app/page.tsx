import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-black">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        {/* We can add more sections like Testimonials or FAQ if needed */}
      </main>
      <Footer />
    </div>
  );
}
