export type Category = 'Cozinha' | 'Banheiro' | 'Quarto' | 'Limpeza' | 'Outros';

export interface Item {
  id: string;
  name: string;
  category: Category;
  totalQuantity: number;
  availableQuantity: number;
  imageUrl: string;
}

export const initialItems: Item[] = [
  // Cozinha
  { id: '1', name: 'Jogo de pratos (vidro e prato fundo)', category: 'Cozinha', totalQuantity: 3, availableQuantity: 3, imageUrl: '/assets/pratos.jpeg' },
  { id: '2', name: 'Jogo de copos', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/copos.jpeg' },
  { id: '3', name: 'Jogo de talheres', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/talher.jpeg' },
  { id: '4', name: 'Jogo de panela inox', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/PANELA.jpeg' },
  { id: '5', name: 'Jogo de taça', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/taça.jpeg' },
  { id: '6', name: 'Frigideira', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/frigideira.jpeg' },
  { id: '7', name: 'Travessas', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/travessas.jpeg' },
  { id: '8', name: 'Potes de plástico', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/potesp.jpeg' },
  { id: '9', name: 'Potes de vidro', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/potesv.jpeg' },
  { id: '10', name: 'Potes de tempero', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/potest.jpeg' },
  { id: '11', name: 'Tábua inox', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/tabua.jpeg' },
  { id: '12', name: 'Jarra', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/jarra.jpeg' },
  { id: '13', name: 'Escorredor de louça', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/escorredor.jpeg' },
  { id: '15', name: 'Utensílios de cozinha', category: 'Cozinha', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/utensiliocoz.jpeg' },
  { id: '16', name: 'Panela de pressão', category: 'Cozinha', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/pressão.jpeg' },
  
  // Banheiro
  { id: '17', name: 'Jogo de toalhas', category: 'Banheiro', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/toalha.jpeg' },
  { id: '19', name: 'Lixeira inteligente', category: 'Banheiro', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/lixeira.jpeg' },
  
  // Quarto
  { id: '22', name: 'Jogo de cama', category: 'Quarto', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/cama.jpeg' },
  { id: '23', name: 'Travesseiros', category: 'Quarto', totalQuantity: 3, availableQuantity: 3, imageUrl: '/assets/travesseiro.jpeg' },
  { id: '24', name: 'Edredom', category: 'Quarto', totalQuantity: 2, availableQuantity: 2, imageUrl: '/assets/edredom.jpeg' },
  
  // Limpeza
  { id: '25', name: 'Mop', category: 'Limpeza', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/mop.jpeg' },
  { id: '26', name: 'Cesto de roupa', category: 'Limpeza', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/cesto.jpeg' },
  
  // Outros
  { id: '27', name: 'Air fryer smart', category: 'Outros', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/Ayrfryersmart.jpeg' },
  { id: '28', name: 'Ferro de passar', category: 'Outros', totalQuantity: 1, availableQuantity: 1, imageUrl: '/assets/Ferro.jpeg' },
];
