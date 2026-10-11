import Reveal from "@/components/Reveal";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Proof from "@/components/sections/Proof";
import Services from "@/components/sections/Services";
import Steps from "@/components/sections/Steps";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <Reveal>
      <Header />
      <main>
        <Hero />
        <Proof />
        <Services />
        <Steps />
        <Gallery />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </Reveal>
  );
}
