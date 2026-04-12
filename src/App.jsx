import Cursor from '@/components/Cursor/Cursor'
import Navbar from '@/components/layout/navbar/Navbar'
import Footer from '@/components/layout/footer/Footer'
import Hero from '@/components/sections/hero/Hero'
import About from '@/components/sections/about/About'
import Services from '@/components/sections/services/Services'
import GoogleReviews from '@/components/sections/googleReviews/GoogleReviews'
import Gallery from '@/components/sections/gallery/Gallery'
import ContactForm from '@/components/sections/contactForm/ContactForm'
import './App.css'

function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <GoogleReviews />
      <Gallery />
      <ContactForm />
      <Footer />
    </>
  )
}

export default App
