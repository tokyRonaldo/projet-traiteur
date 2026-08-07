// components/home/BecomeCatererCTA.tsx
import Link from 'next/link';
import { Button } from "../ui/Button";

export default function BecomeCatererCTA() {
  return (
    <section id="how-it-works" className="py-12 px-6">
      <div className="max-w-7xl mx-auto bg-primary rounded-[2rem] p-12 lg:p-20 relative overflow-hidden text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Vous êtes traiteur ?</h2>
          <p className="text-xl opacity-90 mb-10">
            Rejoignez Caterly pour développer votre activité, toucher de nouveaux clients et gérer
            vos réservations en un seul endroit.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/register/caterer">Commencer à vendre</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/#categories">En savoir plus</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}