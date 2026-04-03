export default function LeftBrandingSection() {
  return (
    <div className="lg:col-span-5 lg:sticky top-28 space-y-8">
      <div className="space-y-4">
        <span className="text-primary font-bold tracking-widest text-xs uppercase">
          Join the Marketplace
        </span>
        <h1 className="text-5xl font-black text-on-surface leading-none tracking-tighter">
          Bring your <span className="text-primary">culinary magic</span> to the world.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-sm">
          Share your heritage, craft, and passion with thousands of local hosts looking for extraordinary dining experiences.
        </p>
      </div>
      <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-xl rotate-1">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpxi1DSjLS1apx3_adNhAO5piIDV17NP1wlGJQCz21DO502VSpEFr12QjqmKoOc9WjknNf2KOa4ti5bQQwjdGt3fwIsKpKChrl-0WFPuTjJf7trEyWRh5_jpRzRXwETfazjCAqInPapG3HpZeEWTvXSlAfaACWqSsBCWUN9Pve91rfwVN4Vbmfi03tS-pm6H5kQWnZemZwy97QgePo2Oc9ZaKbaXuIG2ngabtJNoQgydho1gEuUzQTXXh0qXWqAVaZ264mSYTQonoX" 
          alt="Artisan gourmet catering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/80 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>
              stars
            </span>
            <span className="text-sm font-bold text-on-surface">
              Trusted by 500+ Premium Caterers
            </span>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-surface-container-high p-6 rounded-xl border-l-4 border-primary italic text-on-surface-variant">
        "Saffron Hearth transformed my small boutique catering service into a premier local brand. The registration was seamless."
        <div className="mt-2 not-italic font-bold text-on-surface text-sm">
          — Chef Elena Rossi
        </div>
      </div>
    </div>
  );
}