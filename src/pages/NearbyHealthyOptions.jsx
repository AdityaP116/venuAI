import { Link, useNavigate } from 'react-router-dom';

export default function NearbyHealthyOptions() {
  const navigate = useNavigate();

  const places = [
    {
      name: 'Green Garden Salads',
      distance: '0.4 miles away',
      match: '98% Health Match',
      matchColors: 'bg-[#a3f69c] text-[#002204]',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkcRF5fJ9_cXE3K7-BW-LBCSQysroYmyVYZ_s9JmykvwcqzrfX6srhrHVyEoyFxlE6vnY-D_bCsh9LUXRP476Q8bSeSAT8aPOD8oqXNb1pyz6T8AF7G6p5ZYHtajC1mSiDH75gVQluoAHkpRHYdHojAfxi8ihc5jYa10Qz0vJl6EVS8DTC0MD9wTc2ID-po3FkCsie6tNh7Lyb-F5JsQWXJnwR5sp943eB7nq-JIHqz2-l4wKCSwZ6JLFgNlJTfxNbBHt5440WxPi_',
      highlightIcon: 'stars',
      highlightColor: 'text-[#0d631b]',
      highlightText: 'Top AI Pick',
      dish: 'Harvest Quinoa Bowl',
      desc: 'Lean protein, rich fiber, 420 kcal. Matches your macro target.'
    },
    {
      name: 'Pure Protein Hub',
      distance: '0.9 miles away',
      match: 'Muscle Fuel',
      matchColors: 'bg-[#d8e2ff] text-[#001a41]',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNxMVRNChOn74yR1g0rptMBqdmXrCA-tZ59s6PHw8nmi80ps-FRXzF3FIpv4s1d1CEbNyQcR6b7R5uJq-TfUhX7zRd9Townn2_MfdX9Ii7UIHDQg5Zi7hBG64ucvJec8n4ZkAxit7-etRFj4aMgkBAZ1jIO6o_ItV0V4pE-yjLbIVg9xIgCe6zUb9lZEmoEMuSlsxXGf_2X0s1Y8iCp8lihbHv4nFhgGpWLvLFP8Z5ZBiCyZb_PIPsao5KSV6WZC0w3s3nr4OS8yZQ',
      highlightIcon: 'bolt',
      highlightColor: 'text-[#0058bc]',
      highlightText: 'Post-Workout Best',
      dish: 'Zesty Lemon Salmon',
      desc: 'High Omega-3s, 38g Protein. Perfect for recovery.'
    }
  ];

  return (
    <div className="bg-[#f8faf8] font-body text-[#191c1b] min-h-screen">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-emerald-50/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-black text-emerald-900 italic font-headline tracking-tight">
            NutriSense AI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">Dashboard</Link>
            <Link to="/nearby" className="text-emerald-700 font-bold border-b-2 border-emerald-600 font-label">Explore</Link>
            <Link to="/analysis" className="text-zinc-500 font-medium font-label hover:text-emerald-600 transition-colors">History</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:bg-emerald-100/50 rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
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
            <Link to="/nearby" className="flex items-center gap-3 bg-emerald-100 text-emerald-900 rounded-xl p-3 font-headline text-sm font-semibold shadow-sm">
              <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>insights</span>AI Insights
            </Link>
            <Link to="/analysis" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">restaurant_menu</span>Meal Plans
            </Link>
            <Link to="/profile" className="flex items-center gap-3 text-zinc-600 p-3 hover:bg-emerald-100/50 rounded-xl transition-all font-headline text-sm font-semibold">
              <span className="material-symbols-outlined">settings</span>Settings
            </Link>
          </nav>
          <div className="mt-auto pt-4">
            <button onClick={() => navigate('/input')} className="w-full py-4 bg-gradient-to-br from-[#0d631b] to-[#2e7d32] text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add</span>Quick Log Food
            </button>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Map Section */}
          <section className="flex-1 relative order-2 md:order-1 h-1/2 md:h-full">
            <div className="absolute inset-0 bg-[#f2f4f2] overflow-hidden">
              <img 
                className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                alt="City Map"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADxDadbRs61b6z_4LHa0s8cZe0vw0FbBzQ1-vJRov4ZpO5zW6-hDQ8_EpUPSkcwhJaG81qEF9kU8WiRvZjyxn7KOR15rgQfi2R_i_0FLMng7zf6MJqlb5BN2W96B4aFuErtrEByfIT1ueZ-9If9_4FJr99t2nMGgnFqyTyQRZU4daKKUV63DJ8aAUq8EDnRxU8gwJRzVYJLX-02_VmGtnuEe7L_yovahRP2maG0ahbkhx8wIJfXXkGPYMgDYIMs2Jf-XAHVkswU94I" 
              />
              
              {/* Map Markers */}
              <div className="absolute top-1/3 left-[40%] group cursor-pointer animate-fade-in">
                <div className="relative">
                  <span className="material-symbols-outlined text-[#0d631b] text-[40px] drop-shadow-md transition-transform group-hover:scale-110" style={{fontVariationSettings:"'FILL' 1"}}>location_on</span>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-[#0d631b]">Green Garden Salads</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1/3 right-[30%] group cursor-pointer animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="relative">
                  <span className="material-symbols-outlined text-[#0058bc] text-[40px] drop-shadow-md transition-transform group-hover:scale-110" style={{fontVariationSettings:"'FILL' 1"}}>location_on</span>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-[#0058bc]">Pure Protein Hub</span>
                  </div>
                </div>
              </div>

              {/* AI Overlay Card */}
              <div className="absolute top-6 right-6 z-10 w-[300px] hidden md:block">
                <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0058bc] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm" style={{fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                    </div>
                    <h3 className="font-headline font-bold text-[#191c1b]">Curated Path</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#40493d] italic font-medium">
                    "Based on your morning cardio and weight loss goal, I've highlighted spots with high-fiber, low-glycemic options within a 15-minute walk."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Results Sidebar */}
          <section className="w-full md:w-[460px] bg-[#f8faf8] border-l border-[#e1e3e1]/50 overflow-y-auto order-1 md:order-2 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-black font-headline text-[#191c1b] tracking-tight leading-none mb-2">Nearby Vitality</h1>
              <p className="text-[#40493d] font-medium text-sm">Fueling your progress locally</p>
            </div>
            
            <div className="space-y-6 pb-24 md:pb-0">
              
              {/* Restaurant Cards */}
              {places.map((p, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-sm border border-transparent hover:border-[#e1e3e1]/50 cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold font-headline text-[#191c1b]">{p.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#40493d] font-semibold mt-1">
                        <span className="material-symbols-outlined text-[14px]">distance</span>
                        <span>{p.distance}</span>
                      </div>
                    </div>
                    <div className={`${p.matchColors} px-3 py-1.5 rounded-full`}>
                      <span className="text-[10px] font-bold tracking-wider uppercase">{p.match}</span>
                    </div>
                  </div>
                  
                  <div className="mb-5 rounded-2xl overflow-hidden aspect-video relative">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} src={p.img} />
                  </div>
                  
                  <div className="bg-[#f2f4f2] p-4 rounded-2xl group-hover:bg-[#e6e9e7] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`material-symbols-outlined text-[16px] ${p.highlightColor}`} style={{fontVariationSettings:"'FILL' 1"}}>{p.highlightIcon}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${p.highlightColor}`}>{p.highlightText}</span>
                    </div>
                    <p className="text-sm font-bold text-[#191c1b]">{p.dish}</p>
                    <p className="text-xs text-[#40493d] mt-1 font-medium">{p.desc}</p>
                  </div>
                </div>
              ))}

              {/* Market Chip */}
              <div className="bg-amber-50 p-5 rounded-3xl flex items-center gap-4 border border-amber-100">
                <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white" style={{fontVariationSettings:"'FILL' 1"}}>shopping_basket</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900 leading-tight">Prefer to cook?</p>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-snug font-medium">2 Organic Markets nearby have ingredients for your 'Green Detox' recipe.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ── Mobile Nav ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#bfcaba]/20 px-6 py-3 flex justify-around items-center">
        {[
          { to: '/',        icon: 'dashboard',    label: 'Home',   active: false },
          { to: '/nearby',  icon: 'explore',      label: 'Explore',active: true },
          { to: '/analysis',icon: 'history',      label: 'History',active: false },
          { to: '/profile', icon: 'person',       label: 'Profile',active: false },
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
