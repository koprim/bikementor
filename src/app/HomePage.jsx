import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import Prestations from '../components/sections/Prestations.jsx';
import About from '../components/sections/About.jsx';
import Contact from '../components/sections/Contact.jsx';
import Reviews from '../components/sections/Reviews.jsx';

export default function HomePage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-accent-fg)]">
        Aller au contenu
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Prestations />
        <About />
        <Contact />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
