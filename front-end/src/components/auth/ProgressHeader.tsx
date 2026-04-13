export default function ProgressHeader({ 
  title = "Company Information", 
  subtitle = "Tell us about your culinary business.", 
  step = "1" 
}) {
  const isStep2 = step === "2";

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface">{title}</h2>
          <p className="text-on-surface-variant">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Step {step} of 2
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: isStep2 ? '100%' : '50%' }}
        />
      </div>
    </div>
  );
}