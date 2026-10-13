import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CheckCircle2, Gift, Heart, Sparkles, Flower2, Stars } from 'lucide-react';
import { collection, onSnapshot, doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { initialItems, type Item, type Category } from './data/items';
import { db } from './lib/firebase';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Form states
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Category[] = ['Cozinha', 'Banheiro', 'Quarto', 'Limpeza', 'Outros'];

  useEffect(() => {
    // Sincroniza em tempo real com o Firestore
    const unsub = onSnapshot(collection(db, 'items'), (snapshot) => {
      if (snapshot.empty) {
        // Se o banco estiver vazio, ele preenche sozinho com a lista local a primeira vez
        seedDatabase();
        return;
      }
      
      const firestoreItems: Item[] = [];
      snapshot.forEach(doc => {
        firestoreItems.push({ id: doc.id, ...doc.data() } as Item);
      });
      
      // Ordena pelo ID para garantir que a ordem dos cards nunca mude na tela
      const orderedItems = firestoreItems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setItems(orderedItems);
    });

    return () => unsub();
  }, []);

  const seedDatabase = async () => {
    try {
      const itemsCollection = collection(db, 'items');
      for (const item of initialItems) {
        await setDoc(doc(itemsCollection, item.id), item);
      }
    } catch (error) {
      console.error('Erro ao semear o banco:', error);
    }
  };

  const handlePresentear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setIsSubmitting(true);

    try {
      const itemRef = doc(db, 'items', selectedItem.id);
      
      await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        if (!itemDoc.exists()) {
          throw new Error("Produto não encontrado no sistema!");
        }
        
        const currentQty = itemDoc.data().availableQuantity;
        if (currentQty <= 0) {
          throw new Error("Infelizmente alguém já selecionou este item há poucos segundos!");
        }
        
        // Deduz a quantidade
        transaction.update(itemRef, { availableQuantity: currentQty - 1 });
        
        // Salva quem deu o presente
        const giftRef = doc(collection(db, 'gifts'));
        transaction.set(giftRef, {
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          gifterName: nameInput,
          gifterEmail: emailInput,
          timestamp: serverTimestamp()
        });
      });
      
      setSelectedItem(null);
      setNameInput('');
      setEmailInput('');
      alert("Sucesso! Os noivos agradecem muito pelo presente! ❤️");
    } catch (err: any) {
      alert("Erro ao presentear: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes de animação
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // Renderização inicial se o Firebase ainda não carregou
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-blue-500 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="font-medium">Carregando lista de presentes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] bg-blue-300/30 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[60%] right-[10%] w-[30%] h-[50%] bg-blue-100/50 rounded-full blur-[130px] mix-blend-multiply" />
        <div className="absolute top-[40%] left-[-5%] w-[35%] h-[45%] bg-blue-300/20 rounded-full blur-[110px] mix-blend-multiply" />
      </div>

      <header className="pt-20 pb-16 px-6 text-center relative z-10">
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-[15%] md:left-[25%] text-blue-300/60 pointer-events-none">
          <Flower2 size={48} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-20 right-[15%] md:right-[25%] text-blue-300/50 pointer-events-none">
          <Sparkles size={40} />
        </motion.div>
        <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.2, 1], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-10 left-[10%] text-blue-300/40 pointer-events-none hidden md:block">
          <Stars size={50} />
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-32 right-[5%] text-blue-200/70 pointer-events-none hidden lg:block">
          <Flower2 size={64} />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, type: "spring", bounce: 0.5 }} className="max-w-3xl mx-auto relative">
          <div className="flex justify-center mb-6 relative">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />
            <Heart className="text-[#172554] w-14 h-14 relative z-10 drop-shadow-md" fill="#172554" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#172554] mb-2 tracking-tight drop-shadow-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
            Chá de Casa Nova
          </h1>
          <h2 className="text-4xl md:text-6xl text-blue-500 mb-8 font-medium drop-shadow-sm" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
            Nicolas e Laryssa
          </h2>
          <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Estamos construindo nosso novo cantinho e preparamos essa lista com muito carinho!
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[2%] text-blue-200/40 pointer-events-none -z-10"><Flower2 size={80} /></motion.div>
        <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[35%] right-[3%] text-blue-300/30 pointer-events-none -z-10"><Sparkles size={100} /></motion.div>
        <motion.div animate={{ y: [0, 25, 0], rotate: [0, 10, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[60%] left-[4%] text-blue-300/40 pointer-events-none -z-10"><Stars size={70} /></motion.div>
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute top-[85%] right-[5%] text-blue-200/50 pointer-events-none -z-10"><Flower2 size={90} /></motion.div>

        {categories.map((category) => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <section key={category} className="mb-20">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-[#172554] mb-8 flex items-center gap-3 border-b-2 border-blue-200 pb-3"
              >
                <Gift className="w-8 h-8 text-blue-500" />
                {category}
              </motion.h2>

              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {categoryItems.map((item) => (
                  <motion.div key={item.id} variants={cardVariants} whileHover={{ y: -10, scale: 1.03 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-white/50 flex flex-col h-full relative overflow-hidden group">
                    {item.availableQuantity === 0 && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px] z-20 flex items-center justify-center">
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-[#172554] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl">
                          <CheckCircle2 className="w-6 h-6 text-green-400" /> Já presenteado
                        </motion.span>
                      </div>
                    )}
                    
                    <div className="w-full h-48 mb-5 rounded-2xl overflow-hidden relative bg-slate-100 flex items-center justify-center">
                      <motion.img 
                        src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Sem+Foto"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="flex-grow flex flex-col items-center text-center">
                      <span className="bg-blue-100/80 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm mb-3">
                        Restam: {item.availableQuantity}/{item.totalQuantity}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    
                    <button 
                      onClick={() => item.availableQuantity > 0 && setSelectedItem(item)}
                      disabled={item.availableQuantity === 0}
                      className="mt-6 w-full py-3.5 rounded-2xl bg-[#172554] text-white font-bold text-lg hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/30 transition-all focus:ring-4 focus:ring-blue-200 disabled:bg-slate-300 disabled:shadow-none relative overflow-hidden group/btn cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">Presentear</span>
                      <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover/btn:w-full pointer-events-none"></div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
      </main>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }} animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -z-10 opacity-50 pointer-events-none" />

              <button onClick={() => setSelectedItem(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10 cursor-pointer">✕</button>
              
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 mx-auto shadow-md border-4 border-white bg-slate-100">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Foto"} />
              </div>

              <h3 className="text-3xl font-black text-[#172554] mb-8 text-center">{selectedItem.name}</h3>

              <form className="space-y-5" onSubmit={handlePresentear}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Seu Nome Completo</label>
                  <input required value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-lg" placeholder="Como os noivos te chamam?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Seu E-mail (Para recado)</label>
                  <input required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-lg" placeholder="exemplo@email.com" />
                </div>
                
                <div className="pt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#172554] to-blue-800 text-white font-black text-xl hover:shadow-xl hover:shadow-blue-900/40 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Processando...' : <>Confirmar Presente <Heart className="w-6 h-6" fill="currentColor" /></>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
