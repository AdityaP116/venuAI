import { Link, useNavigate } from 'react-router-dom';

export default function AiAnalysisResults() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8faf8] font-body text-[#191c1b] min-h-screen">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-emerald-50/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-emerald-900 italic font-headline tracking-tight">NutriSense AI</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Dashboard</Link>
              <Link to="/input" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Nutrition Log</Link>
              <Link to="/analysis" className="text-emerald-700 font-bold border-b-2 border-emerald-600 font-label">AI Insights</Link>
              <Link to="/nearby" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Meal Plans</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a3f69c] ring-2 ring-[#0d631b]/10">
              <img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTJqnAxjn8VjsslsDMwdFyMnUnHE9vsb73lBIFAJ9AyD9x57MQ2Ed0tqK21umdrsn8xrpLJXHvwVAxf7xZM8zHue7YfjrmswE9oYzieSyesMswsXaTmH8z7fwe4GGgptl1SDYEPI-WzzjzrWi-Gfuz8LOsfoVE33OQMHDcyzqEZNBtA0k0nnK8wyGsIpGGP64b6rKr_Pr51XpCA4wzlQZGL-UCg8p9_MUezMNPUwaXaafJI40J8R8XhLYxLN1yB9qRonBLrrBQKY3y" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#0d631b] text-xs font-bold uppercase tracking-widest bg-[#a3f69c]/30 px-3 py-1.5 rounded-full inline-flex">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Night Analysis • Weight Loss Goal
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-[#191c1b]">AI Decision Engine</h1>
            <p className="text-[#40493d] text-lg font-medium max-w-xl leading-relaxed">
              Real-time metabolic impact assessment for your late-night craving.
            </p>
          </div>
          <div className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] font-bold text-sm shadow-sm gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>report</span>
            Not Ideal Time
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── Left Column ───────────────────────────────── */}
          <div className="lg:col-span-7 space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Calorie Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-transparent hover:border-[#e1e3e1]/50 hover:shadow-md transition-all flex flex-col justify-between aspect-video md:aspect-square group">
                <span className="text-[#40493d] font-bold text-sm font-label uppercase tracking-wider">Energy Density</span>
                <div>
                  <div className="text-6xl font-black text-[#191c1b] font-headline tracking-tighter">650</div>
                  <div className="text-lg font-bold text-[#ba1a1a] flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">trending_up</span> kcal spike
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#eceeec] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ba1a1a] w-3/4 rounded-full group-hover:bg-[#93000a] transition-colors"></div>
                </div>
              </div>
              
              {/* Health Score Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-transparent hover:border-[#e1e3e1]/50 hover:shadow-md transition-all flex flex-col justify-between aspect-video md:aspect-square">
                <span className="text-[#40493d] font-bold text-sm font-label uppercase tracking-wider">Metabolic Score</span>
                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle className="text-[#eceeec]" cx="56" cy="56" fill="transparent" r="50" stroke="currentColor" strokeWidth="12" />
                    <circle className="text-[#814700]" cx="56" cy="56" fill="transparent" r="50" stroke="currentColor" strokeDasharray="314.15" strokeDashoffset="188.49" strokeWidth="12" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-3xl font-black font-headline text-[#814700]">40</span>
                </div>
                <p className="text-sm font-medium text-[#814700] text-center bg-[#ffdcc1]/30 py-1.5 rounded-lg">Poor goal alignment</p>
              </div>
            </div>

            {/* Why Section */}
            <div className="bg-[#f2f4f2] p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0058bc] flex items-center justify-center text-white shadow-lg shadow-[#0058bc]/20">
                  <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings:"'FILL' 1"}}>insights</span>
                </div>
                <h2 className="text-2xl font-bold font-headline">The Science</h2>
              </div>
              <div className="space-y-4">
                <p className="text-[#40493d] leading-relaxed font-medium">
                  A high-carb, high-fat meal like a <span className="font-bold text-[#191c1b] bg-white px-2 py-0.5 rounded shadow-sm">Burger</span> at night triggers a significant insulin spike. During the evening, your body's insulin sensitivity naturally decreases.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="p-5 rounded-2xl bg-white border border-[#e1e3e1]/50 shadow-sm hover:-translate-y-0.5 transition-transform">
                    <span className="material-symbols-outlined text-[#814700] text-3xl mb-3">speed</span>
                    <p className="text-sm font-bold text-[#191c1b] mb-1.5">Slow Metabolism</p>
                    <p className="text-xs text-[#40493d] font-medium leading-relaxed">Late-night calories are processed less efficiently, favoring fat storage over energy.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#e1e3e1]/50 shadow-sm hover:-translate-y-0.5 transition-transform">
                    <span className="material-symbols-outlined text-[#0058bc] text-3xl mb-3">bedtime</span>
                    <p className="text-sm font-bold text-[#191c1b] mb-1.5">Sleep Quality</p>
                    <p className="text-xs text-[#40493d] font-medium leading-relaxed">Heavy digestion disrupts REM rest cycles, leading to higher ghrelin (hunger) levels tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column - Recommendation ──────────────── */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 space-y-6">
                
              <div className="bg-[#0d631b] rounded-[2rem] p-1.5 shadow-[0_20px_40px_-15px_rgba(13,99,27,0.3)]">
                <div className="px-6 py-4 flex items-center justify-between text-white">
                  <span className="font-bold font-label uppercase tracking-widest text-xs opacity-90 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">swap_horiz</span> Curator Alternative
                  </span>
                  <span className="material-symbols-outlined text-[#a3f69c]" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>
                </div>
                
                <div className="bg-white m-0.5 rounded-[1.7rem] overflow-hidden">
                  <div className="h-48 relative">
                      <img alt="Grilled Paneer Wrap" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr5EIz02Sh_xIwGumaT4YZD_YoFSo-F6vmh6Q-EZClolPMAbjN3sW9S1NIU7AeD3ACR1yl8tm8gOfCwLGfgYO7viXADnEG_X47zkfm8o-1qgztNkWSwKGPKbfJDYfkY2nqwSKgA4vxxccClPTmr96OPkdtkao3MsOpAmLGZV20_0GGgR1HjOJB--fE5CKzcgZOY4wF4DbDEdsb0zTmqL3MsdhpmnWxK-31sem0T2wVT3pW_xT0Qnh8sQZvPz1vxqnOSpNn8NsL6LJU" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-6 text-2xl font-black font-headline tracking-tight text-white">Grilled Paneer Wrap</h3>
                  </div>
                  
                  <div className="p-7 space-y-5">
                    <div className="flex justify-between items-center">
                      <p className="text-[#40493d] font-bold text-sm">Lean Protein • High Fiber</p>
                      <div className="bg-[#a3f69c] text-[#002204] px-3.5 py-1.5 rounded-lg font-bold text-sm shadow-sm inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">local_fire_department</span> 350 kcal
                      </div>
                    </div>
                    
                    <ul className="space-y-3 pb-2">
                      <li className="flex items-start gap-3 text-sm font-medium text-[#191c1b]">
                        <span className="material-symbols-outlined text-[#0d631b] text-[18px] mt-0.5">check_circle</span>
                        46% fewer calories than your craving; perfect for evening breakdown of food.
                      </li>
                      <li className="flex items-start gap-3 text-sm font-medium text-[#191c1b]">
                        <span className="material-symbols-outlined text-[#0d631b] text-[18px] mt-0.5">check_circle</span>
                        Low-glycemic index wrapper maintains a steady overnight glucose level.
                      </li>
                    </ul>
                    
                    <div className="pt-2 flex flex-col gap-3">
                      <button className="w-full bg-[#0d631b] hover:bg-[#2e7d32] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-lg">
                        <span className="material-symbols-outlined">restaurant_menu</span>
                        Log This Alternative
                      </button>
                      <button onClick={() => navigate('/input')} className="w-full bg-[#f2f4f2] hover:bg-[#e1e3e1] text-[#40493d] text-sm py-4 rounded-xl font-bold transition-all active:scale-[0.98]">
                        Ignore & Keep Original
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="p-6 rounded-[1.5rem] bg-[#0058bc]/5 border border-[#0058bc]/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0058bc]/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#0058bc]" style={{fontVariationSettings:"'FILL' 1"}}>lightbulb</span>
                </div>
                <div className="space-y-1 mt-0.5">
                  <p className="text-sm font-bold text-[#0058bc] uppercase tracking-widest font-label">Curator Protocol</p>
                  <p className="text-sm text-[#001a41] leading-relaxed font-medium">Drinking 250ml of warm water with lemon 15 mins before this meal can boost thermogenesis safely.</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile Nav ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#bfcaba]/20 px-6 py-3 flex justify-around items-center">
        {[
          { to: '/',        icon: 'dashboard',    label: 'Home',    active: false },
          { to: '/input',   icon: 'auto_awesome', label: 'Log',     active: false },
          { to: '/analysis',icon: 'insights',     label: 'Insights',active: true },
          { to: '/profile', icon: 'settings',     label: 'Setup',   active: false },
        ].map(({ to, icon, label, active }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#0d631b]' : 'text-zinc-400'}`}>
            <span className="material-symbols-outlined text-[24px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
