import { Link, useNavigate } from 'react-router-dom';

export default function GoalFoodInput() {
  const navigate = useNavigate();

  const goals = [
    { icon: 'monitoring', label: 'Weight Loss', defaultChecked: true },
    { icon: 'fitness_center', label: 'Muscle Gain', defaultChecked: false },
    { icon: 'eco', label: 'Healthy Eating', defaultChecked: false },
  ];

  const moments = [
    { label: 'Morning', checked: false },
    { label: 'Afternoon', checked: true },
    { label: 'Evening', checked: false },
    { label: 'Late Night', checked: false },
  ];

  return (
    <div className="bg-[#f8faf8] font-body text-[#191c1b] min-h-screen">
      
      {/* ── Top Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-emerald-50/80 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/">
                <span className="text-2xl font-black text-emerald-900 italic font-headline tracking-tight">NutriSense AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Dashboard</Link>
              <Link to="/input" className="text-emerald-700 font-bold border-b-2 border-emerald-600 font-label">Nutrition Log</Link>
              <Link to="/analysis" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">AI Insights</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a3f69c] ring-2 ring-[#0d631b]/10">
               <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwo9jQ2I5_r_cAwaI1cu56J7Xz0bSLXQrRpGp6pYAkVUSq3_6AZn9-I57ufMK6k4_pvJ7eOJEDl7qYH1GHRhak7lGmi2RhaUdb-zN7B1FDxKMjwTzGs7IuChiLsEeRcAIOefr9kWiNyMVrjoa2ZC7Ovd_q8m7zXEvBq8n9qe9iQlZQBzHR-SqXxm0-wM0yFngft2KiFBMcdkS1493ETBqb7Ii6R_z6h-RymBGt-eSlkln1zu8prXmWtLM5m1W4Wo5G_2InGzT12lG" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#191c1b] mb-4">Log Your Harvest</h1>
          <p className="text-[#40493d] text-lg leading-relaxed max-w-2xl font-body">
            Connect with your body's needs. Tell <span className="text-[#0058bc] font-semibold italic">The Living Curator</span> about your recent meal for precision insights.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Main Input Form ─────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* What's on your plate */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(25,28,27,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#0d631b] text-3xl font-light">restaurant</span>
                <h2 className="font-headline text-2xl font-bold">What's on your plate?</h2>
              </div>
              <div className="relative">
                <textarea 
                  className="w-full bg-[#f2f4f2] border-none rounded-2xl p-6 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#0d631b]/30 placeholder:text-[#40493d]/50 resize-none h-40 transition-shadow"
                  placeholder="e.g., A grilled salmon fillet with quinoa, steamed broccoli, and a squeeze of lemon juice." 
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-white hover:bg-[#e1e3e1] p-3 rounded-full transition-colors shadow-sm text-[#40493d]">
                    <span className="material-symbols-outlined font-light">photo_camera</span>
                  </button>
                  <button className="bg-white hover:bg-[#e1e3e1] p-3 rounded-full transition-colors shadow-sm text-[#40493d]">
                    <span className="material-symbols-outlined font-light">mic</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Goal Selection */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(25,28,27,0.04)]">
              <h2 className="font-headline text-2xl font-bold mb-6">Align with your Goal</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {goals.map((g, i) => (
                  <label key={i} className="relative cursor-pointer group">
                    <input defaultChecked={g.defaultChecked} className="peer sr-only" name="goal" type="radio" />
                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#f2f4f2] border-2 border-transparent peer-checked:bg-[#a3f69c]/30 peer-checked:border-[#2e7d32] transition-all duration-300 group-hover:bg-[#e6e9e7]">
                      <span className="material-symbols-outlined text-4xl mb-3 text-[#0d631b] transition-transform group-hover:scale-110">{g.icon}</span>
                      <span className="font-headline font-bold text-[#191c1b]">{g.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(25,28,27,0.04)]">
              <h2 className="font-headline text-2xl font-bold mb-6">Moment of Consumption</h2>
              <div className="flex flex-wrap gap-3">
                {moments.map((t, i) => (
                  <label key={i} className="cursor-pointer">
                    <input defaultChecked={t.checked} className="peer sr-only" name="time" type="radio" />
                    <div className="px-6 py-3 rounded-full bg-[#f2f4f2] peer-checked:bg-[#0058bc] peer-checked:text-white font-semibold transition-all duration-300 hover:bg-[#e6e9e7] peer-checked:hover:bg-[#004493]">
                        {t.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Main CTA */}
            <button
              onClick={() => navigate('/analysis')}
              className="w-full py-5 px-8 rounded-2xl bg-gradient-to-br from-[#0d631b] to-[#2e7d32] text-white font-headline text-xl font-bold shadow-lg shadow-[#0d631b]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
              Analyze with AI
            </button>
            
          </div>

          {/* ── Sidebar ───────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Visual Inspiration */}
            <div className="relative h-64 lg:h-80 rounded-[2rem] overflow-hidden group shadow-xl">
              <img 
                alt="Fresh Food Inspiration" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF73BH5TCQNoUVPjFFBriiVFlaTYVTJ1_gmgVS3gdotLTsmkij9dCqlboAIzNPJe4lz9ryHhSItA0qRuSEm6f20rheMnCH1A4NEBhpoANIkAtgm9jK2cpllzYYugmz4VENffX_00F-fchOz984srGdKjR23GdKOXNWFZr32lfFaqx2lrOsO3UCJgUEbRXA6tngu8C3XoBvhhIgZ8ugIbXtGHqK7zTpqLSuSKMg_07OJ6R-rUUkarMsbmeoDindZXWxtcaKkYJLR-QS" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-white/80 font-bold tracking-widest text-xs uppercase mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lightbulb</span> Curator Tip
                </span>
                <p className="text-white text-lg font-headline font-bold leading-tight">Visual data helps AI estimate portion sizes more accurately.</p>
              </div>
            </div>

            {/* AI Glass Card */}
            <div className="bg-[#0058bc]/5 backdrop-blur-3xl border border-[#0058bc]/10 rounded-[2rem] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0058bc]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#0058bc] flex items-center justify-center shadow-md shadow-[#0058bc]/30">
                  <span className="material-symbols-outlined text-white text-[16px]" style={{fontVariationSettings:"'FILL' 1"}}>insights</span>
                </div>
                <h3 className="font-headline font-bold text-[#0058bc]">Why this matters</h3>
              </div>
              <p className="text-[#40493d] text-sm leading-relaxed mb-5 relative z-10 font-medium">
                By logging your food at the correct <span className="font-bold text-[#191c1b]">time</span>, the AI can correlate your nutrient intake with your circadian rhythm.
              </p>
              <div className="space-y-3 relative z-10 p-4 bg-white/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#0058bc]"></div>
                  <span className="text-xs text-[#40493d] font-semibold">Protein synthesis tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#0058bc]"></div>
                  <span className="text-xs text-[#40493d] font-semibold">Glycemic load estimation</span>
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="bg-[#f2f4f2] rounded-[2rem] p-6 shadow-sm border border-transparent hover:border-[#e1e3e1] transition-colors">
              <h3 className="font-headline font-bold mb-4 text-[#191c1b]">Quick Suggestions</h3>
              <div className="space-y-2">
                {['Greek Yogurt with Berries', 'Chicken Caesar Salad', 'Protein Shake (Whey)'].map((s, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-[#a3f69c]/20 hover:text-[#0d631b] transition-colors text-left group border border-transparent shadow-sm">
                    <span className="text-sm font-semibold text-[#40493d] group-hover:text-[#0d631b]">{s}</span>
                    <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </section>
      </main>

      {/* ── Mobile Nav ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#bfcaba]/20 px-6 py-3 flex justify-around items-center">
        {[
          { to: '/',        icon: 'dashboard',    label: 'Home',    active: false },
          { to: '/input',   icon: 'auto_awesome', label: 'Log',     active: true },
          { to: '/analysis',icon: 'insights',     label: 'Insights',active: false },
          { to: '/profile', icon: 'settings',     label: 'Setup',   active: false },
        ].map(({ to, icon, label, active }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-1 ${active ? 'text-[#0d631b]' : 'text-zinc-400'}`}>
            <span className="material-symbols-outlined text-[22px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}
