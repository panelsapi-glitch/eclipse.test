/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Bell, 
  ChevronRight, 
  Globe, 
  Coins, 
  Wallet, 
  MessageCircle, 
  User, 
  Home,
  LayoutGrid,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Settings,
  QrCode,
  Shield,
  Zap,
  Smartphone,
  ShoppingBag,
  History,
  ChevronLeft,
  AlertTriangle,
  Check,
  Heart,
  PlusCircle,
  ArrowUp,
  MapPin,
  CreditCard,
  Building2,
  Tag,
  ShieldCheck,
  LogOut,
  X,
  Info,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

type Tab = 'home' | 'wallet' | 'cs' | 'id';

interface Transaction {
  id: string;
  type: 'pulsa' | 'data' | 'Merch';
  amount: number;
  phoneNumber: string;
  date: string;
  status: 'Berhasil' | 'Proses' | 'Gagal';
}

const WELCOME_SLIDES = [
  {
    title: "Selamat Datang di Eclipse",
    description: "Masa depan finansial digital di tangan Anda.",
    icon: <Zap className="w-12 h-12 text-white fill-white" />,
    color: "bg-blue-600",
    glow: "shadow-[0_0_40px_rgba(37,99,235,0.4)]",
    bgGradient: "from-blue-500/20",
    accent: "bg-pink-500/30"
  },
  {
    title: "Keamanan Terjamin",
    description: "Identitas digital Anda terlindungi dengan enkripsi terbaru.",
    icon: <Shield className="w-12 h-12 text-white fill-white" />,
    color: "bg-emerald-600",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.4)]",
    bgGradient: "from-emerald-500/20",
    accent: "bg-yellow-500/30"
  },
  {
    title: "Ekosistem Global",
    description: "Terhubung dengan jutaan pengguna di seluruh dunia.",
    icon: <Globe className="w-12 h-12 text-white fill-white" />,
    color: "bg-indigo-600",
    glow: "shadow-[0_0_40px_rgba(79,70,229,0.4)]",
    bgGradient: "from-indigo-500/20",
    accent: "bg-purple-500/30"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPulsaPage, setShowPulsaPage] = useState(false);
  const [showMerchPage, setShowMerchPage] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showMerchCheckout, setShowMerchCheckout] = useState(false);
  const [merchAddress, setMerchAddress] = useState({ name: '', phone: '', address: '' });
  const [merchPayment, setMerchPayment] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pulsaTab, setPulsaTab] = useState<'pulsa' | 'data'>('pulsa');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [walletSubView, setWalletSubView] = useState<'main' | 'history'>('main');
  const [showScanner, setShowScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatMessages, setAIChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [assetPrices, setAssetPrices] = useState<{
    bitcoin: { idr: number; idr_24h_change: number };
    ethereum: { idr: number; idr_24h_change: number };
    gold: { idr: number; idr_24h_change: number };
  }>({
    bitcoin: { idr: 0, idr_24h_change: 0 },
    ethereum: { idr: 0, idr_24h_change: 0 },
    gold: { idr: 0, idr_24h_change: 0 }
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,pax-gold&vs_currencies=idr&include_24hr_change=true');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data && data.bitcoin && data.ethereum && data['pax-gold']) {
          setAssetPrices({
            bitcoin: data.bitcoin,
            ethereum: data.ethereum,
            gold: {
              idr: data['pax-gold'].idr / 31.1035,
              idr_24h_change: data['pax-gold'].idr_24h_change
            }
          });
        }
      } catch (error) {
        // If fetch fails, we can add a tiny random jitter to existing prices 
        // to keep the UI feeling "live" while waiting for next successful fetch
        setAssetPrices(prev => ({
          bitcoin: {
            idr: prev.bitcoin.idr > 0 ? prev.bitcoin.idr + (Math.random() - 0.5) * 1000 : 0,
            idr_24h_change: prev.bitcoin.idr_24h_change
          },
          ethereum: {
            idr: prev.ethereum.idr > 0 ? prev.ethereum.idr + (Math.random() - 0.5) * 500 : 0,
            idr_24h_change: prev.ethereum.idr_24h_change
          },
          gold: {
            idr: prev.gold.idr > 0 ? prev.gold.idr + (Math.random() - 0.5) * 100 : 0,
            idr_24h_change: prev.gold.idr_24h_change
          }
        }));
        console.warn('Price update failed (likely rate limit or CORS), using last known prices with jitter.');
      }
    };

    fetchPrices();
    // Update every 5 seconds as requested
    const interval = setInterval(fetchPrices, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleScanClick = async () => {
    setShowScanner(true);
  };



  const toggleFlashlight = async () => {
    if (!streamRef.current) return;
    
    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    
    if (!capabilities.torch) {
      alert("Senter tidak didukung pada perangkat ini.");
      return;
    }

    try {
      const newFlashlightState = !flashlightOn;
      await track.applyConstraints({
        advanced: [{ torch: newFlashlightState }]
      } as any);
      setFlashlightOn(newFlashlightState);
    } catch (err) {
      console.error("Error toggling flashlight:", err);
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would process the QR code from the image here
      alert(`File "${file.name}" berhasil diunggah. Memproses kode QR...`);
      setShowScanner(false);
    }
  };

  const sendMessageToAI = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...aiChatMessages, { role: 'user' as const, text }];
    setAIChatMessages(newMessages);
    setIsTyping(true);

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: newMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "Anda adalah asisten virtual Eclipse, aplikasi pembayaran dan gaya hidup. Bantu pengguna dengan pertanyaan mereka tentang aplikasi, transaksi, dan fitur lainnya. Gunakan bahasa Indonesia yang ramah dan profesional."
        }
      });

      const aiResponse = response.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
      setAIChatMessages([...newMessages, { role: 'model' as const, text: aiResponse }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setAIChatMessages([...newMessages, { role: 'model' as const, text: "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.error("Camera access error:", err);
        setHasCameraPermission(false);
        if (showScanner) {
          alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.");
          setShowScanner(false);
        }
      }
    };

    if (showScanner) {
      startCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setFlashlightOn(false);
      }
    };
  }, [showScanner]);

  useEffect(() => {
    if (activeTab === 'home') {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % WELCOME_SLIDES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Featured Slider: Eclipse Welcome */}
            <section className="relative overflow-hidden rounded-3xl bg-black h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-6 flex flex-col justify-end"
                >
                  <div className={`absolute top-10 left-10 w-12 h-12 ${WELCOME_SLIDES[slideIndex].accent} rounded-full blur-xl`}></div>
                  <div className="absolute top-20 right-10 w-16 h-16 bg-orange-400/30 rounded-full blur-xl"></div>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${WELCOME_SLIDES[slideIndex].bgGradient} rounded-full blur-3xl`}></div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-24 h-24 ${WELCOME_SLIDES[slideIndex].color} rounded-full flex items-center justify-center ${WELCOME_SLIDES[slideIndex].glow}`}>
                      {WELCOME_SLIDES[slideIndex].icon}
                    </div>
                  </div>

                  <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                     <img src={`https://picsum.photos/seed/slide-${slideIndex}-1/100/100`} alt="" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                     <img src={`https://picsum.photos/seed/slide-${slideIndex}-2/100/100`} alt="" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                    <div className="max-w-[70%]">
                      <h2 className="text-white text-xl font-bold">{WELCOME_SLIDES[slideIndex].title}</h2>
                      <p className="text-slate-400 text-sm">{WELCOME_SLIDES[slideIndex].description}</p>
                    </div>
                    <button 
                      className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                      Mulai
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Slide Indicators */}
              <div className="absolute top-6 right-6 flex space-x-1.5 z-20">
                {WELCOME_SLIDES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </section>

            {/* Mini App Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Mini App</h3>
                <button className="text-slate-500 text-sm flex items-center font-medium">
                  Dapatkan lebih banyak <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-y-6">
                <button 
                  onClick={() => setShowPulsaPage(true)}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      1
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">Pulsa/Data</span>
                </button>

                <button 
                  onClick={() => setShowMerchPage(true)}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Merch</span>
                </button>

                <button 
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Network</span>
                </button>

                <button 
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <Coins className="w-8 h-8 text-slate-300" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">Eclipse Coin</span>
                </button>

                <button 
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">P</span>
                  </div>
                  <span className="text-xs font-medium text-slate-600">Pool</span>
                </button>
              </div>
            </section>

            {/* Untuk Kamu Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Untuk Kamu</h3>
                <button className="text-slate-500 text-sm flex items-center font-medium">
                  Baru dan terkenal <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  className="w-full bg-slate-50 rounded-2xl p-4 flex items-center space-x-4 text-left"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Klaim Hadiah</h4>
                    <p className="text-xs text-slate-500">Dapatkan Eclipse Coin gratis hari ini</p>
                  </div>
                </button>
              </div>
            </section>
          </motion.div>
        );
      case 'wallet':
        if (walletSubView === 'history') {
          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setWalletSubView('main')}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
              </div>

              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
                  <History className="w-16 h-16" />
                  <p className="font-medium">Belum ada transaksi</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((trx) => (
                    <div key={trx.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trx.type === 'pulsa' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 capitalize">{trx.type} {trx.amount.toLocaleString('id-ID')}</p>
                            <p className="text-xs text-slate-500">{trx.date}</p>
                          </div>
                        </div>
                        <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                          {trx.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Nomor Tujuan</p>
                          <p className="text-sm font-bold text-slate-700">{trx.phoneNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">ID Transaksi</p>
                          <p className="text-xs font-mono text-slate-500">{trx.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        }
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-blue-300/80 text-xs font-bold uppercase tracking-widest">Saldo Aktif</p>
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-blue-300/60 hover:text-blue-300 transition-colors"
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">
                      {showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp ******'}
                    </h2>
                  </div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                    <Wallet className="w-6 h-6 text-blue-300" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <button 
                    onClick={() => setBalance(prev => prev + 100000)}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-active:scale-95 transition-all">
                      <PlusCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-100/80">Top Up</span>
                  </button>
                  <button 
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-active:scale-95 transition-all">
                      <ArrowUp className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-100/80">Kirim</span>
                  </button>
                  <button 
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-active:scale-95 transition-all">
                      <Heart className="w-7 h-7 text-pink-400" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-100/80">Donasi</span>
                  </button>
                  <button 
                    onClick={() => setWalletSubView('history')}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-active:scale-95 transition-all">
                      <History className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-100/80">Riwayat</span>
                  </button>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Aset Digital</h3>
                <button className="text-blue-600 text-xs font-bold flex items-center">
                  Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Bitcoin */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                      <Coins className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Bitcoin</h4>
                      <p className="text-xs text-slate-500">BTC / IDR</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      Rp {assetPrices.bitcoin.idr ? assetPrices.bitcoin.idr.toLocaleString('id-ID') : '---'}
                    </p>
                    <div className={`flex items-center justify-end text-[10px] font-bold ${assetPrices.bitcoin.idr_24h_change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {assetPrices.bitcoin.idr_24h_change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                      {Math.abs(assetPrices.bitcoin.idr_24h_change).toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Emas */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Emas Antam</h4>
                      <p className="text-xs text-slate-500">XAU / IDR (per gram)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      Rp {assetPrices.gold.idr.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                    <div className={`flex items-center justify-end text-[10px] font-bold ${assetPrices.gold.idr_24h_change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {assetPrices.gold.idr_24h_change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                      {Math.abs(assetPrices.gold.idr_24h_change).toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Ethereum */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <Globe className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Ethereum</h4>
                      <p className="text-xs text-slate-500">ETH / IDR</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      Rp {assetPrices.ethereum.idr ? assetPrices.ethereum.idr.toLocaleString('id-ID') : '---'}
                    </p>
                    <div className={`flex items-center justify-end text-[10px] font-bold ${assetPrices.ethereum.idr_24h_change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {assetPrices.ethereum.idr_24h_change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                      {Math.abs(assetPrices.ethereum.idr_24h_change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        );
      case 'cs':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Customer Service</h2>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-12 h-12 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Butuh Bantuan?</h3>
                  <p className="text-slate-500 text-sm">Tim kami siap membantu Anda 24/7 untuk segala kendala transaksi.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowAIChat(true)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  <span>Chat AI</span>
                </button>
                <button 
                  className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 active:scale-95 transition-all"
                >
                  <Globe className="w-5 h-5" />
                  <span>Pusat Bantuan</span>
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 'id':
        if (isLoggedIn) {
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pb-32"
            >
              {/* Profile Card */}
              <div className="w-full aspect-[16/9] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl border-2 border-white/20 p-1">
                        <div className="w-full h-full rounded-2xl bg-slate-800 overflow-hidden">
                          <img src="https://picsum.photos/seed/user/200/200" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Panels API</h3>
                        <p className="text-blue-300 text-xs font-medium">Eclipse ID: ECL-8829-X012</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <QrCode className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">Akun Terverifikasi</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg uppercase tracking-widest font-bold">Pro</span>
                  </div>
                </div>
              </div>

              {/* Menu Sections */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Pengaturan</h4>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                          <Settings className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold">General Settings</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        setBalance(0);
                      }}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-red-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold">Keluar Akun</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 pb-32"
          >
            {/* Header with Settings */}
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-bold">Eclipse ID</h2>
              <button className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-transform">
                <Settings className="w-6 h-6" />
              </button>
            </div>

            {/* Welcome Section */}
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center shadow-xl shadow-blue-200">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="text-center px-6">
                <h3 className="text-xl font-bold">Selamat Datang</h3>
                <p className="text-slate-400 text-sm mt-1">Masuk untuk mengakses semua fitur Eclipse ID Anda</p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3 px-2">
              <button 
                onClick={() => {
                  setIsLoggedIn(true);
                  setBalance(500000);
                }}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-3xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
              >
                Masuk (Login)
              </button>
              <button className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-4 rounded-3xl active:scale-[0.98] transition-transform">
                Daftar (Sign Up)
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-4 pt-4 px-2">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">Privacy & Security</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
                <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">About</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-8">
              <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-bold">Eclipse Version 2.4.0</p>
            </div>
          </motion.div>
        );
    }
  };

  if (showMerchPage) {
    if (showMerchCheckout) {
      return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <header className="flex items-center px-6 py-4 sticky top-0 bg-white z-30 border-b border-slate-100">
            <button 
              onClick={() => setShowMerchCheckout(false)}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-4"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold">Checkout Merch</h1>
          </header>

          <main className="p-6 space-y-8 pb-40">
            {/* Alamat Pengiriman */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 px-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Alamat Pengiriman</h3>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Nama Penerima</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap"
                    value={merchAddress.name}
                    onChange={(e) => setMerchAddress({...merchAddress, name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 08123456789"
                    value={merchAddress.phone}
                    onChange={(e) => setMerchAddress({...merchAddress, phone: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">Alamat Lengkap</label>
                  <textarea 
                    placeholder="Masukkan alamat lengkap pengiriman"
                    rows={3}
                    value={merchAddress.address}
                    onChange={(e) => setMerchAddress({...merchAddress, address: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Metode Pembayaran */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 px-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Metode Pembayaran</h3>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'wallet', name: 'Eclipse Wallet', icon: <Wallet className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
                  { id: 'qris', name: 'QRIS All Payment', icon: <QrCode className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
                  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: <Building2 className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' }
                ].map((method) => (
                  <button 
                    key={method.id}
                    onClick={() => setMerchPayment(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${merchPayment === method.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center`}>
                        {method.icon}
                      </div>
                      <span className="font-bold text-sm">{method.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${merchPayment === method.id ? 'border-blue-600 bg-blue-600' : 'border-slate-200'}`}>
                      {merchPayment === method.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Ringkasan Pesanan */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold">Ringkasan Pesanan</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Eclipse Merch v1 (Size {selectedSize})</span>
                <span className="font-bold">Rp 150.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ongkos Kirim</span>
                <span className="font-bold">Rp 0 (Promo)</span>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Pembayaran</span>
                <span className="text-xl font-black text-blue-600">Rp 150.000</span>
              </div>
            </section>
          </main>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
            <button 
              disabled={!merchAddress.name || !merchAddress.phone || !merchAddress.address || !merchPayment}
              onClick={() => {
                if (balance < 150000) {
                  setShowInsufficientBalance(true);
                  return;
                }
                const newTransaction: Transaction = {
                  id: `TRX-MERCH-${Math.floor(Math.random() * 1000000)}`,
                  type: 'Merch',
                  amount: 150000,
                  phoneNumber: merchAddress.phone,
                  date: new Date().toLocaleString('id-ID', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }),
                  status: 'Berhasil'
                };
                setBalance(prev => prev - 150000);
                setTransactions(prev => [newTransaction, ...prev]);
                setIsSuccess(true);
                setShowMerchCheckout(false);
                setShowMerchPage(false);
                setSelectedSize(null);
                setMerchAddress({ name: '', phone: '', address: '' });
                setMerchPayment(null);
              }}
              className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all ${(!merchAddress.name || !merchAddress.phone || !merchAddress.address || !merchPayment) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-200 active:scale-95'}`}
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <header className="flex items-center px-6 py-4 sticky top-0 bg-white z-30 border-b border-slate-100">
          <button 
            onClick={() => {
              setShowMerchPage(false);
              setSelectedSize(null);
            }}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold">Eclipse Merch</h1>
        </header>

        <main className="p-6 space-y-8 pb-32">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="aspect-square bg-slate-100 relative">
              <img 
                src="https://picsum.photos/seed/merch-v1/800/800" 
                alt="Eclipse Official Merch v1" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Limited Edition
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Eclipse Official Merch v1</h2>
                <p className="text-blue-600 text-2xl font-bold">Rp 150.000</p>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Deskripsi Produk</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  T-shirt eksklusif dari Eclipse dengan bahan katun premium 24s yang nyaman dipakai sepanjang hari. 
                  Menampilkan desain minimalis "Eclipse v1" di bagian dada dengan sablon berkualitas tinggi yang tahan lama.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Bahan</p>
                  <p className="text-sm font-bold">Cotton 24s</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Warna</p>
                  <p className="text-sm font-bold">Deep Black</p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="font-bold text-lg px-2">Pilih Ukuran</h3>
            <div className="flex space-x-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${selectedSize === size ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-xs text-red-500 font-medium px-2">Silakan pilih ukuran terlebih dahulu</p>
            )}
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
          <div className="max-w-md mx-auto flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Harga Total</p>
              <p className="text-xl font-bold text-slate-900">Rp 150.000</p>
            </div>
            <button 
              onClick={() => {
                if (selectedSize) {
                  setShowMerchCheckout(true);
                }
              }}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${selectedSize ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {selectedSize ? 'Check Out' : 'Pilih Ukuran'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPulsaPage) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="flex items-center px-6 py-4 sticky top-0 bg-white z-30 border-b border-slate-50">
          <button 
            onClick={() => {
              setShowPulsaPage(false);
              setSelectedAmount(null);
              setShowCheckout(false);
              setIsSuccess(false);
            }}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold">Pulsa/Data</h1>
        </header>

        <main className="px-6 pt-8 space-y-8">
          <section className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Nomor Handphone</label>
            <div className="relative">
              <input 
                type="tel"
                placeholder="08xx xxxx xxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                setPulsaTab('pulsa');
                setSelectedAmount(null);
              }}
              className={`py-4 rounded-2xl font-bold transition-all ${pulsaTab === 'pulsa' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'}`}
            >
              Pulsa
            </button>
            <button 
              onClick={() => {
                setPulsaTab('data');
                setSelectedAmount(null);
              }}
              className={`py-4 rounded-2xl font-bold transition-all ${pulsaTab === 'data' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'}`}
            >
              Paket Data
            </button>
          </section>

          <section className="space-y-4">
            {pulsaTab === 'pulsa' ? (
              <div className="grid grid-cols-2 gap-4">
                {[5000, 10000, 25000, 50000, 100000, 500000].map((amount) => (
                  <button 
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-6 border rounded-2xl text-left transition-all group relative overflow-hidden ${selectedAmount === amount ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50'}`}
                  >
                    {selectedAmount === amount && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 rounded-bl-2xl flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    <p className={`text-xs mb-1 ${selectedAmount === amount ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>Pulsa</p>
                    <p className="text-lg font-bold">Rp {amount.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-emerald-600 mt-2 font-medium">Tersedia</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-900">Maintenance</h4>
                  <p className="text-sm text-slate-500">Layanan paket data sedang dalam perbaikan</p>
                </div>
              </div>
            )}
          </section>
        </main>

        <AnimatePresence>
          {selectedAmount && pulsaTab === 'pulsa' && !showCheckout && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 font-medium">Total Pembayaran</p>
                  <p className="text-xl font-bold text-blue-600">Rp {selectedAmount.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Nomor: {phoneNumber || '-'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
              >
                Beli Sekarang
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckout && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full bg-white rounded-t-[40px] p-8 pb-12"
              >
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8" />
                
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Konfirmasi Pembelian</h2>
                    <p className="text-slate-500 text-sm mt-1">Mohon periksa kembali detail pesanan Anda</p>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Nomor Handphone</span>
                      <span className="font-bold text-slate-900">{phoneNumber || 'Tidak ada nomor'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Produk</span>
                      <span className="font-bold text-slate-900">Pulsa Rp {selectedAmount?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-px bg-slate-200 w-full" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-bold">Total Bayar</span>
                      <span className="text-2xl font-bold text-blue-600">Rp {selectedAmount?.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {isSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center py-6 space-y-4"
                    >
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900">Pembelian Berhasil!</h3>
                        <p className="text-slate-500">Pulsa akan segera dikirim ke nomor Anda.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowPulsaPage(false);
                          setShowCheckout(false);
                          setSelectedAmount(null);
                          setIsSuccess(false);
                        }}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-4"
                      >
                        Selesai
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative h-20 bg-slate-100 rounded-3xl p-2 flex items-center overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Geser untuk Konfirmasi</span>
                        </div>
                        
                        <motion.div 
                          drag="x"
                          dragConstraints={{ left: 0, right: 240 }}
                          dragElastic={0.1}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 180) {
                              if (balance < selectedAmount!) {
                                setShowInsufficientBalance(true);
                                return;
                              }
                              const newTransaction: Transaction = {
                                id: `TRX-${Math.floor(Math.random() * 1000000)}`,
                                type: pulsaTab,
                                amount: selectedAmount!,
                                phoneNumber: phoneNumber || '081234567890',
                                date: new Date().toLocaleString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                }),
                                status: 'Berhasil'
                              };
                              setBalance(prev => prev - selectedAmount!);
                              setTransactions(prev => [newTransaction, ...prev]);
                              setIsSuccess(true);
                            }
                          }}
                          className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg shadow-blue-200 z-10"
                        >
                          <ChevronRight className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                      
                      <button 
                        onClick={() => setShowCheckout(false)}
                        className="w-full text-slate-400 font-bold py-2 text-sm"
                      >
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showInsufficientBalance && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-[40px] p-8 text-center space-y-6 shadow-2xl"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Saldo Tidak Cukup</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Saldo anda tidak cukup untuk melakukan transaksi ini. Silakan isi saldo terlebih dahulu.
                  </p>
                </div>
                <div className="flex flex-col space-y-3 pt-2">
                  <button 
                    onClick={() => {
                      setShowInsufficientBalance(false);
                      setShowCheckout(false);
                      setShowMerchCheckout(false);
                      setShowPulsaPage(false);
                      setShowMerchPage(false);
                      setActiveTab('wallet');
                    }}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
                  >
                    Isi Saldo Sekarang
                  </button>
                  <button 
                    onClick={() => setShowInsufficientBalance(false)}
                    className="w-full text-slate-400 font-bold py-2 text-sm"
                  >
                    Nanti Saja
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-30">
        <button 
          onClick={handleScanClick}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <Scan className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold capitalize">{activeTab === 'home' ? 'Eclipse' : activeTab}</h1>
        <div className="relative">
          <Bell className="w-6 h-6 text-slate-700" />
        </div>
      </header>

      {/* QR Scanner Overlay */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center relative z-10">
              <button 
                onClick={() => setShowScanner(false)}
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-white font-bold">Scan QR</h2>
              <div className="w-10 h-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {/* Real Camera View */}
              <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                {!hasCameraPermission && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/40 text-sm">Menghubungkan kamera...</p>
                  </div>
                )}
              </div>

              {/* Scanner Frame */}
              <div className="relative w-64 h-64">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
                
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                ></motion.div>
              </div>

              <div className="absolute bottom-20 left-0 right-0 text-center px-10">
                <p className="text-white/60 text-sm">Arahkan kamera ke kode QR untuk melakukan pembayaran atau transfer</p>
              </div>
            </div>

            <div className="p-10 bg-slate-900 flex justify-center space-x-10">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <button 
                onClick={handleGalleryClick}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10 active:bg-white/10 transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-white/60 font-medium">Galeri</span>
              </button>
              <button 
                onClick={toggleFlashlight}
                className="flex flex-col items-center space-y-2"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${flashlightOn ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 border-white/10 text-white active:bg-white/10'}`}>
                  <Zap className={`w-6 h-6 ${flashlightOn ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-[10px] font-medium ${flashlightOn ? 'text-blue-400' : 'text-white/60'}`}>Senter</span>
              </button>
            </div>
          </motion.div>
        )}

        {showAIChat && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-slate-50 z-50 flex flex-col"
          >
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowAIChat(false)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <div>
                  <h1 className="text-lg font-bold">Eclipse AI Assistant</h1>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {aiChatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="space-y-2 max-w-[250px]">
                    <h3 className="font-bold text-lg">Halo! Saya Eclipse AI</h3>
                    <p className="text-sm text-slate-400">Tanyakan apa saja tentang fitur Eclipse, bantuan transaksi, atau promo terbaru.</p>
                  </div>
                </div>
              )}
              
              {aiChatMessages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex space-x-1 items-center">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 flex items-center">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (sendMessageToAI(aiInput), setAiInput(''))}
                    placeholder="Ketik pesan Anda..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                  />
                </div>
                <button 
                  onClick={() => {
                    sendMessageToAI(aiInput);
                    setAiInput('');
                  }}
                  disabled={!aiInput.trim() || isTyping}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                    aiInput.trim() && !isTyping ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center space-y-1 relative"
        >
          <Home className={`w-6 h-6 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>Beranda</span>
          {activeTab === 'home' && (
            <motion.div layoutId="nav-indicator" className="w-12 h-1 bg-blue-600 rounded-full absolute -top-3" />
          )}
        </button>
        
        <button 
          onClick={() => setActiveTab('wallet')}
          className="flex flex-col items-center space-y-1 relative"
        >
          <Wallet className={`w-6 h-6 transition-colors ${activeTab === 'wallet' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors ${activeTab === 'wallet' ? 'text-blue-600' : 'text-slate-400'}`}>Dompet</span>
          {activeTab === 'wallet' && (
            <motion.div layoutId="nav-indicator" className="w-12 h-1 bg-blue-600 rounded-full absolute -top-3" />
          )}
        </button>

        <button 
          onClick={() => setActiveTab('cs')}
          className="flex flex-col items-center space-y-1 relative"
        >
          <MessageCircle className={`w-6 h-6 transition-colors ${activeTab === 'cs' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors ${activeTab === 'cs' ? 'text-blue-600' : 'text-slate-400'}`}>CS</span>
          {activeTab === 'cs' && (
            <motion.div layoutId="nav-indicator" className="w-12 h-1 bg-blue-600 rounded-full absolute -top-3" />
          )}
        </button>

        <button 
          onClick={() => setActiveTab('id')}
          className="flex flex-col items-center space-y-1 relative"
        >
          <User className={`w-6 h-6 transition-colors ${activeTab === 'id' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors ${activeTab === 'id' ? 'text-blue-600' : 'text-slate-400'}`}>Eclipse ID</span>
          {activeTab === 'id' && (
            <motion.div layoutId="nav-indicator" className="w-12 h-1 bg-blue-600 rounded-full absolute -top-3" />
          )}
        </button>
      </nav>
    </div>
  );
}
