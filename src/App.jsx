import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  PenTool, 
  Eraser, 
  Palette, 
  Save, 
  ChevronLeft,
  AlignJustify,
  Grid as GridIcon,
  Grip,
  File,
  Trash2,
  Paintbrush
} from 'lucide-react';

// --- STYLES & TEMPLATES ---
const paperStyles = {
  lined: { backgroundImage: 'linear-gradient(transparent 95%, #cbd5e1 95%)', backgroundSize: '100% 40px' },
  grid: { backgroundImage: 'linear-gradient(transparent 95%, #cbd5e1 95%), linear-gradient(90deg, transparent 95%, #cbd5e1 95%)', backgroundSize: '40px 40px' },
  dot: { backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '40px 40px' },
  blank: { background: '#ffffff' }
};

const watercolorPalette = [
  '#1e293b', // Slate 800 (Hitam/Abu Tua)
  '#ef4444', // Red (Cerah)
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home'); // 'home', 'templates', 'editor'
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  // --- HOME VIEW ---
  const handleCreateNew = () => {
    setView('templates');
  };

  const handleOpenNote = (note) => {
    setCurrentNote(note);
    setView('editor');
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
  };

  // --- TEMPLATE SELECTION ---
  const handleSelectTemplate = (templateId) => {
    const newNote = {
      id: Date.now().toString(),
      title: `Catatan Baru - ${new Date().toLocaleDateString('id-ID')}`,
      template: templateId,
      canvasData: null, // Akan menyimpan base64 image
      date: new Date().toISOString(),
    };
    setCurrentNote(newNote);
    setView('editor');
  };

  // --- RENDER VIEWS ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col overflow-hidden selection:bg-blue-200">
      {/* Top Navigation / Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <PenTool size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600 tracking-tight">
            Note-Pro
          </h1>
        </div>
        {view !== 'home' && (
          <button 
            onClick={() => {
              if (view === 'editor') {
                // Simpan otomatis saat kembali (ditangani di dalam Editor)
                setView('home');
              } else {
                setView('home');
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 font-medium"
          >
            <Home size={20} />
            <span>Kembali ke Beranda</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex">
        {view === 'home' && (
          <HomeView 
            notes={notes} 
            onCreateNew={handleCreateNew} 
            onOpenNote={handleOpenNote} 
            onDeleteNote={handleDeleteNote}
          />
        )}
        {view === 'templates' && (
          <TemplateSelector onSelect={handleSelectTemplate} />
        )}
        {view === 'editor' && currentNote && (
          <EditorView 
            note={currentNote} 
            onSave={(updatedNote) => {
              setNotes(prev => {
                const exists = prev.find(n => n.id === updatedNote.id);
                if (exists) return prev.map(n => n.id === updatedNote.id ? updatedNote : n);
                return [updatedNote, ...prev];
              });
            }}
          />
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HomeView({ notes, onCreateNew, onOpenNote, onDeleteNote }) {
  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Jurnal & Catatan</h2>
            <p className="text-slate-500">Kelola ide, rencana, dan kreativitas Anda.</p>
          </div>
          <button 
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 text-lg font-semibold"
          >
            <Plus size={24} />
            Catatan Baru
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="bg-slate-100 p-6 rounded-full mb-6 text-slate-400">
              <File size={48} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Belum ada catatan</h3>
            <p className="text-slate-500 max-w-md">Mulai buat jurnal, sketsa, atau planner pertama Anda menggunakan stylus di kanvas profesional.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => onOpenNote(note)}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex flex-col h-72"
              >
                {/* Preview Thumbnail */}
                <div 
                  className="h-40 bg-slate-50 border-b border-slate-100 relative overflow-hidden"
                  style={paperStyles[note.template]}
                >
                  {note.canvasData && (
                    <img src={note.canvasData} alt="Preview" className="w-full h-full object-cover object-top opacity-80" />
                  )}
                </div>
                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{note.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{new Date(note.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-lg capitalize">
                      {note.template === 'blank' ? 'Polos' : note.template}
                    </span>
                    <button 
                      onClick={(e) => onDeleteNote(note.id, e)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                      title="Hapus Catatan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateSelector({ onSelect }) {
  const templates = [
    { id: 'lined', name: 'Bergaris (Lined)', icon: <AlignJustify size={32} />, desc: 'Cocok untuk menulis jurnal atau catatan rapat.' },
    { id: 'dot', name: 'Titik (Dotted)', icon: <Grip size={32} />, desc: 'Ideal untuk Bullet Journal dan sketsa bebas.' },
    { id: 'grid', name: 'Kotak (Grid)', icon: <GridIcon size={32} />, desc: 'Sempurna untuk planner, diagram, dan matematika.' },
    { id: 'blank', name: 'Polos (Blank)', icon: <File size={32} />, desc: 'Kanvas kosong untuk menggambar atau melukis.' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">Pilih Kertas Anda</h2>
        <p className="text-center text-slate-500 mb-12 text-lg">Pilih template awal untuk catatan baru Anda. (Sempurna untuk layar Tab S7 FE)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className="bg-white rounded-3xl p-6 border-2 border-transparent hover:border-blue-500 shadow-md hover:shadow-2xl transition-all flex flex-col items-center text-center group"
            >
              <div 
                className="w-full h-48 rounded-xl border border-slate-200 mb-6 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-50 pointer-events-none" style={paperStyles[tpl.id]}></div>
                <div className="relative z-10 bg-white/80 p-4 rounded-full shadow-sm backdrop-blur-sm">
                  {tpl.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{tpl.name}</h3>
              <p className="text-slate-500 text-sm">{tpl.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorView({ note, onSave }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  
  const [title, setTitle] = useState(note.title);
  const [tool, setTool] = useState('pen'); // 'pen', 'watercolor', 'crayon', 'eraser'
  const [color, setColor] = useState(watercolorPalette[0]);
  const [size, setSize] = useState(3);
  
  // Drawing state (Refs for performance to avoid re-renders during rapid stylus movement)
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    // Set resolusi canvas internal tinggi untuk layar Tab S7 FE (mencegah buram)
    // Kita gunakan ukuran statis A4 proporsional yang bisa di-scroll, atau fit container.
    // Untuk planner, seringkali menggunakan scrollable canvas yang besar.
    const width = 1600; 
    const height = 2400;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // Load existing drawing if any
    if (note.canvasData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = note.canvasData;
    }

  }, [note.id]); // Re-init jika ID note berubah

  // Auto-save mechanism
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 10000); // Auto save setiap 10 detik
    return () => clearInterval(interval);
  }, [title]);

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave({
      ...note,
      title,
      canvasData: dataUrl,
      lastEdited: new Date().toISOString()
    });
  };

  // --- DRAWING LOGIC (Stylus / Touch / Mouse) ---
  
  // Helper: Dapatkan koordinat relatif terhadap canvas (mengatasi scaling/scrolling)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Rasio antara ukuran fisik dan ukuran internal canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      // Deteksi sensitivitas tekanan stylus (jika didukung perangkat, default 0.5)
      pressure: e.pressure !== undefined && e.pointerType === 'pen' ? e.pressure : 0.5 
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    isDrawing.current = true;
    lastX.current = x;
    lastY.current = y;
    
    // Titik awal
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();

    const ctx = ctxRef.current;
    const { x, y, pressure } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);

    // Styling berdasarkan tool yang dipilih
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 10; // Penghapus lebih besar
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      ctx.globalCompositeOperation = tool === 'watercolor' ? 'multiply' : 'source-over';
      ctx.strokeStyle = color;
      
      // Dinamika ukuran dan opacity berdasarkan tekanan stylus (pressure)
      let dynamicLineWidth = size;
      let alpha = 1.0;

      if (tool === 'pen') {
        dynamicLineWidth = size * (0.5 + pressure);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (tool === 'watercolor') {
        dynamicLineWidth = size * 3 * (0.5 + pressure);
        alpha = 0.05 + (pressure * 0.1); // Transparan menumpuk
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (tool === 'crayon') {
        dynamicLineWidth = size * 2 * (0.5 + pressure);
        alpha = 0.7;
        ctx.lineCap = 'square'; // Agak kasar
        ctx.lineJoin = 'miter';
      }

      ctx.lineWidth = dynamicLineWidth;
      
      // Convert hex to rgba for alpha support
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    ctx.stroke();
    ctx.closePath();

    // Tambahkan efek scatter untuk crayon (opsional, basic implementation)
    if (tool === 'crayon' && Math.random() > 0.5) {
      ctx.fillStyle = ctx.strokeStyle;
      const offsetX = (Math.random() - 0.5) * dynamicLineWidth;
      const offsetY = (Math.random() - 0.5) * dynamicLineWidth;
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }

    lastX.current = x;
    lastY.current = y;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    ctxRef.current.globalCompositeOperation = 'source-over'; // Reset
  };

  const clearCanvas = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh kanvas?")) {
      const canvas = canvasRef.current;
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      handleSave();
    }
  };

  return (
    <div className="flex flex-1 w-full h-full bg-slate-200">
      
      {/* Sidebar Tools (Optimized for Left Hand / Right Hand on Tablet) */}
      <aside className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shadow-xl z-20 overflow-y-auto shrink-0">
        
        {/* Tools */}
        <div className="flex flex-col gap-3 w-full px-3">
          <ToolButton icon={<PenTool />} label="Pena" active={tool === 'pen'} onClick={() => setTool('pen')} />
          <ToolButton icon={<Paintbrush />} label="Cat Air" active={tool === 'watercolor'} onClick={() => setTool('watercolor')} />
          <ToolButton icon={<PenTool className="rotate-90" />} label="Krayon" active={tool === 'crayon'} onClick={() => setTool('crayon')} />
          <div className="h-px bg-slate-200 w-full my-1"></div>
          <ToolButton icon={<Eraser />} label="Penghapus" active={tool === 'eraser'} onClick={() => setTool('eraser')} />
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-3 items-center w-full mt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Warna</span>
          {watercolorPalette.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); if(tool==='eraser') setTool('pen'); }}
              className={`w-10 h-10 rounded-full border-4 transition-all ${color === c && tool !== 'eraser' ? 'border-slate-300 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Stroke Size */}
        <div className="mt-auto flex flex-col items-center gap-4 w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ukuran</span>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-32 -rotate-90 origin-center translate-y-16 accent-blue-600"
          />
        </div>
      </aside>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Document Header Toolbar */}
        <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 absolute top-0 left-0 right-0 z-10 shadow-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 w-1/2 placeholder-slate-300"
            placeholder="Judul Catatan..."
          />
          <div className="flex items-center gap-4">
            <button 
              onClick={clearCanvas}
              className="text-slate-400 hover:text-red-500 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Bersihkan Kertas
            </button>
            <button 
              onClick={() => { handleSave(); alert('Tersimpan!'); }}
              className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-md"
            >
              <Save size={18} /> Simpan
            </button>
          </div>
        </div>

        {/* Scrollable Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-300 flex justify-center p-8 pt-24" // pt-24 to offset the absolute header
          style={{ touchAction: 'none' }} // Prevent scrolling while drawing on touch devices
        >
          {/* The Paper Sheet */}
          <div 
            className="bg-white shadow-2xl rounded-sm ring-1 ring-slate-200 relative shrink-0"
            style={{ 
              width: '1200px', // Proporsi seperti kertas binder lebar untuk tablet
              height: '1800px',
              ...paperStyles[note.template]
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerOut={stopDrawing}
              onPointerCancel={stopDrawing}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

// Komponen Pembantu untuk Tombol Sidebar
function ToolButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-200 w-full ${
        active 
          ? 'bg-blue-100 text-blue-700 shadow-inner' 
          : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      {React.cloneElement(icon, { size: 28, strokeWidth: active ? 2.5 : 2 })}
    </button>
  );
}