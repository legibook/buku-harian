import React, { useState, useEffect } from 'react';
import { 
  BookHeart, 
  PenLine, 
  CalendarHeart, 
  ChevronLeft, 
  Sparkles,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

const App = () => {
  // State untuk menyimpan daftar catatan harian
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: new Date().toISOString(),
      title: "Hari yang Damai",
      content: "Alhamdulillah, hari ini berjalan dengan lancar. Aku sempat membaca beberapa halaman Al-Quran setelah Subuh dan rasanya hati menjadi sangat tenang.",
      mood: "tenang"
    }
  ]);

  // State untuk navigasi tampilan ('home', 'write', 'read')
  const [currentView, setCurrentView] = useState('home');
  const [activeEntry, setActiveEntry] = useState(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('senang');

  // Pilihan suasana hati dengan emoji
  const moods = [
    { id: 'senang', emoji: '🥰', label: 'Alhamdulillah' },
    { id: 'tenang', emoji: '😌', label: 'Tenang' },
    { id: 'semangat', emoji: '✨', label: 'Semangat' },
    { id: 'sedih', emoji: '🥺', label: 'Sedih' },
    { id: 'lelah', emoji: '🥱', label: 'Lelah' }
  ];

  // Format tanggal ke format bahasa Indonesia
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk menyimpan catatan baru
  const handleSaveEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: newTitle,
      content: newContent,
      mood: newMood
    };

    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewContent('');
    setNewMood('senang');
    setCurrentView('home');
  };

  // Fungsi untuk membuka catatan untuk dibaca
  const handleOpenEntry = (entry) => {
    setActiveEntry(entry);
    setCurrentView('read');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-gray-800 relative overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      
      {/* --- Efek Latar Belakang Cat Air (Watercolor Effect) --- */}
      {/* Lingkaran blur ini menciptakan ilusi sapuan cat air yang lembut di latar belakang */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-teal-100/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md mx-auto min-h-screen bg-white/40 backdrop-blur-sm shadow-xl shadow-pink-100/50 relative z-10 flex flex-col">
        
        {/* HEADER */}
        <header className="pt-10 pb-6 px-6 text-center relative">
          {currentView !== 'home' && (
            <button 
              onClick={() => setCurrentView('home')}
              className="absolute left-6 top-10 p-2 bg-white/60 rounded-full hover:bg-white text-pink-600 transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex justify-center items-center gap-2 mb-2">
            <BookHeart className="text-pink-400" size={28} />
            <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Catatan Muslimah
            </h1>
          </div>
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
            Ruang Cerita & Doa
          </p>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 px-6 pb-24 overflow-y-auto">
          
          {/* TAMPILAN BERANDA */}
          {currentView === 'home' && (
            <div className="space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Daily Quote Card */}
              <div className="bg-gradient-to-br from-pink-100/80 to-purple-100/80 rounded-3xl p-6 shadow-sm border border-white/50 relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 text-pink-300 opacity-50" size={40} />
                <p className="text-sm font-serif italic text-gray-700 leading-relaxed relative z-10">
                  "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan."
                </p>
                <p className="text-xs font-semibold text-pink-600 mt-3 relative z-10">
                  — QS. Al-Insyirah: 5-6
                </p>
              </div>

              {/* Entries List */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <CalendarHeart size={18} className="text-pink-400" />
                    Jurnal Terakhir
                  </h2>
                </div>
                
                {entries.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                    <Moon size={40} className="mb-3 text-pink-200" />
                    <p>Belum ada catatan.</p>
                    <p className="text-sm">Mulai tulis harimu hari ini!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleOpenEntry(entry)}
                        className="w-full text-left bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-pink-50 hover:shadow-md hover:bg-white transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                            {entry.title}
                          </h3>
                          <span className="text-2xl bg-pink-50 w-8 h-8 flex items-center justify-center rounded-full shadow-inner">
                            {moods.find(m => m.id === entry.mood)?.emoji}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {formatDate(entry.date)}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {entry.content}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAMPILAN TULIS JURNAL */}
          {currentView === 'write' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="text-center">
                <p className="font-serif text-2xl text-pink-300 mb-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                <p className="text-xs text-gray-400">Awali dengan nama Allah</p>
              </div>

              {/* Mood Selector */}
              <div className="bg-white/60 p-4 rounded-2xl shadow-sm border border-white">
                <p className="text-xs font-semibold text-gray-500 mb-3 text-center uppercase tracking-wider">Bagaimana perasaanmu hari ini?</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setNewMood(mood.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        newMood === mood.id 
                          ? 'bg-pink-100 scale-110 shadow-sm ring-2 ring-pink-200' 
                          : 'hover:bg-pink-50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[10px] text-gray-600 font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Beri judul ceritamu..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-gray-800 placeholder-gray-400 border-b-2 border-pink-100 focus:border-pink-300 outline-none pb-2 transition-colors"
                />
                <textarea
                  placeholder="Ceritakan apa yang kamu alami atau syukuri hari ini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full flex-1 min-h-[250px] bg-white/40 p-5 rounded-2xl shadow-inner border border-white/50 outline-none resize-none text-gray-700 leading-relaxed focus:bg-white/60 transition-colors"
                ></textarea>
              </div>

              <button
                onClick={handleSaveEntry}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                Simpan Jurnal
              </button>
            </div>
          )}

          {/* TAMPILAN BACA JURNAL */}
          {currentView === 'read' && activeEntry && (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-pink-50 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{activeEntry.title}</h2>
                  <p className="text-sm text-pink-500 font-medium flex items-center gap-2">
                    <Sun size={14} />
                    {formatDate(activeEntry.date)}
                  </p>
                </div>
                <div className="text-4xl bg-pink-50 p-2 rounded-2xl shadow-inner">
                  {moods.find(m => m.id === activeEntry.mood)?.emoji}
                </div>
              </div>
              
              <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-transparent mb-6 rounded-full"></div>
              
              <div className="prose prose-pink max-w-none">
                <p className="text-gray-700 leading-loose whitespace-pre-wrap">
                  {activeEntry.content}
                </p>
              </div>
            </div>
          )}

        </main>

        {/* FLOATING ACTION BUTTON (Hanya tampil di beranda) */}
        {currentView === 'home' && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={() => setCurrentView('write')}
              className="group flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-400 text-white px-6 py-4 rounded-full shadow-xl shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-1 transition-all"
            >
              <PenLine size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold tracking-wide">Tulis Hari Ini</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;