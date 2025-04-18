export interface ProductDB {
    id: number;
    code: string;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    quantity: number;
    internalReference: string;
    shellId: number;
    inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
    rating: number;
    createdAt: number;
    updatedAt: number;
  }

  export function createEmptyProduct(): ProductDB {
    return {
      id: 0,
      code: generateProductCode(),
      name: '',
      description: '',
      image: '',
      category: '',
      price: 0,
      quantity: 0,
      internalReference: '',
      shellId: 0,
      inventoryStatus: 'INSTOCK',
      rating: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000)
    };
  }
  
  function generateProductCode(): string {
    return 'PROD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }