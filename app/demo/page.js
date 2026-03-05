import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "./DemoForm";

export const metadata = {
  title: "Request a Demo — Geonayan",
  description:
    "Book a free demo of Geonayan. See how to find B2B leads from Google Maps with phone numbers, emails, and AI scoring.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <section className="text-center mb-10">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-4 tracking-tight">
            See Geonayan in Action
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Book a free demo and see how Geonayan can help your business find clients faster.
          </p>
        </section>

        <section>
          <DemoForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

