import React, { useState, useEffect, useRef } from 'react';
import { 
  BookHeart, 
  PenLine, 
  CalendarHeart, 
  ChevronLeft, 
  Sparkles,
  Moon,
  Sun,
  Sunset,
  Menu,
  Trash2,
  Edit3,
  X,
  RotateCcw,
  ArchiveX,
  Bold,
  Italic,
  Underline,
  Palette,
  Search,
  Quote,
  Plus,
  GripVertical,
  Tag
} from 'lucide-react';

// Daftar Kutipan Bawaan (Default)
const defaultQuotes = [
  {
    text: "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "QS. Al-Insyirah: 5-6"
  },
  {
    text: "Janganlah kamu tahzan (bersedih), sesungguhnya Allah bersama kita.",
    source: "QS. At-Taubah: 40"
  },
  {
    text: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
    source: "QS. Ali 'Imran: 173"
  },
  {
    text: "Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu.",
    source: "QS. Ghafir: 60"
  },
  {
    text: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    source: "QS. At-Talaq: 3"
  }
];

const App = () => {
  // 1. State Daftar Catatan (Diperbarui dengan support array labels)
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('diary-muslimah-data');
    if (savedEntries) return JSON.parse(savedEntries);
    return [];
  });

  // 2. State Tempat Sampah
  const [deletedEntries, setDeletedEntries] = useState(() => {
    const savedDeleted = localStorage.getItem('diary-muslimah-trash');
    if (savedDeleted) return JSON.parse(savedDeleted);
    return [];
  });

  // 3. State Ukuran Huruf
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('diary-font-size');
    return savedSize ? parseInt(savedSize) : 16;
  });

  // 4. State Daftar Quote Milik Pengguna
  const [userQuotes, setUserQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem('diary-muslimah-quotes');
    if (savedQuotes) return JSON.parse(savedQuotes);
    return defaultQuotes; 
  });

  // 5. State Daftar Label Pengguna
  const [labels, setLabels] = useState(() => {
    const savedLabels = localStorage.getItem('diary-muslimah-labels');
    if (savedLabels) return JSON.parse(savedLabels);
    return [
      { id: 1, name: 'Penting ✨' },
      { id: 2, name: 'Keluarga 👨‍👩‍👧' },
      { id: 3, name: 'Ibadah 🕋' }
    ];
  });

  // Efek Penyimpanan Otomatis
  useEffect(() => { localStorage.setItem('diary-muslimah-data', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('diary-muslimah-trash', JSON.stringify(deletedEntries)); }, [deletedEntries]);
  useEffect(() => { localStorage.setItem('diary-font-size', fontSize.toString()); }, [fontSize]);
  useEffect(() => { localStorage.setItem('diary-muslimah-quotes', JSON.stringify(userQuotes)); }, [userQuotes]);
  useEffect(() => { localStorage.setItem('diary-muslimah-labels', JSON.stringify(labels)); }, [labels]);

  // States UI & Navigasi
  const [currentView, setCurrentView] = useState('home'); // home, write, read, trash, quotes, labels
  const [activeEntry, setActiveEntry] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // States Form Jurnal & Pencarian
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('senang');
  const [newEntryLabels, setNewEntryLabels] = useState([]); // Label yang dipilih saat menulis
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedLabelFilter, setSelectedLabelFilter] = useState(null); // ID Label untuk filter Home

  // States Form Manajemen
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteSource, setNewQuoteSource] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  
  // State untuk buat label instan saat menulis
  const [isAddingInstantLabel, setIsAddingInstantLabel] = useState(false);
  const [instantLabelName, setInstantLabelName] = useState('');

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const editorRef = useRef(null); 

  const todayDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const safeQuotes = userQuotes.length > 0 ? userQuotes : [{ text: "Tuliskan kutipan inspiratifmu sendiri di menu Atur Quote.", source: "Sistem" }];
  const currentQuote = safeQuotes[todayDays % safeQuotes.length];

  const moods = [
    { id: 'senang', emoji: '🥰', label: 'Alhamdulillah' },
    { id: 'tenang', emoji: '😌', label: 'Tenang' },
    { id: 'semangat', emoji: '✨', label: 'Semangat' },
    { id: 'sedih', emoji: '🥺', label: 'Sedih' },
    { id: 'lelah', emoji: '🥱', label: 'Lelah' }
  ];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const datePart = date.toLocaleDateString('id-ID', optionsDate);
    const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} • ${timePart}`; 
  };

  const getTimeIcon = (dateString, size = 14) => {
    const hour = new Date(dateString).getHours();
    if (hour >= 5 && hour < 15) return <Sun size={size} className="text-amber-500" />;
    if (hour >= 15 && hour < 18) return <Sunset size={size} className="text-orange-400" />;
    return <Moon size={size} className="text-indigo-400" />;
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setNewContent(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  // --- FUNGSI JURNAL ---
  const handleSaveEntry = () => {
    if (!newTitle.trim() || !newContent.trim() || newContent === '<br>') return;
    if (editingId) {
      setEntries(entries.map(entry => entry.id === editingId ? { ...entry, title: newTitle, content: newContent, mood: newMood, labels: newEntryLabels } : entry));
      setEditingId(null);
    } else {
      setEntries([{ id: Date.now(), date: new Date().toISOString(), title: newTitle, content: newContent, mood: newMood, labels: newEntryLabels }, ...entries]);
    }
    resetForm();
    setCurrentView('home');
  };

  const handleEditEntry = (entry) => {
    setEditingId(entry.id); 
    setNewTitle(entry.title); 
    setNewContent(entry.content); 
    setNewMood(entry.mood); 
    setNewEntryLabels(entry.labels || []);
    setCurrentView('write');
  };

  useEffect(() => {
    if (currentView === 'write' && editorRef.current) { editorRef.current.innerHTML = newContent; }
  }, [currentView]);

  const handleDeleteEntry = (entryToMove) => {
    setEntries(entries.filter(e => e.id !== entryToMove.id));
    setDeletedEntries([entryToMove, ...deletedEntries]);
  };

  const handleRestoreEntry = (entryToRestore) => {
    setDeletedEntries(deletedEntries.filter(e => e.id !== entryToRestore.id));
    setEntries([...entries, entryToRestore].sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const resetForm = () => { 
    setEditingId(null); setNewTitle(''); setNewContent(''); setNewMood('senang'); setNewEntryLabels([]); 
  };

  // --- FUNGSI QUOTE ---
  const handleAddQuote = () => {
    if (!newQuoteText.trim()) return;
    setUserQuotes([{ text: newQuoteText, source: newQuoteSource.trim() || "Anonim", id: Date.now() }, ...userQuotes]);
    setNewQuoteText(''); setNewQuoteSource('');
  };
  const handleDeleteQuote = (index) => {
    const updated = [...userQuotes]; updated.splice(index, 1); setUserQuotes(updated);
  };
  
  const handleDragStart = (e, index) => { dragItem.current = index; e.currentTarget.style.opacity = '0.5'; };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copy = [...userQuotes];
      const content = copy[dragItem.current];
      copy.splice(dragItem.current, 1);
      copy.splice(dragOverItem.current, 0, content);
      setUserQuotes(copy);
    }
    dragItem.current = null; dragOverItem.current = null;
  };

  // --- FUNGSI LABEL ---
  const handleAddInstantLabel = () => {
    if (!instantLabelName.trim()) return;
    const newId = Date.now();
    setLabels([...labels, { id: newId, name: instantLabelName.trim() }]);
    setNewEntryLabels([...newEntryLabels, newId]); // Langsung centang
    setInstantLabelName('');
    setIsAddingInstantLabel(false);
  };

  // Filter Beranda (Pencarian Teks & Filter Label)
  const displayedEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLabel = selectedLabelFilter ? (entry.labels && entry.labels.includes(selectedLabelFilter)) : true;
    return matchesSearch && matchesLabel;
  });

  // Render Label di Kartu Catatan
  const renderEntryLabels = (entryLabelsArray) => {
    if (!entryLabelsArray || entryLabelsArray.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2 mb-1">
        {entryLabelsArray.map(labelId => {
          const l = labels.find(x => x.id === labelId);
          return l ? (
            <span key={labelId} className="text-[10px] bg-pink-100/80 border border-pink-200 text-pink-700 px-2 py-0.5 rounded-full font-medium">
              {l.name}
            </span>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAF7F2] font-sans text-gray-800 relative overflow-hidden selection:bg-pink-200 selection:text-pink-900">
      
      {/* Efek Latar Belakang Cat Air */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-teal-100/40 rounded-full blur-[100px] pointer-events-none"></div>

      {/* MENU SLIDE (SIDEBAR) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-pink-100 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-serif font-bold text-pink-500 flex items-center gap-2"><BookHeart size={24} /> Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full"><X size={20} /></button>
          </div>
          <div className="space-y-3">
            <button onClick={() => { setCurrentView('home'); setSelectedLabelFilter(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${currentView === 'home' && !selectedLabelFilter ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 shadow-sm' : 'hover:bg-pink-50 text-gray-600'}`}>
              <CalendarHeart size={20} /> Semua Catatan
            </button>
            <button onClick={() => { setCurrentView('labels'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${currentView === 'labels' ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 shadow-sm' : 'hover:bg-pink-50 text-gray-600'}`}>
              <Tag size={20} /> Koleksi Label
            </button>
            <button onClick={() => { setCurrentView('quotes'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${currentView === 'quotes' ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 shadow-sm' : 'hover:bg-pink-50 text-gray-600'}`}>
              <Quote size={20} /> Atur Quote
            </button>
            <button onClick={() => { setCurrentView('trash'); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl font-medium transition-all ${currentView === 'trash' ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 shadow-sm' : 'hover:bg-pink-50 text-gray-600'}`}>
              <div className="flex items-center gap-3"><Trash2 size={20} /> Sampah</div>
              {deletedEntries.length > 0 && <span className="bg-pink-200 text-pink-700 text-xs py-1 px-2 rounded-full font-bold">{deletedEntries.length}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto h-full bg-white/40 backdrop-blur-sm shadow-xl shadow-pink-100/50 relative z-10 flex flex-col">
        
        {/* HEADER */}
        <header className="pt-10 pb-6 px-6 text-center relative flex justify-center items-center shrink-0">
          {currentView === 'home' ? (
            <button onClick={() => setIsSidebarOpen(true)} className="absolute left-6 p-2 bg-white/60 rounded-full hover:bg-white text-pink-500 transition-colors shadow-sm"><Menu size={20} /></button>
          ) : (
            <button onClick={currentView === 'write' ? () => { resetForm(); setCurrentView('home'); } : () => setCurrentView('home')} className="absolute left-6 p-2 bg-white/60 rounded-full hover:bg-white text-pink-500 transition-colors shadow-sm"><ChevronLeft size={20} /></button>
          )}
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 flex items-center gap-2">
              <BookHeart className="text-pink-400" size={24} /> Catatan Muslimah
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-1">
              {currentView === 'trash' ? 'Tempat Sampah' : currentView === 'quotes' ? 'Koleksi Inspirasi' : currentView === 'labels' ? 'Manajemen Label' : 'Ruang Cerita & Doa'}
            </p>
          </div>
        </header>

        {/* AREA KONTEN */}
        <main className="flex-1 px-6 pb-24 overflow-y-auto">
          
          {/* 1. TAMPILAN BERANDA */}
          {currentView === 'home' && (
            <div className="space-y-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {!selectedLabelFilter && (
                <div className="bg-gradient-to-br from-pink-100/80 to-purple-100/80 rounded-3xl p-6 shadow-sm border border-white/50 relative overflow-hidden">
                  <Sparkles className="absolute top-4 right-4 text-pink-300 opacity-50" size={40} />
                  <p className="text-sm font-serif italic text-gray-700 leading-relaxed relative z-10">"{currentQuote.text}"</p>
                  <p className="text-xs font-semibold text-pink-600 mt-3 relative z-10">— {currentQuote.source}</p>
                </div>
              )}

              {/* TANTANGAN REACT: Live Search Cepat */}
              <div className="relative mt-2">
                <Search className="absolute left-4 top-3.5 text-pink-300" size={18} />
                <input
                  type="text"
                  placeholder="Cari memori atau cerita indahmu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/60 backdrop-blur-md pl-12 pr-4 py-3 rounded-2xl shadow-sm border border-pink-100 focus:border-pink-300 outline-none transition-all text-sm text-gray-700"
                />
              </div>

              {/* INDIKATOR FILTER LABEL */}
              {selectedLabelFilter && (
                <div className="bg-pink-100/80 border border-pink-200 text-pink-700 px-4 py-3 rounded-2xl flex justify-between items-center shadow-sm animate-in fade-in zoom-in">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <Tag size={16}/> Menampilkan label: {labels.find(l => l.id === selectedLabelFilter)?.name}
                  </span>
                  <button onClick={() => setSelectedLabelFilter(null)} className="p-1 bg-white/50 hover:bg-white rounded-full transition-colors text-pink-500">
                    <X size={16}/>
                  </button>
                </div>
              )}

              <div className="flex-1 pb-10">
                {!selectedLabelFilter && (
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                      <CalendarHeart size={18} className="text-pink-400" /> Jurnal Terakhir
                    </h2>
                  </div>
                )}
                
                {entries.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                    <Moon size={40} className="mb-3 text-pink-200" />
                    <p>Belum ada catatan.</p><p className="text-sm">Mulai tulis harimu hari ini!</p>
                  </div>
                ) : displayedEntries.length === 0 ? (
                  <div className="text-center py-8 text-pink-300 bg-white/50 rounded-2xl border border-pink-100">
                    <p>Tidak ada catatan yang ditemukan.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedEntries.map((entry) => (
                      <div key={entry.id} className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-pink-50 hover:shadow-md transition-all group overflow-hidden flex flex-col">
                        <div className="p-5 cursor-pointer flex-1" onClick={() => { setActiveEntry(entry); setCurrentView('read'); }}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{entry.title}</h3>
                            <span className="text-2xl bg-pink-50 w-8 h-8 flex items-center justify-center rounded-full shadow-inner shrink-0 ml-2">{moods.find(m => m.id === entry.mood)?.emoji}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-pink-400 font-medium mb-1">
                            {getTimeIcon(entry.date)}
                            <span>{formatDateTime(entry.date)}</span>
                          </div>
                          {renderEntryLabels(entry.labels)}
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: entry.content }}></p>
                        </div>
                        <div className="px-5 py-2.5 bg-gradient-to-r from-pink-50/50 to-purple-50/50 flex justify-end gap-4 border-t border-pink-100/50">
                          <button onClick={() => handleEditEntry(entry)} className="text-blue-400 flex items-center gap-1.5 text-xs font-bold hover:text-blue-600 transition-colors"><Edit3 size={14} /> Edit</button>
                          <button onClick={() => handleDeleteEntry(entry)} className="text-red-400 flex items-center gap-1.5 text-xs font-bold hover:text-red-600 transition-colors"><Trash2 size={14} /> Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. TAMPILAN TULIS/EDIT JURNAL */}
          {currentView === 'write' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col pb-6">
              <div className="text-center">
                <p className="font-serif text-2xl text-pink-300 mb-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                <p className="text-xs text-gray-400">{editingId ? 'Memperbarui cerita...' : 'Awali dengan nama Allah'}</p>
              </div>

              {/* Panel Mood & Label */}
              <div className="bg-white/60 p-3 rounded-3xl shadow-sm border border-white shrink-0">
                <div className="flex justify-center gap-1 sm:gap-3 mb-3 pb-3 border-b border-pink-100/50">
                  {moods.map((mood) => (
                    <button key={mood.id} onClick={() => setNewMood(mood.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${newMood === mood.id ? 'bg-pink-100 scale-110 shadow-sm ring-2 ring-pink-200' : 'hover:bg-pink-50 opacity-70 hover:opacity-100'}`}>
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[10px] text-gray-600 font-medium hidden sm:block">{mood.label}</span>
                    </button>
                  ))}
                </div>

                {/* Pemilihan Label Multi-centang */}
                <div className="px-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={12}/> Pilih Label</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {labels.map(label => (
                      <button
                        key={label.id}
                        onClick={() => {
                          if (newEntryLabels.includes(label.id)) {
                            setNewEntryLabels(newEntryLabels.filter(id => id !== label.id));
                          } else {
                            setNewEntryLabels([...newEntryLabels, label.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${newEntryLabels.includes(label.id) ? 'bg-pink-400 text-white border-pink-400 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-pink-300 hover:text-pink-500'}`}
                      >
                        {label.name}
                      </button>
                    ))}
                    
                    {/* Tambah Label Instan */}
                    {isAddingInstantLabel ? (
                      <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-pink-300 shadow-inner">
                        <input 
                          autoFocus 
                          value={instantLabelName} 
                          onChange={e => setInstantLabelName(e.target.value)} 
                          className="w-24 text-xs px-2 py-0.5 bg-transparent outline-none text-gray-700" 
                          placeholder="Nama label..." 
                          onKeyDown={e => e.key === 'Enter' && handleAddInstantLabel()} 
                        />
                        <button onClick={handleAddInstantLabel} className="bg-pink-400 text-white p-1 rounded-full hover:bg-pink-500"><Plus size={12}/></button>
                        <button onClick={() => setIsAddingInstantLabel(false)} className="bg-gray-100 text-gray-500 p-1 rounded-full hover:bg-gray-200"><X size={12}/></button>
                      </div>
                    ) : (
                      <button onClick={() => setIsAddingInstantLabel(true)} className="px-3 py-1.5 rounded-full border border-dashed border-pink-300 text-pink-400 bg-pink-50/50 hover:bg-pink-100 flex items-center gap-1 text-xs font-bold transition-colors">
                        <Plus size={12}/> Baru
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-white/60 p-4 rounded-3xl shadow-inner border border-white/50 min-h-[300px]">
                <input
                  type="text"
                  placeholder="Beri judul ceritamu..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-gray-800 placeholder-gray-400 border-b-2 border-pink-100 focus:border-pink-300 outline-none pb-3 mb-4 transition-colors shrink-0"
                />
                
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-pink-50/50 p-2 rounded-xl shrink-0">
                  <div className="flex gap-2">
                    <button onClick={() => applyFormat('bold')} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50"><Bold size={16}/></button>
                    <button onClick={() => applyFormat('italic')} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50"><Italic size={16}/></button>
                    <button onClick={() => applyFormat('underline')} className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50"><Underline size={16}/></button>
                    <div className="relative inline-block overflow-hidden rounded-lg shadow-sm bg-white p-1 hover:bg-pink-50">
                      <Palette size={20} className="text-gray-600 pointer-events-none mx-1" />
                      <input type="color" onChange={(e) => applyFormat('foreColor', e.target.value)} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="flex gap-1 border-l-2 border-pink-100 pl-2">
                    <button onClick={() => setFontSize(f => Math.min(f + 2, 28))} className="px-3 py-1 bg-white rounded-lg shadow-sm text-pink-600 font-bold hover:bg-pink-100">A+</button>
                    <button onClick={() => setFontSize(f => Math.max(f - 2, 12))} className="px-3 py-1 bg-white rounded-lg shadow-sm text-pink-600 font-bold hover:bg-pink-100">A-</button>
                  </div>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setNewContent(e.currentTarget.innerHTML)}
                  style={{ fontSize: `${fontSize}px` }}
                  className="w-full flex-1 outline-none text-gray-700 leading-relaxed overflow-y-auto"
                  placeholder="Ceritakan apa yang kamu rasakan hari ini..."
                ></div>
              </div>

              <button
                onClick={handleSaveEntry}
                disabled={!newTitle.trim()}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] shrink-0"
              >
                {editingId ? 'Simpan Perubahan' : 'Simpan Jurnal'}
              </button>
            </div>
          )}

          {/* 3. TAMPILAN BACA JURNAL */}
          {currentView === 'read' && activeEntry && (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-pink-50 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4">
                {renderEntryLabels(activeEntry.labels)}
                <div className="flex gap-2">
                  <button onClick={() => setFontSize(f => Math.min(f + 2, 28))} className="px-3 py-1 bg-pink-100 rounded-lg text-pink-700 font-bold hover:bg-pink-200 shadow-sm transition-colors">A+</button>
                  <button onClick={() => setFontSize(f => Math.max(f - 2, 12))} className="px-3 py-1 bg-pink-100 rounded-lg text-pink-700 font-bold hover:bg-pink-200 shadow-sm transition-colors">A-</button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{activeEntry.title}</h2>
                  <p className="text-sm text-pink-500 font-medium flex items-center gap-2">
                    {getTimeIcon(activeEntry.date)}
                    <span>{formatDateTime(activeEntry.date)}</span>
                  </p>
                </div>
                <div className="text-4xl bg-pink-50 p-2 rounded-2xl shadow-inner shrink-0 ml-2">{moods.find(m => m.id === activeEntry.mood)?.emoji}</div>
              </div>
              
              <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-transparent mb-6 rounded-full"></div>
              
              <div 
                className="text-gray-700 leading-loose whitespace-pre-wrap break-words pb-8" 
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: activeEntry.content }}
              />
            </div>
          )}

          {/* 4. TAMPILAN MANAJEMEN QUOTE */}
          {currentView === 'quotes' && (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
              <div className="bg-white/60 p-5 rounded-3xl shadow-sm border border-white">
                <h3 className="font-bold text-pink-600 flex items-center gap-2 mb-4"><Plus size={18} /> Tambah Kutipan Favoritmu</h3>
                <div className="space-y-3">
                  <textarea placeholder="Tulis kutipan indah, ayat, atau motivasi di sini..." value={newQuoteText} onChange={(e) => setNewQuoteText(e.target.value)} className="w-full bg-white/50 p-3 rounded-xl shadow-inner border border-pink-50 outline-none focus:border-pink-300 text-sm text-gray-700 resize-none h-24" />
                  <input type="text" placeholder="Sumber (Contoh: QS. Al-Baqarah: 152)" value={newQuoteSource} onChange={(e) => setNewQuoteSource(e.target.value)} className="w-full bg-white/50 p-3 rounded-xl shadow-inner border border-pink-50 outline-none focus:border-pink-300 text-sm text-gray-700" />
                  <button onClick={handleAddQuote} disabled={!newQuoteText.trim()} className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold shadow-md shadow-pink-200 transition-all disabled:opacity-50">Simpan Kutipan</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="font-bold text-gray-700">Daftar Kutipan Aktif ({userQuotes.length})</h3>
                  <button onClick={() => setUserQuotes(defaultQuotes)} className="text-xs text-pink-500 hover:underline font-medium">Reset ke Bawaan</button>
                </div>
                {userQuotes.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm bg-white/50 rounded-2xl border border-pink-50">Belum ada kutipan. Tambahkan di atas!</p>
                ) : (
                  <div className="space-y-3">
                    {userQuotes.map((quote, index) => (
                      <div key={quote.id || index} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()} className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-pink-50 flex justify-between items-start gap-3 group cursor-move hover:shadow-md hover:border-pink-200 transition-all">
                        <div className="pt-1 text-gray-300 group-hover:text-pink-300 transition-colors"><GripVertical size={18} /></div>
                        <div className="flex-1">
                          <p className="text-sm font-serif italic text-gray-700">"{quote.text}"</p>
                          <p className="text-xs font-semibold text-pink-500 mt-2">— {quote.source}</p>
                        </div>
                        <button onClick={() => handleDeleteQuote(index)} className="text-gray-300 hover:text-red-500 transition-colors p-1 bg-white rounded-lg shadow-sm group-hover:opacity-100 opacity-50 cursor-pointer z-10" title="Hapus Kutipan"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. TAMPILAN MANAJEMEN LABEL */}
          {currentView === 'labels' && (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
              <div className="bg-white/60 p-5 rounded-3xl shadow-sm border border-white">
                <h3 className="font-bold text-pink-600 flex items-center gap-2 mb-4"><Tag size={18} /> Buat Label Kategori Baru</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama label (misal: Sedih, Pekerjaan, dll)"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    className="flex-1 bg-white/50 p-3 rounded-xl shadow-inner border border-pink-50 outline-none focus:border-pink-300 text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      if(!newLabelName.trim()) return;
                      setLabels([...labels, {id: Date.now(), name: newLabelName.trim()}]);
                      setNewLabelName('');
                    }}
                    disabled={!newLabelName.trim()}
                    className="px-5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold shadow-md shadow-pink-200 transition-all disabled:opacity-50"
                  >
                    Buat
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 mb-3 px-1">Koleksi Label ({labels.length})</h3>
                {labels.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm bg-white/50 rounded-2xl border border-pink-50">Belum ada label. Silakan buat di atas.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {labels.map(label => {
                      const count = entries.filter(e => e.labels && e.labels.includes(label.id)).length;
                      return (
                        <div key={label.id} className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-pink-50 flex flex-col justify-between hover:shadow-md transition-all">
                          <div>
                            <h4 className="font-bold text-gray-700 text-sm mb-1 line-clamp-1">{label.name}</h4>
                            <p className="text-xs font-medium text-pink-400">{count} Catatan</p>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button 
                              onClick={() => { setSelectedLabelFilter(label.id); setCurrentView('home'); }}
                              className="flex-1 bg-pink-100 text-pink-600 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-200 transition-colors shadow-sm"
                            >
                              Lihat
                            </button>
                            <button 
                              onClick={() => setLabels(labels.filter(l => l.id !== label.id))}
                              className="p-1.5 text-gray-400 bg-white hover:text-red-500 hover:bg-red-50 rounded-lg shadow-sm transition-colors border border-gray-100"
                              title="Hapus Label"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. TAMPILAN TEMPAT SAMPAH (TRASH) */}
          {currentView === 'trash' && (
            <div className="space-y-4 animate-in fade-in duration-300 pb-10">
              {deletedEntries.length === 0 ? (
                <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                  <ArchiveX size={40} className="mb-3 text-pink-200" /><p>Tempat sampah kosong.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-center text-gray-500 mb-6">Catatan di sini dapat dikembalikan atau dihapus selamanya.</p>
                  {deletedEntries.map((entry) => (
                    <div key={entry.id} className="w-full bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <div className="p-5 opacity-70">
                        <h3 className="font-bold text-gray-600 line-through decoration-gray-300 mb-1">{entry.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          {getTimeIcon(entry.date)}
                          <span>{formatDateTime(entry.date)}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 italic" dangerouslySetInnerHTML={{ __html: entry.content }}></p>
                      </div>
                      <div className="px-5 py-2.5 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
                        <button onClick={() => handleRestoreEntry(entry)} className="text-emerald-500 flex items-center gap-1.5 text-xs font-bold hover:text-emerald-600 transition-colors"><RotateCcw size={14} /> Kembalikan</button>
                        <button onClick={() => setDeletedEntries(deletedEntries.filter(e => e.id !== entry.id))} className="text-red-500 flex items-center gap-1.5 text-xs font-bold hover:text-red-700 transition-colors"><ArchiveX size={14} /> Hapus Permanen</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

        </main>

        {/* TOMBOL FAB (FLOATING ACTION BUTTON) */}
        {currentView === 'home' && !selectedLabelFilter && (
          <div className="absolute bottom-8 right-6 z-50">
            <button
              onClick={() => { resetForm(); setCurrentView('write'); }}
              className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-400 text-white rounded-full shadow-2xl shadow-pink-300/50 hover:shadow-pink-400/60 hover:-translate-y-1 transition-all duration-300"
              title="Tulis Hari Ini"
            >
              <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
