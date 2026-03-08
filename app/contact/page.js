import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us — Geonayan",
  description:
    "Get in touch with Geonayan. Questions about B2B lead generation, pricing, or demos — we're here to help.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <section className="text-center mb-10">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Have questions? We&apos;d love to hear from you.
          </p>
        </section>

        <section className="mb-10 text-center">
          <p className="text-slate-400 text-sm mb-1">
            Email:{" "}
            <a
              href="mailto:camanupandit75@gmail.com"
              className="text-brand-400 hover:text-brand-300 font-medium"
            >
              camanupandit75@gmail.com
            </a>
          </p>
          <p className="text-slate-400 text-sm">Location: India</p>
        </section>

        <section>
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
