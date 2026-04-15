import { Link } from 'react-router-dom';

export default function ProfileSettings() {
  const menuItems = [
    { icon: 'notifications', label: 'Notifications', path: '#' },
    { icon: 'privacy_tip', label: 'Privacy & Data', path: '#' },
    { icon: 'security', label: 'Security', path: '#' },
    { icon: 'credit_card', label: 'Billing & Plan', path: '#' },
  ];

  return (
    <div className="bg-[#f8faf8] font-body text-[#191c1b] min-h-screen">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-emerald-50/80 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-black text-emerald-900 italic font-headline tracking-tight">NutriSense AI</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Dashboard</Link>
            <Link to="/input" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Nutrition Log</Link>
            <Link to="/analysis" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">AI Insights</Link>
            <Link to="/profile" className="text-emerald-700 font-bold border-b-2 border-emerald-600 font-label">Settings</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:bg-emerald-100/50 rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-zinc-500 hover:bg-emerald-100/50 rounded-full transition-all">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#a3f69c] ring-2 ring-[#0d631b]/10">
              <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHptmyOwAamXJu5TSf7gMYfYHD-tmx7lrN94XR9sLeT0bEBGynJzAh28MqQsdNkPs6FD8mzL3Il3JPe8J_qtPB6_3oNF5_0wIEsFCD_T_7aml4sthk9igZIzuJpuhTS7Gp5bALcA7CbSMTvWJ8YlaB0uR71RXx9DnRrYYhse-jFSgVrpcMSu-rIlECjWSiW9yKvxFQRtanNiHAADZnCYsfILIf7S58LTOrBiXFoputnDBz8Q9KqVI3YswZ0MAIIIrdJhLwPiainxRk" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-[72px] h-screen overflow-hidden">
        {/* ── Side Nav ────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 bg-emerald-50 p-5 gap-4 z-40 rounded-r-[2rem] shadow-2xl flex-shrink-0">
          <div className="px-3 py-4">
            <h2 className="text-xl font-bold text-emerald-800 font-headline">NutriSense AI</h2>
            <p className="text-[11px] text-zinc-500 font-medium tracking-widest uppercase mt-1">The Living Curator</p>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            <Link to="/" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </Link>
            <Link to="/input" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">auto_awesome</span>Nutrition Log
            </Link>
            <Link to="/analysis" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">insights</span>AI Insights
            </Link>
            <Link to="/nearby" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">restaurant_menu</span>Meal Plans
            </Link>
            <Link to="/profile" className="flex items-center gap-3 bg-emerald-100 text-emerald-900 rounded-xl p-3 font-headline text-sm font-semibold shadow-sm">
              <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>settings</span>Settings
            </Link>
          </nav>
          <div className="mt-auto pt-4 border-t border-emerald-200/50 flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-300 overflow-hidden shrink-0">
                <img alt="Elena" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTj6-CHEMbeyujI3-8hquy7NGomqthPSyL66HwM8gRbIu3bcx7hjG998Y11nEVKVAqtCr5QK9-tEgDVmRDakFn10mu5uLYjJ1HlXc1v7NdZtlR-l9II2owfBYBABKosFVW1K7Hf4V5tEm16yb6ZCrhiL_GM0JuAPR-9eiF56v_H12Irx8325sU0QIRi1GXZItDfHqX10Ly7r2muve2ZvYWZdnBo71ORxelZ55Tt3fWN14OcF4sViuCT6oqK79NjSHyQv13fs055l6" />
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-emerald-950 font-headline truncate">Elena Vitality</p>
                <p className="text-xs text-emerald-700/80 font-medium truncate uppercase tracking-widest mt-0.5">Pro Member</p>
            </div>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 pb-28">
            
            {/* Profile Header */}
            <header className="mb-12 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3f69c]/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                <div className="relative group mx-auto md:mx-0">
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white relative z-10 transition-transform group-hover:scale-105 duration-500">
                    <img alt="Elena Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTj6-CHEMbeyujI3-8hquy7NGomqthPSyL66HwM8gRbIu3bcx7hjG998Y11nEVKVAqtCr5QK9-tEgDVmRDakFn10mu5uLYjJ1HlXc1v7NdZtlR-l9II2owfBYBABKosFVW1K7Hf4V5tEm16yb6ZCrhiL_GM0JuAPR-9eiF56v_H12Irx8325sU0QIRi1GXZItDfHqX10Ly7r2muve2ZvYWZdnBo71ORxelZ55Tt3fWN14OcF4sViuCT6oqK79NjSHyQv13fs055l6" />
                  </div>
                  <button className="absolute -bottom-3 -right-3 z-20 bg-[#0d631b] hover:bg-[#2e7d32] text-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-110 active:scale-95">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <div className="absolute -bottom-4 -left-4 bg-white px-3 py-1.5 rounded-xl shadow-lg z-20 flex items-center gap-1 border border-[#e1e3e1]">
                     <span className="material-symbols-outlined text-[#814700] text-sm" style={{fontVariationSettings:"'FILL' 1"}}>local_fire_department</span>
                     <span className="text-xs font-bold font-label">14 Day</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-center md:text-left w-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 justify-center md:justify-start">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#191c1b] font-headline">Elena Vitality</h1>
                    <span className="inline-flex max-w-max mx-auto md:mx-0 px-4 py-1.5 bg-[#a3f69c] text-[#002204] rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">Pro User</span>
                  </div>
                  <p className="text-[#40493d] text-lg leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
                    Curating a lifestyle of vitality through data-driven nutrition and mindful movement.
                  </p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Personal Settings Form */}
                <section className="bg-white rounded-[2rem] p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] border border-[#e1e3e1]/50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold font-headline flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#0d631b] text-3xl">person</span>
                      Biometrics
                    </h3>
                    <button className="text-sm font-bold text-[#0d631b] bg-[#a3f69c]/30 px-4 py-2 rounded-xl hover:bg-[#a3f69c]/50 transition-colors">
                        Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Email', val: 'elena.vitality@auth.com' },
                      { label: 'Age', val: '28 Years' },
                      { label: 'Height', val: '172 cm' },
                      { label: 'Baseline Weight', val: '64.5 kg' },
                    ].map((f, i) => (
                      <div key={i} className="bg-[#f8faf8] p-4 rounded-2xl group border border-transparent hover:border-[#e1e3e1] transition-all">
                        <p className="text-xs font-bold text-[#707a6c] uppercase tracking-widest font-label mb-1.5">{f.label}</p>
                        <p className="text-base font-semibold text-[#191c1b] truncate">{f.val}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dietary Profile */}
                <section className="bg-white rounded-[2rem] p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] border border-[#e1e3e1]/50 space-y-8">
                  <h3 className="text-2xl font-bold font-headline flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0d631b] text-3xl">health_and_safety</span>
                    Dietary Profile
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-[#e6f9e5] to-white rounded-3xl border border-[#a3f69c]/50">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-[#0d631b] rounded-2xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">track_changes</span>
                        </div>
                        <div>
                        <p className="text-xs font-bold text-[#005312] uppercase tracking-widest font-label mb-0.5">Primary Target</p>
                        <p className="text-xl font-bold text-[#002204] font-headline">Weight Optimization</p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white shadow-sm border border-[#e1e3e1] rounded-xl text-sm font-bold hover:bg-[#f8faf8] transition-colors w-full sm:w-auto">
                        Change Target
                    </button>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-[#707a6c] uppercase tracking-widest font-label mb-4">Current Restrictions & Allergies</p>
                    <div className="flex flex-wrap gap-2.5">
                      {['Gluten-Free', 'Dairy-Free', 'No Shellfish'].map((r, i) => (
                        <div key={i} className="px-4 py-2 bg-[#f2f4f2] text-[#191c1b] rounded-full text-sm font-bold flex items-center gap-2 group cursor-pointer hover:bg-[#ba1a1a]/10 hover:text-[#93000a] transition-colors">
                          {r}
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">close</span>
                        </div>
                      ))}
                      <button className="px-4 py-2 border-2 border-dashed border-[#bfcaba] hover:border-[#0d631b] hover:text-[#0d631b] hover:bg-[#0d631b]/5 rounded-full text-sm font-bold text-zinc-500 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0d631b]/30">
                        <span className="material-symbols-outlined text-sm">add</span>Add Modifier
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-8">
                {/* Integration Status */}
                <section className="bg-[#f2f4f2] rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d631b]">sync</span>
                    Data Integrations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-[1.25rem] shadow-sm border border-transparent hover:border-[#e1e3e1] transition-all">
                      <div className="w-12 h-12 bg-[#ffebee] flex items-center justify-center rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-[#d32f2f]">favorite</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#191c1b]">Apple Health</p>
                        <p className="text-xs text-zinc-500 font-medium">Synced just now</p>
                      </div>
                      <div className="relative flex items-center group cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-[#d8dad9] rounded-full peer peer-checked:bg-[#0d631b] transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-[1.25rem] shadow-sm border border-transparent hover:border-[#e1e3e1] transition-all">
                      <div className="w-12 h-12 bg-[#e3f2fd] flex items-center justify-center rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-[#1976d2]">watch</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#191c1b]">Garmin Connect</p>
                        <p className="text-xs text-[#d32f2f] font-medium">Authorization needed</p>
                      </div>
                       <button className="text-[#1976d2] font-bold text-sm bg-[#e3f2fd] px-3 py-1.5 rounded-lg">Reconnect</button>
                    </div>
                  </div>
                </section>

                {/* Account Settings Menu */}
                <section className="bg-white rounded-[2rem] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] border border-[#e1e3e1]/50">
                  <div className="space-y-1">
                    {menuItems.map((s, i) => (
                      <Link key={i} to={s.path} className="w-full flex items-center justify-between p-4 hover:bg-[#f2f4f2] rounded-xl transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#f8faf8] flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                              <span className="material-symbols-outlined text-[#707a6c] group-hover:text-[#0d631b] transition-colors">{s.icon}</span>
                          </div>
                          <span className="font-bold text-[#191c1b]">{s.label}</span>
                        </div>
                        <span className="material-symbols-outlined text-[#bfcaba] group-hover:text-[#0d631b] group-hover:translate-x-0.5 transition-all">chevron_right</span>
                      </Link>
                    ))}
                    
                    <div className="h-px bg-[#e1e3e1] w-full my-2"></div>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-[#ffdad6]/30 text-[#93000a] hover:bg-[#ffdad6] rounded-xl transition-colors font-bold group">
                      Sign Out
                      <span className="material-symbols-outlined opacity-70 group-hover:opacity-100 transition-opacity">logout</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* AI Call to Action */}
            <div className="mt-12 bg-gradient-to-br from-[#0d631b] to-[#1b5e20] rounded-[2.5rem] p-[3px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="bg-[#002204]/90 backdrop-blur-xl rounded-[2.3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 h-full relative z-10 w-full">
                    <div className="space-y-4 max-w-xl text-center md:text-left">
                        <div className="inline-flex px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest items-center gap-1.5 shadow-sm border border-white/10">
                            <span className="material-symbols-outlined text-[14px]">science</span> AI Labs
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-headline">Unlock DNA-level Insights.</h2>
                        <p className="text-[#a3f69c] text-lg font-medium leading-relaxed">Opt-in to experimental personalized blood-glucose forecasting based on your recent 30-day logs.</p>
                        <button className="mt-2 w-full sm:w-auto px-8 py-3.5 bg-white text-[#002204] font-bold font-headline rounded-xl shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                             Learn More <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

          </div>
        </main>
      </div>

       {/* ── Mobile Nav ─────────────────────────────────── */}
       <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#bfcaba]/20 px-6 py-3 flex justify-around items-center pb-safe">
        {[
          { to: '/',        icon: 'dashboard',    label: 'Home',   active: false },
          { to: '/input',   icon: 'auto_awesome', label: 'Log',    active: false },
          { to: '/analysis',icon: 'insights',     label: 'Insights',active: false },
          { to: '/profile', icon: 'settings',     label: 'Profile', active: true },
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
