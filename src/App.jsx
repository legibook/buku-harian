import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { BookHeart, PenLine, CalendarHeart, ChevronLeft, Sparkles, Moon, Sun, Sunset, Menu, Trash2, Edit3, X, RotateCcw, ArchiveX, Bold, Italic, Underline, Palette, Search, Quote, Plus, GripVertical, Tag, Settings, Check, FileText, Type } from 'lucide-react';

const defaultQuotes = [
  { text: "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.", source: "QS. Al-Insyirah: 5-6" },
  { text: "Janganlah kamu tahzan (bersedih), sesungguhnya Allah bersama kita.", source: "QS. At-Taubah: 40" },
  { text: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.", source: "QS. Ali 'Imran: 173" },
  { text: "Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu.", source: "QS. Ghafir: 60" },
  { text: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.", source: "QS. At-Talaq: 3" }
];

const themeColors = {
  pink: { name: "Sakura Pastel", gradient: "from-pink-500 to-purple-400", gradientLight: "from-pink-100 to-purple-100", text: "text-pink-600", textLight: "text-pink-400", bgLight: "bg-pink-50", bgMedium: "bg-pink-100", blob1: "bg-pink-200/40", blob2: "bg-purple-200/30", blob3: "bg-rose-100/40", border: "border-pink-100", ring: "ring-pink-200", shadow: "shadow-pink-200" },
  blue: { name: "Awan Biru", gradient: "from-blue-400 to-cyan-400", gradientLight: "from-blue-100 to-cyan-100", text: "text-blue-600", textLight: "text-blue-400", bgLight: "bg-blue-50", bgMedium: "bg-blue-100", blob1: "bg-blue-200/40", blob2: "bg-cyan-200/30", blob3: "bg-sky-100/40", border: "border-blue-100", ring: "ring-blue-200", shadow: "shadow-blue-200" },
  green: { name: "Daun Mint", gradient: "from-emerald-400 to-teal-400", gradientLight: "from-emerald-100 to-teal-100", text: "text-emerald-600", textLight: "text-emerald-400", bgLight: "bg-emerald-50", bgMedium: "bg-emerald-100", blob1: "bg-emerald-200/40", blob2: "bg-teal-200/30", blob3: "bg-green-100/40", border: "border-emerald-100", ring: "ring-emerald-200", shadow: "shadow-emerald-200" },
  orange: { name: "Senja Jingga", gradient: "from-orange-400 to-rose-400", gradientLight: "from-orange-100 to-rose-100", text: "text-orange-600", textLight: "text-orange-400", bgLight: "bg-orange-50", bgMedium: "bg-orange-100", blob1: "bg-orange-200/40", blob2: "bg-rose-200/30", blob3: "bg-amber-100/40", border: "border-orange-100", ring: "ring-orange-200", shadow: "shadow-orange-200" },
  purple: { name: "Lavender", gradient: "from-purple-400 to-indigo-400", gradientLight: "from-purple-100 to-indigo-100", text: "text-purple-600", textLight: "text-purple-400", bgLight: "bg-purple-50", bgMedium: "bg-purple-100", blob1: "bg-purple-200/40", blob2: "bg-indigo-200/30", blob3: "bg-violet-100/40", border: "border-purple-100", ring: "ring-purple-200", shadow: "shadow-purple-200" }
};

const moods = [
  { id: 'senang', emoji: '🥰', label: 'Alhamdulillah' }, { id: 'tenang', emoji: '😌', label: 'Tenang' },
  { id: 'semangat', emoji: '✨', label: 'Semangat' }, { id: 'sedih', emoji: '🥺', label: 'Sedih' }, { id: 'lelah', emoji: '🥱', label: 'Lelah' }
];

const App = () => {
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('diary-muslimah-data')) || []);
  const [deletedEntries, setDeletedEntries] = useState(() => JSON.parse(localStorage.getItem('diary-muslimah-trash')) || []);
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('diary-font-size')) || 16);
  const [userQuotes, setUserQuotes] = useState(() => JSON.parse(localStorage.getItem('diary-muslimah-quotes')) || defaultQuotes);
  const [labels, setLabels] = useState(() => JSON.parse(localStorage.getItem('diary-muslimah-labels')) || [{ id: 1, name: 'Penting ✨' }, { id: 2, name: 'Keluarga 👨‍👩‍👧' }, { id: 3, name: 'Ibadah 🕋' }]);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('diary-theme') || 'pink');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('diary-dark-mode') === 'true');

  useEffect(() => { localStorage.setItem('diary-muslimah-data', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('diary-muslimah-trash', JSON.stringify(deletedEntries)); }, [deletedEntries]);
  useEffect(() => { localStorage.setItem('diary-font-size', fontSize.toString()); }, [fontSize]);
  useEffect(() => { localStorage.setItem('diary-muslimah-quotes', JSON.stringify(userQuotes)); }, [userQuotes]);
  useEffect(() => { localStorage.setItem('diary-muslimah-labels', JSON.stringify(labels)); }, [labels]);
  useEffect(() => { localStorage.setItem('diary-theme', currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem('diary-dark-mode', isDarkMode); }, [isDarkMode]);

  const [currentView, setCurrentView] = useState('home');
  const [activeEntry, setActiveEntry] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('senang');
  const [newEntryLabels, setNewEntryLabels] = useState([]);
  
  const [newPaper, setNewPaper] = useState('paper-polos');
  const [newFont, setNewFont] = useState('font-sans');

  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedLabelFilter, setSelectedLabelFilter] = useState(null); 

  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteSource, setNewQuoteSource] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [isAddingInstantLabel, setIsAddingInstantLabel] = useState(false);
  const [instantLabelName, setInstantLabelName] = useState('');

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const editorRef = useRef(null); 

  const theme = useMemo(() => themeColors[currentTheme] || themeColors.pink, [currentTheme]);
  const mode = useMemo(() => ({
    bgMain: isDarkMode ? "bg-gray-900" : "bg-[#FAF7F2]",
    textMain: isDarkMode ? "text-gray-100" : "text-gray-800",
    textCard: isDarkMode ? "text-gray-300" : "text-gray-700",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    bgCard: isDarkMode ? "bg-gray-800/80" : "bg-white/70",
    bgSidebar: isDarkMode ? "bg-gray-900/95" : "bg-white/80",
    bgInput: isDarkMode ? "bg-gray-800/80" : "bg-white/50",
    bgItem: isDarkMode ? "bg-gray-700" : "bg-white",
    border: isDarkMode ? "border-gray-700" : theme.border,
    bgHover: isDarkMode ? "hover:bg-gray-800" : "hover:bg-black/5",
    shadow: isDarkMode ? "shadow-black/30" : "shadow-sm",
  }), [isDarkMode, theme]);

  const currentQuote = useMemo(() => {
    const todayDays = Math.floor(Date.now() / 86400000);
    const safeQuotes = userQuotes.length > 0 ? userQuotes : [{ text: "Tuliskan kutipan inspiratifmu sendiri di menu Atur Quote.", source: "Sistem" }];
    return safeQuotes[todayDays % safeQuotes.length];
  }, [userQuotes]);

  const displayedEntries = useMemo(() => entries.filter(entry => {
    const s = searchTerm.toLowerCase();
    return (entry.title.toLowerCase().includes(s) || entry.content.toLowerCase().includes(s)) &&
           (selectedLabelFilter ? (entry.labels?.includes(selectedLabelFilter)) : true);
  }), [entries, searchTerm, selectedLabelFilter]);

  const formatDateTime = useCallback((dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`; 
  }, []);

  const getTimeIcon = useCallback((dateString, size = 14) => {
    const h = new Date(dateString).getHours();
    if (h >= 5 && h < 15) return <Sun size={size} className="text-amber-500" />;
    if (h >= 15 && h < 18) return <Sunset size={size} className="text-orange-400" />;
    return <Moon size={size} className="text-indigo-400" />;
  }, []);

  const applyFormat = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) { setNewContent(editorRef.current.innerHTML); editorRef.current.focus(); }
  }, []);

  const handleSaveEntry = useCallback(() => {
    if (!newTitle.trim() || !newContent.trim() || newContent === '<br>') return;
    const entryData = { title: newTitle, content: newContent, mood: newMood, labels: newEntryLabels, paper: newPaper, font: newFont };
    if (editingId) setEntries(entries.map(e => e.id === editingId ? { ...e, ...entryData } : e));
    else setEntries([{ id: Date.now(), date: new Date().toISOString(), ...entryData }, ...entries]);
    resetForm(); setCurrentView('home');
  }, [newTitle, newContent, newMood, newEntryLabels, newPaper, newFont, editingId, entries]);

  const handleEditEntry = useCallback((entry) => {
    setEditingId(entry.id); 
    setNewTitle(entry.title); 
    setNewContent(entry.content); 
    setNewMood(entry.mood); 
    setNewEntryLabels(entry.labels || []); 
    setNewPaper(entry.paper || 'paper-polos');
    setNewFont(entry.font || 'font-sans');
    setCurrentView('write');
  }, []);

  useEffect(() => { if (currentView === 'write' && editorRef.current) { editorRef.current.innerHTML = newContent; } }, [currentView]);

  const handleDeleteEntry = useCallback((entry) => { setEntries(entries.filter(e => e.id !== entry.id)); setDeletedEntries([entry, ...deletedEntries]); }, [entries, deletedEntries]);
  const handleRestoreEntry = useCallback((entry) => { setDeletedEntries(deletedEntries.filter(e => e.id !== entry.id)); setEntries([...entries, entry].sort((a, b) => new Date(b.date) - new Date(a.date))); }, [entries, deletedEntries]);
  
  const resetForm = useCallback(() => { 
    setEditingId(null); setNewTitle(''); setNewContent(''); setNewMood('senang'); setNewEntryLabels([]); 
    setNewPaper('paper-polos'); setNewFont('font-sans');
  }, []);

  const handleAddQuote = useCallback(() => {
    if (!newQuoteText.trim()) return;
    setUserQuotes([{ text: newQuoteText, source: newQuoteSource.trim() || "Anonim", id: Date.now() }, ...userQuotes]);
    setNewQuoteText(''); setNewQuoteSource('');
  }, [newQuoteText, newQuoteSource, userQuotes]);

  const handleDeleteQuote = useCallback((i) => { const u = [...userQuotes]; u.splice(i, 1); setUserQuotes(u); }, [userQuotes]);
  const handleDragStart = (e, i) => { dragItem.current = i; e.currentTarget.style.opacity = '0.5'; };
  const handleDragEnter = (e, i) => { dragOverItem.current = i; };
  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '1';
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copy = [...userQuotes]; const content = copy[dragItem.current];
      copy.splice(dragItem.current, 1); copy.splice(dragOverItem.current, 0, content);
      setUserQuotes(copy);
    }
    dragItem.current = null; dragOverItem.current = null;
  }, [userQuotes]);

  const handleAddInstantLabel = useCallback(() => {
    if (!instantLabelName.trim()) return;
    const newId = Date.now();
    setLabels([...labels, { id: newId, name: instantLabelName.trim() }]);
    setNewEntryLabels([...newEntryLabels, newId]); 
    setInstantLabelName(''); setIsAddingInstantLabel(false);
  }, [instantLabelName, labels, newEntryLabels]);

  const renderEntryLabels = useCallback((entryLabelsArray) => {
    if (!entryLabelsArray?.length) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2 mb-1">
        {entryLabelsArray.map(id => {
          const l = labels.find(x => x.id === id);
          return l ? <span key={id} className={`text-[10px] border ${mode.border} px-2 py-0.5 rounded-full font-medium ${isDarkMode ? 'bg-gray-800 text-gray-300' : `${theme.bgLight} ${theme.text}`}`}>{l.name}</span> : null;
        })}
      </div>
    );
  }, [labels, mode.border, isDarkMode, theme]);

  return (
    <div className={`h-[100dvh] w-full ${mode.bgMain} font-sans ${mode.textMain} relative overflow-hidden transition-colors duration-500 selection:${theme.bgMedium} selection:${theme.text}`}>
      
      {/* SUNTIKAN CSS UNTUK FONT DAN KERTAS PRESISI TINGGI */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Dancing+Script:wght@400..700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
        
        /* Font Styles */
        .font-sans { font-family: ui-sans-serif, system-ui, sans-serif; }
        .font-elegant { font-family: 'Lora', serif !important; }
        .font-handwriting { font-family: 'Caveat', cursive !important; font-size: 1.3em; }
        .font-script { font-family: 'Dancing Script', cursive !important; font-size: 1.3em; }
        
        /* Paper Styles (Presisi Tinggi Menyesuaikan Baseline) */
        .paper-polos { background-color: transparent; }
        
        .paper-garis { 
          /* Kalkulasi 1.6em adalah estimasi titik baseline paling pas untuk line-height 2em */
          background-image: linear-gradient(transparent calc(1.6em - 1px), rgba(220, 150, 180, 0.4) calc(1.6em - 1px), rgba(220, 150, 180, 0.4) 1.6em, transparent 1.6em);
          background-size: 100% 2em;
          /* 1rem adalah penyesuaian padding atas container (p-4 / pt-4) */
          background-position: 0 1rem;
          line-height: 2em !important; 
          background-attachment: local; 
        }
        
        .paper-titik { 
          background-image: radial-gradient(rgba(220, 150, 180, 0.6) 1.5px, transparent 1.5px); 
          background-size: 2em 2em; 
          background-position: 1rem calc(1rem + 0.6em);
          line-height: 2em !important; 
          background-attachment: local; 
        }
        
        .paper-grid { 
          background-image: linear-gradient(to right, rgba(220, 150, 180, 0.3) 1px, transparent 1px), 
                            linear-gradient(to bottom, transparent calc(1.6em - 1px), rgba(220, 150, 180, 0.3) calc(1.6em - 1px), rgba(220, 150, 180, 0.3) 1.6em, transparent 1.6em); 
          background-size: 2em 2em; 
          background-position: 1rem 1rem; 
          line-height: 2em !important; 
          background-attachment: local; 
        }
      `}</style>

      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${theme.blob1} rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${isDarkMode ? 'opacity-10' : ''}`}></div>
      <div className={`absolute top-[20%] right-[-10%] w-[40%] h-[60%] ${theme.blob2} rounded-full blur-[120px] pointer-events-none transition-all duration-700 ${isDarkMode ? 'opacity-10' : ''}`}></div>
      <div className={`absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] ${theme.blob3} rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${isDarkMode ? 'opacity-10' : ''}`}></div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>}
      
      <div className={`fixed top-0 left-0 h-full w-64 ${mode.bgSidebar} backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r ${mode.border} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-xl font-serif font-bold ${theme.text} flex items-center gap-2`}><BookHeart size={24} /> Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className={`p-2 ${mode.textMuted} ${mode.bgHover} rounded-full transition-colors`}><X size={20} /></button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'home', icon: <CalendarHeart size={20}/>, label: 'Semua Catatan', active: currentView === 'home' && !selectedLabelFilter },
              { id: 'labels', icon: <Tag size={20}/>, label: 'Koleksi Label', active: currentView === 'labels' },
              { id: 'quotes', icon: <Quote size={20}/>, label: 'Atur Quote', active: currentView === 'quotes' }
            ].map(item => (
              <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedLabelFilter(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${item.active ? `bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : theme.gradientLight} ${theme.text} shadow-sm` : `${mode.bgHover} ${mode.textMuted}`}`}>
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={() => { setCurrentView('trash'); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl font-medium transition-all ${currentView === 'trash' ? `bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : theme.gradientLight} ${theme.text} shadow-sm` : `${mode.bgHover} ${mode.textMuted}`}`}>
              <div className="flex items-center gap-3"><Trash2 size={20} /> Sampah</div>
              {deletedEntries.length > 0 && <span className={`${isDarkMode ? 'bg-gray-700' : theme.bgMedium} ${theme.text} text-xs py-1 px-2 rounded-full font-bold`}>{deletedEntries.length}</span>}
            </button>
            <div className={`my-4 border-t ${mode.border}`}></div>
            <button onClick={() => { setCurrentView('settings'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${currentView === 'settings' ? `bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-700' : theme.gradientLight} ${theme.text} shadow-sm` : `${mode.bgHover} ${mode.textMuted}`}`}>
              <Settings size={20} /> Tampilan
            </button>
          </div>
        </div>
      </div>

      <div className={`max-w-md mx-auto h-full ${isDarkMode ? 'bg-black/20' : 'bg-white/40'} backdrop-blur-sm shadow-xl ${isDarkMode ? 'shadow-black/50' : theme.shadow + '/50'} relative z-10 flex flex-col transition-colors duration-500`}>
        <header className="pt-10 pb-6 px-6 text-center relative flex justify-center items-center shrink-0">
          <button onClick={currentView === 'home' ? () => setIsSidebarOpen(true) : currentView === 'write' ? () => { resetForm(); setCurrentView('home'); } : () => setCurrentView('home')} className={`absolute left-6 p-2 ${mode.bgItem} rounded-full ${mode.bgHover} ${theme.text} transition-colors shadow-sm`}>
            {currentView === 'home' ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div className="flex flex-col items-center">
            <h1 className={`text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient} flex items-center gap-2`}><BookHeart className={theme.textLight} size={24} /> Catatan Muslimah</h1>
            <p className={`text-[10px] ${mode.textMuted} font-medium tracking-widest uppercase mt-1`}>
              {currentView === 'trash' ? 'Tempat Sampah' : currentView === 'quotes' ? 'Koleksi Inspirasi' : currentView === 'labels' ? 'Manajemen Label' : currentView === 'settings' ? 'Pengaturan' : 'Ruang Cerita & Doa'}
            </p>
          </div>
        </header>

        <main className="flex-1 px-6 pb-24 overflow-y-auto">
          {currentView === 'home' && (
            <div className="space-y-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!selectedLabelFilter && (
                <div className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800/80 to-gray-700/80' : theme.gradientLight} rounded-3xl p-6 shadow-sm border ${mode.border} relative overflow-hidden transition-colors`}>
                  <Sparkles className={`absolute top-4 right-4 ${theme.textLight} opacity-50`} size={40} />
                  <p className={`text-sm font-serif italic ${mode.textCard} leading-relaxed relative z-10`}>"{currentQuote.text}"</p>
                  <p className={`text-xs font-semibold ${theme.text} mt-3 relative z-10`}>— {currentQuote.source}</p>
                </div>
              )}
              <div className="relative mt-2">
                <Search className={`absolute left-4 top-3.5 ${theme.textLight}`} size={18} />
                <input type="text" placeholder="Cari memori atau cerita indahmu..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full ${mode.bgInput} backdrop-blur-md pl-12 pr-4 py-3 rounded-2xl shadow-sm border ${mode.border} focus:border-transparent focus:outline-none focus:ring-2 ${theme.ring} transition-all text-sm ${mode.textMain}`} />
              </div>
              {selectedLabelFilter && (
                <div className={`${isDarkMode ? 'bg-gray-800' : theme.bgLight} border ${mode.border} ${theme.text} px-4 py-3 rounded-2xl flex justify-between items-center shadow-sm animate-in fade-in zoom-in`}>
                  <span className="text-sm font-bold flex items-center gap-2"><Tag size={16}/> Menampilkan label: {labels.find(l => l.id === selectedLabelFilter)?.name}</span>
                  <button onClick={() => setSelectedLabelFilter(null)} className={`p-1 ${mode.bgHover} rounded-full transition-colors ${theme.text}`}><X size={16}/></button>
                </div>
              )}
              <div className="flex-1 pb-10">
                {!selectedLabelFilter && <div className="flex items-center justify-between mb-4 mt-2"><h2 className={`text-lg font-bold ${mode.textMain} flex items-center gap-2`}><CalendarHeart size={18} className={theme.textLight} /> Jurnal Terakhir</h2></div>}
                {entries.length === 0 ? (
                  <div className={`text-center py-10 ${mode.textMuted} flex flex-col items-center`}><Moon size={40} className={`mb-3 ${theme.textLight} opacity-50`} /><p>Belum ada catatan.</p><p className="text-sm">Mulai tulis harimu hari ini!</p></div>
                ) : displayedEntries.length === 0 ? (
                  <div className={`text-center py-8 ${theme.textLight} ${mode.bgInput} rounded-2xl border ${mode.border}`}><p>Tidak ada catatan yang ditemukan.</p></div>
                ) : (
                  <div className="space-y-4">
                    {displayedEntries.map(entry => (
                      <div key={entry.id} className={`w-full ${mode.bgCard} backdrop-blur-md rounded-2xl ${mode.shadow} border ${mode.border} hover:shadow-md transition-all group overflow-hidden flex flex-col`}>
                        <div className="p-5 cursor-pointer flex-1" onClick={() => { setActiveEntry(entry); setCurrentView('read'); }}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-bold ${mode.textMain} group-hover:${theme.text} transition-colors ${entry.font || 'font-sans'}`}>{entry.title}</h3>
                            <span className={`text-2xl ${mode.bgItem} w-8 h-8 flex items-center justify-center rounded-full shadow-inner shrink-0 ml-2`}>{moods.find(m => m.id === entry.mood)?.emoji}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs ${theme.textLight} font-medium mb-1`}>{getTimeIcon(entry.date)}<span>{formatDateTime(entry.date)}</span></div>
                          {renderEntryLabels(entry.labels)}
                          {/* Cuplikan menggunakan font yang diset */}
                          <p className={`text-sm ${mode.textCard} line-clamp-2 leading-relaxed mt-2 ${entry.font || 'font-sans'}`} dangerouslySetInnerHTML={{ __html: entry.content }}></p>
                        </div>
                        <div className={`px-5 py-2.5 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} flex justify-end gap-4 border-t ${mode.border}`}>
                          <button onClick={() => handleEditEntry(entry)} className="text-blue-400 flex items-center gap-1.5 text-xs font-bold hover:text-blue-500 transition-colors"><Edit3 size={14} /> Edit</button>
                          <button onClick={() => handleDeleteEntry(entry)} className="text-red-400 flex items-center gap-1.5 text-xs font-bold hover:text-red-500 transition-colors"><Trash2 size={14} /> Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'write' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col pb-6">
              <div className="text-center">
                <p className={`font-serif text-2xl ${theme.textLight} mb-1`}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                <p className={`text-xs ${mode.textMuted}`}>{editingId ? 'Memperbarui cerita...' : 'Awali dengan nama Allah'}</p>
              </div>

              {/* Panel Mood & Label */}
              <div className={`${mode.bgCard} p-3 rounded-3xl shadow-sm border ${mode.border} shrink-0`}>
                <div className={`flex justify-center gap-1 sm:gap-3 mb-3 pb-3 border-b ${mode.border}`}>
                  {moods.map(mood => (
                    <button key={mood.id} onClick={() => setNewMood(mood.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${newMood === mood.id ? `${isDarkMode ? 'bg-gray-700' : theme.bgMedium} scale-110 shadow-sm ring-2 ${theme.ring}` : `opacity-70 hover:opacity-100 ${mode.bgHover}`}`}>
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className={`text-[10px] ${mode.textMuted} font-medium hidden sm:block`}>{mood.label}</span>
                    </button>
                  ))}
                </div>
                <div className="px-1">
                  <p className={`text-[10px] font-bold ${mode.textMuted} uppercase tracking-widest mb-2 flex items-center gap-1`}><Tag size={12}/> Pilih Label</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {labels.map(label => (
                      <button key={label.id} onClick={() => setNewEntryLabels(newEntryLabels.includes(label.id) ? newEntryLabels.filter(id => id !== label.id) : [...newEntryLabels, label.id])} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${newEntryLabels.includes(label.id) ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent shadow-md transform scale-105` : `${mode.bgItem} ${mode.textMuted} ${mode.border} hover:border-gray-400`}`}>{label.name}</button>
                    ))}
                    {isAddingInstantLabel ? (
                      <div className={`flex items-center gap-1 ${mode.bgItem} p-1 rounded-full border ${mode.border} shadow-inner`}>
                        <input autoFocus value={instantLabelName} onChange={e => setInstantLabelName(e.target.value)} className={`w-24 text-xs px-2 py-0.5 bg-transparent outline-none ${mode.textMain}`} placeholder="Nama label..." onKeyDown={e => e.key === 'Enter' && handleAddInstantLabel()} />
                        <button onClick={handleAddInstantLabel} className={`bg-gradient-to-r ${theme.gradient} text-white p-1 rounded-full`}><Plus size={12}/></button>
                        <button onClick={() => setIsAddingInstantLabel(false)} className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} ${mode.textMuted} p-1 rounded-full`}><X size={12}/></button>
                      </div>
                    ) : <button onClick={() => setIsAddingInstantLabel(true)} className={`px-3 py-1.5 rounded-full border border-dashed ${mode.border} ${theme.textLight} ${mode.bgItem} hover:${mode.bgHover} flex items-center gap-1 text-xs font-bold transition-colors`}><Plus size={12}/> Baru</button>}
                  </div>
                </div>
              </div>

              {/* Panel Template Kertas & Font */}
              <div className="flex flex-wrap gap-4 px-1 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={14} className={theme.textLight} />
                  <span className={`text-[10px] font-bold ${mode.textMuted} uppercase tracking-widest`}>Kertas:</span>
                  <select value={newPaper} onChange={e => setNewPaper(e.target.value)} className={`text-xs font-medium ${mode.bgItem} ${mode.textMain} border ${mode.border} rounded-lg py-1 px-2 outline-none focus:ring-2 ${theme.ring} cursor-pointer`}>
                    <option value="paper-polos">Polos Putih</option>
                    <option value="paper-garis">Garis-Garis</option>
                    <option value="paper-titik">Titik-Titik</option>
                    <option value="paper-grid">Kotak-Kotak</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Type size={14} className={theme.textLight} />
                  <span className={`text-[10px] font-bold ${mode.textMuted} uppercase tracking-widest`}>Font:</span>
                  <select value={newFont} onChange={e => setNewFont(e.target.value)} className={`text-xs font-medium ${mode.bgItem} ${mode.textMain} border ${mode.border} rounded-lg py-1 px-2 outline-none focus:ring-2 ${theme.ring} cursor-pointer`}>
                    <option value="font-sans" className="font-sans">Modern</option>
                    <option value="font-elegant" className="font-elegant">Elegan</option>
                    <option value="font-handwriting" className="font-handwriting">Tulis Tangan</option>
                    <option value="font-script" className="font-script">Latin Sambung</option>
                  </select>
                </div>
              </div>

              {/* Area Editor Text */}
              <div className={`flex-1 flex flex-col ${mode.bgInput} rounded-3xl shadow-inner border ${mode.border} min-h-[300px] overflow-hidden`}>
                
                {/* Judul */}
                <div className="p-4 pb-0">
                  <input type="text" placeholder="Beri judul ceritamu..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className={`w-full bg-transparent text-xl font-bold ${mode.textMain} ${newFont} placeholder-gray-400 border-b-2 ${mode.border} focus:border-transparent focus:ring-0 outline-none pb-3 mb-2 transition-colors shrink-0`} />
                </div>
                
                {/* Toolbar Format */}
                <div className={`flex flex-wrap items-center justify-between gap-2 mb-2 mx-4 ${isDarkMode ? 'bg-gray-800' : theme.bgLight} p-2 rounded-xl shrink-0 border ${mode.border}`}>
                  <div className="flex gap-2">
                    <button onClick={() => applyFormat('bold')} className={`p-2 ${mode.bgItem} rounded-lg shadow-sm ${mode.textMuted} hover:${theme.text}`}><Bold size={16}/></button>
                    <button onClick={() => applyFormat('italic')} className={`p-2 ${mode.bgItem} rounded-lg shadow-sm ${mode.textMuted} hover:${theme.text}`}><Italic size={16}/></button>
                    <button onClick={() => applyFormat('underline')} className={`p-2 ${mode.bgItem} rounded-lg shadow-sm ${mode.textMuted} hover:${theme.text}`}><Underline size={16}/></button>
                    <div className={`relative inline-block overflow-hidden rounded-lg shadow-sm ${mode.bgItem} p-1`}>
                      <Palette size={20} className={`${mode.textMuted} pointer-events-none mx-1`} />
                      <input type="color" onChange={e => applyFormat('foreColor', e.target.value)} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className={`flex gap-1 border-l-2 ${mode.border} pl-2`}>
                    <button onClick={() => setFontSize(f => Math.min(f + 2, 28))} className={`px-3 py-1 ${mode.bgItem} rounded-lg shadow-sm ${theme.text} font-bold`}>A+</button>
                    <button onClick={() => setFontSize(f => Math.max(f - 2, 12))} className={`px-3 py-1 ${mode.bgItem} rounded-lg shadow-sm ${theme.text} font-bold`}>A-</button>
                  </div>
                </div>

                {/* Kanvas Kertas Tulis */}
                <div 
                  ref={editorRef} 
                  contentEditable 
                  onInput={e => setNewContent(e.currentTarget.innerHTML)} 
                  style={{ fontSize: `${fontSize}px` }} 
                  className={`w-full flex-1 outline-none ${mode.textCard} leading-relaxed overflow-y-auto p-4 transition-all ${newPaper} ${newFont}`} 
                  placeholder="Ceritakan apa yang kamu rasakan hari ini..."
                ></div>
              </div>
              <button onClick={handleSaveEntry} disabled={!newTitle.trim()} className={`w-full py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl font-bold shadow-lg ${isDarkMode ? 'shadow-black/50' : theme.shadow} transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] shrink-0`}>
                {editingId ? 'Simpan Perubahan' : 'Simpan Jurnal'}
              </button>
            </div>
          )}

          {currentView === 'read' && activeEntry && (
            <div className={`${mode.bgCard} backdrop-blur-md rounded-3xl shadow-sm border ${mode.border} animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col`}>
              {/* Header Baca */}
              <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-4">
                  {renderEntryLabels(activeEntry.labels)}
                  <div className="flex gap-2">
                    <button onClick={() => setFontSize(f => Math.min(f + 2, 28))} className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800' : theme.bgLight} rounded-lg ${theme.text} font-bold shadow-sm border ${mode.border}`}>A+</button>
                    <button onClick={() => setFontSize(f => Math.max(f - 2, 12))} className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800' : theme.bgLight} rounded-lg ${theme.text} font-bold shadow-sm border ${mode.border}`}>A-</button>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${mode.textMain} mb-1 ${activeEntry.font || 'font-sans'}`}>{activeEntry.title}</h2>
                    <p className={`text-sm ${theme.textLight} font-medium flex items-center gap-2`}>{getTimeIcon(activeEntry.date)}<span>{formatDateTime(activeEntry.date)}</span></p>
                  </div>
                  <div className={`text-4xl ${mode.bgItem} p-2 rounded-2xl shadow-inner shrink-0 ml-2 border ${mode.border}`}>{moods.find(m => m.id === activeEntry.mood)?.emoji}</div>
                </div>
                <div className={`w-12 h-1 bg-gradient-to-r ${theme.gradientLight} mb-2 rounded-full`}></div>
              </div>

              {/* Area Kertas Baca */}
              <div 
                className={`${mode.textCard} p-6 pt-4 pb-12 transition-all ${activeEntry.paper || 'paper-polos'} ${activeEntry.font || 'font-sans'}`} 
                style={{ fontSize: `${fontSize}px` }} 
                dangerouslySetInnerHTML={{ __html: activeEntry.content }} 
              />
            </div>
          )}

          {currentView === 'quotes' && (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
              <div className={`${mode.bgCard} p-5 rounded-3xl shadow-sm border ${mode.border}`}>
                <h3 className={`font-bold ${theme.text} flex items-center gap-2 mb-4`}><Plus size={18} /> Tambah Kutipan Favoritmu</h3>
                <div className="space-y-3">
                  <textarea placeholder="Tulis kutipan indah, ayat, atau motivasi di sini..." value={newQuoteText} onChange={e => setNewQuoteText(e.target.value)} className={`w-full ${mode.bgInput} p-3 rounded-xl shadow-inner border ${mode.border} outline-none focus:ring-2 ${theme.ring} text-sm ${mode.textMain} resize-none h-24`} />
                  <input type="text" placeholder="Sumber (Contoh: QS. Al-Baqarah: 152)" value={newQuoteSource} onChange={e => setNewQuoteSource(e.target.value)} className={`w-full ${mode.bgInput} p-3 rounded-xl shadow-inner border ${mode.border} outline-none focus:ring-2 ${theme.ring} text-sm ${mode.textMain}`} />
                  <button onClick={handleAddQuote} disabled={!newQuoteText.trim()} className={`w-full py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold shadow-md ${isDarkMode ? '' : theme.shadow} transition-all disabled:opacity-50`}>Simpan Kutipan</button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className={`font-bold ${mode.textMain}`}>Daftar Kutipan Aktif ({userQuotes.length})</h3>
                  <button onClick={() => setUserQuotes(defaultQuotes)} className={`text-xs ${theme.textLight} hover:underline font-medium`}>Reset ke Bawaan</button>
                </div>
                {userQuotes.length === 0 ? (
                  <p className={`text-center ${mode.textMuted} py-6 text-sm ${mode.bgInput} rounded-2xl border ${mode.border}`}>Belum ada kutipan. Tambahkan di atas!</p>
                ) : (
                  <div className="space-y-3">
                    {userQuotes.map((quote, index) => (
                      <div key={quote.id || index} draggable onDragStart={e => handleDragStart(e, index)} onDragEnter={e => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={e => e.preventDefault()} className={`${mode.bgCard} backdrop-blur-sm p-4 rounded-2xl shadow-sm border ${mode.border} flex justify-between items-start gap-3 group cursor-move hover:shadow-md transition-all`}>
                        <div className={`pt-1 ${mode.textMuted} group-hover:${theme.text} transition-colors`}><GripVertical size={18} /></div>
                        <div className="flex-1"><p className={`text-sm font-serif italic ${mode.textCard}`}>"{quote.text}"</p><p className={`text-xs font-semibold ${theme.textLight} mt-2`}>— {quote.source}</p></div>
                        <button onClick={() => handleDeleteQuote(index)} className={`${mode.textMuted} hover:text-red-500 transition-colors p-1 ${mode.bgItem} rounded-lg shadow-sm group-hover:opacity-100 opacity-50 cursor-pointer z-10 border ${mode.border}`}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'labels' && (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
              <div className={`${mode.bgCard} p-5 rounded-3xl shadow-sm border ${mode.border}`}>
                <h3 className={`font-bold ${theme.text} flex items-center gap-2 mb-4`}><Tag size={18} /> Buat Label Kategori Baru</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Nama label (misal: Sedih, Pekerjaan, dll)" value={newLabelName} onChange={e => setNewLabelName(e.target.value)} className={`flex-1 ${mode.bgInput} p-3 rounded-xl shadow-inner border ${mode.border} outline-none focus:ring-2 ${theme.ring} text-sm ${mode.textMain}`} />
                  <button onClick={() => { if(!newLabelName.trim()) return; setLabels([...labels, {id: Date.now(), name: newLabelName.trim()}]); setNewLabelName(''); }} disabled={!newLabelName.trim()} className={`px-5 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50`}>Buat</button>
                </div>
              </div>
              <div>
                <h3 className={`font-bold ${mode.textMain} mb-3 px-1`}>Koleksi Label ({labels.length})</h3>
                {labels.length === 0 ? (
                  <p className={`text-center ${mode.textMuted} py-6 text-sm ${mode.bgInput} rounded-2xl border ${mode.border}`}>Belum ada label. Silakan buat di atas.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {labels.map(label => {
                      const count = entries.filter(e => e.labels?.includes(label.id)).length;
                      return (
                        <div key={label.id} className={`${mode.bgCard} backdrop-blur-sm p-4 rounded-2xl shadow-sm border ${mode.border} flex flex-col justify-between hover:shadow-md transition-all`}>
                          <div><h4 className={`font-bold ${mode.textMain} text-sm mb-1 line-clamp-1`}>{label.name}</h4><p className={`text-xs font-medium ${theme.textLight}`}>{count} Catatan</p></div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => { setSelectedLabelFilter(label.id); setCurrentView('home'); }} className={`flex-1 ${isDarkMode ? 'bg-gray-800' : theme.bgLight} ${theme.text} border ${mode.border} py-1.5 rounded-lg text-xs font-bold hover:brightness-95 transition-all shadow-sm`}>Lihat</button>
                            <button onClick={() => setLabels(labels.filter(l => l.id !== label.id))} className={`p-1.5 ${mode.textMuted} ${mode.bgItem} hover:text-red-500 rounded-lg shadow-sm transition-colors border ${mode.border}`}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'trash' && (
            <div className="space-y-4 animate-in fade-in duration-300 pb-10">
              {deletedEntries.length === 0 ? (
                <div className={`text-center py-20 ${mode.textMuted} flex flex-col items-center`}><ArchiveX size={40} className={`mb-3 ${theme.textLight} opacity-50`} /><p>Tempat sampah kosong.</p></div>
              ) : (
                <>
                  <p className={`text-sm text-center ${mode.textMuted} mb-6`}>Catatan di sini dapat dikembalikan atau dihapus selamanya.</p>
                  {deletedEntries.map(entry => (
                    <div key={entry.id} className={`w-full ${mode.bgInput} backdrop-blur-md rounded-2xl shadow-sm border ${mode.border} overflow-hidden opacity-80 hover:opacity-100 transition-opacity`}>
                      <div className="p-5 opacity-70">
                        <h3 className={`font-bold ${mode.textMuted} line-through decoration-gray-400 mb-1 ${entry.font || 'font-sans'}`}>{entry.title}</h3>
                        <div className={`flex items-center gap-1.5 text-xs ${mode.textMuted} mb-2`}>{getTimeIcon(entry.date)}<span>{formatDateTime(entry.date)}</span></div>
                        <p className={`text-sm ${mode.textMuted} line-clamp-1 italic ${entry.font || 'font-sans'}`} dangerouslySetInnerHTML={{ __html: entry.content }}></p>
                      </div>
                      <div className={`px-5 py-2.5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} flex justify-end gap-4 border-t ${mode.border}`}>
                        <button onClick={() => handleRestoreEntry(entry)} className="text-emerald-500 flex items-center gap-1.5 text-xs font-bold hover:text-emerald-600 transition-colors"><RotateCcw size={14} /> Kembalikan</button>
                        <button onClick={() => setDeletedEntries(deletedEntries.filter(e => e.id !== entry.id))} className="text-red-500 flex items-center gap-1.5 text-xs font-bold hover:text-red-600 transition-colors"><ArchiveX size={14} /> Permanen</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {currentView === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
              <div className={`${mode.bgCard} p-6 rounded-3xl shadow-sm border ${mode.border}`}>
                <h3 className={`font-bold ${theme.text} flex items-center gap-2 mb-6`}><Settings size={18} /> Pengaturan Tampilan</h3>
                <div className={`flex items-center justify-between p-4 rounded-2xl ${mode.bgInput} border ${mode.border} mb-6`}>
                  <span className={`font-bold ${mode.textMain} flex items-center gap-2`}>{isDarkMode ? <Moon size={18} className="text-indigo-400"/> : <Sun size={18} className="text-amber-500"/>} Mode Gelap</span>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-7 rounded-full flex items-center p-1 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <div>
                  <span className={`font-bold ${mode.textMain} mb-4 block`}>Pilihan Warna Cat Air</span>
                  <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                    {Object.keys(themeColors).map(t => (
                      <button key={t} onClick={() => setCurrentTheme(t)} className={`w-12 h-12 rounded-full shadow-lg bg-gradient-to-br ${themeColors[t].gradient} flex items-center justify-center border-2 transition-all hover:scale-110 ${currentTheme === t ? 'border-white scale-110 ring-4 ' + themeColors[t].ring : 'border-transparent'}`} title={themeColors[t].name}>
                        {currentTheme === t && <Check size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs ${mode.textMuted} mt-4 text-center sm:text-left`}>Tema saat ini: <span className="font-bold">{themeColors[currentTheme].name}</span></p>
                </div>
              </div>
            </div>
          )}
        </main>

        {currentView === 'home' && !selectedLabelFilter && (
          <div className="absolute bottom-8 right-6 z-50">
            <button onClick={() => { resetForm(); setCurrentView('write'); }} className={`group flex items-center justify-center w-14 h-14 bg-gradient-to-br ${theme.gradient} text-white rounded-full shadow-2xl ${isDarkMode ? 'shadow-black/50' : theme.shadow} hover:brightness-110 hover:-translate-y-1 transition-all duration-300`} title="Tulis Hari Ini">
              <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
