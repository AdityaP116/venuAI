import { Link, useNavigate } from 'react-router-dom';

export default function HomeDashboard() {
  const navigate = useNavigate();

  const vitals = [
    { icon: 'water_drop', color: 'text-[#0058bc]', label: 'Hydration', value: '1.8', unit: '/ 2.5L', bg: 'bg-[#d8e2ff]/30' },
    { icon: 'local_fire_department', color: 'text-[#814700]', label: 'Burned', value: '450', unit: 'kcal', bg: 'bg-[#ffdcc1]/30' },
    { icon: 'directions_run', color: 'text-[#0d631b]', label: 'Steps', value: '8,432', unit: '/ 10k', bg: 'bg-[#a3f69c]/30' },
    { icon: 'bedtime', color: 'text-orange-500', label: 'Sleep', value: '7h 20m', unit: '', bg: 'bg-orange-50' },
  ];

  const meals = [
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKUcBHDlCFVk5GCnowCDwWBauuo8ZbNRImItLSkOV-zf_YHvNCelvKRG2gkiRC9N0wvC3I_HdwyOz9oj9-BaCYYRusyP4KnupduiUHhuB4KZ3oJ5c4Z-Ido0opbniCFxW2sZ3YWMR6HcBZSIznya19j0ByQrOI85Kacz0wAJGOyUCtub5weCfPVbumAJgx22Gjijr6heb_HQGv0XKsAltERpCRlPiHJ0Bmiw-uo-qR9tfqruzwGsdt-V3F0i4WTbII3RUz0CK0sPAk',
      name: 'Avocado & Egg Sourdough', time: 'Breakfast · 08:30 AM', kcal: '420 kcal', tag: 'Good Match', tagColor: 'text-[#0d631b]',
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYwWu4xUyOLqLV3-cgOkC7dReodFMEoi8po_82cfHDT_WpMdxX-jOvWwwmUW_k6aSc02q-YiBsIJhV2rM223ECCDvhauaiKjOB5S9S0GBF9w7EvANy8j6UxQ7En-vCAJmvyxWbPWQN84kEwPCR4alU-0BTSrjJmzvPfd6ALC5uDrik_doiLwuut1oCYM85CB2on4WDyD6O23DV4n34tF3mxL8sj2MpHMVG9vDC08uDmYf_oGkJ7BfOoboGIgq6oEponaxS0Ydn8qV',
      name: 'Mediterranean Power Bowl', time: 'Lunch · Yesterday', kcal: '580 kcal', tag: 'Nutrient Dense', tagColor: 'text-[#0d631b]',
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA52eR4BBQMe7zE-yMAleKO89-YX8PRo7NJ0-KP4-vQNejKc4cWBW6-5DQPSZ3IGiMr02n5CNmBgTaq1PeJwFkHSllFEY5C5bUOydmpJsZhZ4_U54QXh8DNOAKjBO2fL92_OkeW8Wv6q6B7YM7J8DE81PBflv69ujr7DY5OjfMC2u51iJ-CXPrmDJ-mek1U4aJ38SbyqEj9wqls17LDH6VcnZ8vL4u-DWnE1WLGwwc7tQb6GWI-NaCfE-HIgmP01u-zNvRaO56v9uZf',
      name: 'Post-Workout Shake', time: 'Snack · Yesterday', kcal: '210 kcal', tag: 'Standard', tagColor: 'text-[#40493d]',
    },
  ];

  const macros = [
    { label: 'Protein', val: '112g / 140g', pct: 80, color: 'bg-[#0d631b]' },
    { label: 'Carbs',   val: '156g / 220g', pct: 71, color: 'bg-[#0058bc]' },
    { label: 'Fats',    val: '42g / 65g',   pct: 64, color: 'bg-[#a45b00]' },
  ];

  return (
    <div className="text-[#191c1b] min-h-screen bg-[#f8faf8]">

      {/* ── Top Nav ─────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-emerald-50/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-emerald-900 italic font-headline tracking-tight">NutriSense AI</span>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-emerald-700 font-bold border-b-2 border-emerald-600 font-label transition-all">Dashboard</Link>
              <Link to="/input" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Nutrition Log</Link>
              <Link to="/analysis" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">AI Insights</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-full text-zinc-500 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a3f69c] ring-2 ring-[#0d631b]/10">
              <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3PdWtSK0ldgUZEVtqjjcLgq-VaQkImKkJjdzhsGJ19CqFW1oc_18xejHXeHLdnRgMUFkUVO7a9YhLE-AnQ2EiNpDUOKOoYan1brPkcsB3Xa8mQyZCUoWbQr0mBc9o7sf4teizQ-Xsb_TC4VxU5Fj5WYAIy5tokk2KQw1Pg0f_jXOZSs0Gu6T0nYhpnnBQhLb5Km0gdVzwdds2aG2WFZgNc_YcdQgkORBt_dqne7Mzij0JpPYraPmKuYetE57MEqLsIy6nTMG6qFLL" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[72px] h-screen overflow-hidden">

        {/* ── Side Nav ────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 bg-emerald-50 p-5 gap-4 shadow-2xl rounded-r-3xl flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-4">
            <div className="w-11 h-11 bg-[#a3f69c] rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d631b] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-800 font-headline leading-none">NutriSense AI</h2>
              <p className="text-[11px] text-zinc-500 font-medium tracking-widest uppercase">The Living Curator</p>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {[
              { to: '/',        icon: 'dashboard',       label: 'Dashboard',      active: true },
              { to: '/input',   icon: 'auto_awesome',    label: 'Nutrition Log',  active: false },
              { to: '/analysis',icon: 'insights',        label: 'AI Insights',    active: false },
              { to: '/nearby',  icon: 'restaurant_menu', label: 'Meal Plans',     active: false },
              { to: '/profile', icon: 'settings',        label: 'Settings',       active: false },
            ].map(({ to, icon, label, active }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold font-label transition-all
                  ${active
                    ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                    : 'text-zinc-600 hover:bg-emerald-50 hover:text-emerald-800'}`}>
                <span className="material-symbols-outlined text-[20px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {icon}
                </span>
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => navigate('/input')}
            className="w-full bg-gradient-to-br from-[#0d631b] to-[#2e7d32] text-white py-4 rounded-2xl font-bold font-label flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_circle</span>
            Quick Log Food
          </button>
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 md:px-12 max-w-6xl mx-auto space-y-10 pb-28 md:pb-12">

            {/* Welcome + Score row */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-[#191c1b] tracking-tight font-headline">
                    Welcome back, Elena
                  </h1>
                  <p className="mt-2 text-[#40493d] text-lg leading-relaxed max-w-xl">
                    Your morning metrics look excellent. Let's keep the momentum going.
                  </p>
                </div>

                {/* Smart Suggestion */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0d631b] to-[#1b5e20] rounded-[2rem] p-8 text-white shadow-2xl">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-5 border border-white/10">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                      <span className="text-xs font-bold tracking-widest uppercase">Smart Suggestion</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 leading-snug font-headline">
                      Good morning! Since you're aiming for energy, consider a protein-rich breakfast.
                    </h3>
                    <p className="text-[#a3f69c] text-sm font-medium mb-6 max-w-lg leading-relaxed">
                      Based on your metabolic data, a mix of eggs and avocado would stabilize your glucose for the next 4 hours.
                    </p>
                    <button className="bg-white text-[#0d631b] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                      View Breakfast Ideas
                    </button>
                  </div>
                  <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>

              {/* Health Score */}
              <div className="lg:col-span-4 bg-[#f2f4f2] rounded-[2rem] p-8 flex flex-col items-center gap-5">
                <h2 className="text-lg font-bold text-[#40493d] font-headline self-start">Month Score</h2>
                <div className="relative flex items-center justify-center">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="#e1e3e1" strokeWidth="12" />
                    <circle cx="70" cy="70" r="60" fill="none" stroke="#0d631b" strokeWidth="12"
                      strokeDasharray="376.99" strokeDashoffset="75.4" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-headline text-[#191c1b]">82</span>
                    <span className="text-xs font-bold text-[#40493d] tracking-widest uppercase mt-1">Excellent</span>
                  </div>
                </div>
                <p className="text-sm text-[#40493d] font-medium">↑ 4 points since yesterday</p>
              </div>
            </section>

            {/* Vitals */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vitals.map((v, i) => (
                <div key={i} className={`${v.bg} p-5 rounded-3xl flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-default`}>
                  <span className={`material-symbols-outlined ${v.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                  <div>
                    <p className="text-[#40493d] text-xs font-semibold font-label uppercase tracking-wider">{v.label}</p>
                    <p className="text-2xl font-bold font-headline text-[#191c1b] mt-0.5">
                      {v.value} <span className="text-sm font-normal text-[#40493d]">{v.unit}</span>
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Log + Macros */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Recent Log */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-headline">Recent Log</h2>
                  <a className="text-sm font-bold text-[#0d631b] hover:underline" href="#">View All</a>
                </div>
                <div className="space-y-3">
                  {meals.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl hover:bg-[#f2f4f2] transition-colors group cursor-pointer">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img alt={m.name} src={m.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#191c1b] truncate group-hover:text-[#0d631b] transition-colors">{m.name}</h4>
                        <p className="text-xs text-[#40493d] mt-0.5">{m.time}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm">{m.kcal}</p>
                        <p className={`text-[11px] font-bold ${m.tagColor}`}>{m.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/input')}
                  className="w-full py-3 bg-[#f2f4f2] rounded-2xl font-bold text-sm text-[#0d631b] hover:bg-[#a3f69c]/30 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>Log New Meal
                </button>
              </div>

              {/* Macro Breakdown */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-headline">Macro Breakdown</h2>
                  <span className="text-xs font-semibold text-[#40493d] bg-[#f2f4f2] px-3 py-1.5 rounded-full">Today's Target</span>
                </div>
                <div className="bg-[#f2f4f2] rounded-[2rem] p-7 space-y-7">
                  {macros.map((m, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-[#191c1b]">{m.label}</span>
                        <span className="text-[#40493d] font-normal">{m.val}</span>
                      </div>
                      <div className="h-3 w-full bg-[#e1e3e1] rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* ── Mobile Nav ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#bfcaba]/20 px-6 py-3 flex justify-around items-center">
        {[
          { to: '/',        icon: 'dashboard',    label: 'Home',    active: true },
          { to: '/input',   icon: 'auto_awesome', label: 'Log',     active: false },
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

      {/* FAB (desktop) */}
      <button
        onClick={() => navigate('/input')}
        className="hidden md:flex fixed bottom-8 right-8 z-50 bg-[#0d631b] text-white px-5 py-3 rounded-2xl shadow-2xl items-center gap-2 font-bold hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
        Log New Meal
      </button>
    </div>
  );
}
