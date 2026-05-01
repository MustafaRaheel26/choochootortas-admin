import { Order, OrderStatus, OrderType, PaymentStatus, MenuCategory, MenuItem } from '../types';

export const mockMenu: MenuCategory[] = [
  {
    id: 'cat-1',
    name: 'Tortas',
    items: [
      {
        id: 't-1',
        itemName: 'Torta de Jamón',
        price: 8.50,
        description: 'Classic ham torta with avocado, jalapeños, and beans.',
        ingredients: ['Ham', 'Avocado', 'Jalapeño', 'Beans', 'Mayonnaise'],
        removeOptions: ['Ham', 'Avocado', 'Jalapeño', 'Beans', 'Mayonnaise'],
        extras: [{ name: 'Double Ham', price: 2.00 }, { name: 'Cheese', price: 1.00 }],
        categoryId: 'cat-1',
        available: true,
      },
      {
        id: 't-2',
        itemName: 'Torta Cubana',
        price: 12.00,
        description: 'The King of tortas: Milanesa, pierna, jamón, salchicha, egg, and cheese.',
        ingredients: ['Milanesa', 'Pierna', 'Ham', 'Sausage', 'Egg', 'Cheese', 'Avocado'],
        removeOptions: ['Milanesa', 'Pierna', 'Ham', 'Sausage', 'Egg', 'Cheese', 'Avocado'],
        extras: [{ name: 'Extra Chili', price: 0.50 }],
        categoryId: 'cat-1',
        available: true,
        isBestseller: true,
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Beverages',
    items: [
      {
        id: 'b-1',
        itemName: 'Horchata',
        price: 3.50,
        description: 'Refreshing cinnamon rice milk.',
        ingredients: ['Rice', 'Milk', 'Cinnamon'],
        removeOptions: ['Cinnamon'],
        extras: [],
        categoryId: 'cat-2',
        available: true,
      },
      {
        id: 'b-2',
        itemName: 'Jamaica',
        price: 3.50,
        description: 'Hibiscus tea.',
        ingredients: ['Hibiscus'],
        removeOptions: [],
        extras: [],
        categoryId: 'cat-2',
        available: true,
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'Sides',
    items: [
      {
        id: 's-1',
        itemName: 'French Fries',
        price: 4.50,
        description: 'Golden crispy fries.',
        ingredients: ['Potato'],
        removeOptions: [],
        extras: [{ name: 'Cheese Dip', price: 1.50 }],
        categoryId: 'cat-3',
        available: true,
      }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    items: [
      { id: 'oi-1', itemName: 'Torta Cubana', quantity: 1, price: 12.00, removeIngredients: [], extraIngredients: ['Extra Chili'] }
    ],
    orderType: OrderType.EAT_IN,
    status: OrderStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    totalPrice: 12.50,
    tax: 1.00,
    createdAt: '2024-05-19T10:30:00Z'
  },
  {
    id: 'ORD-1002',
    items: [
      { id: 'oi-2', itemName: 'Torta de Jamón', quantity: 2, price: 8.50, removeIngredients: ['Jalapeño'], extraIngredients: ['Cheese'] }
    ],
    orderType: OrderType.TAKE_OUT,
    status: OrderStatus.PREPARING,
    paymentStatus: PaymentStatus.PAID,
    totalPrice: 19.00,
    tax: 1.52,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-1003',
    items: [
      { id: 'oi-3', itemName: 'Horchata', quantity: 1, price: 3.50, removeIngredients: [], extraIngredients: [] }
    ],
    orderType: OrderType.EAT_IN,
    status: OrderStatus.NEW,
    paymentStatus: PaymentStatus.PENDING,
    totalPrice: 3.50,
    tax: 0.28,
    createdAt: new Date().toISOString()
  }
];
