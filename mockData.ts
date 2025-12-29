
import { MenuItem, DietType, MealType, Patient, Ward, Order, OrderStatus, Notification } from './types';

export const WARDS: Ward[] = [
  { id: 'W1', name: 'Khoa Nội Tổng Hợp' },
  { id: 'W2', name: 'Khoa Ngoại Chấn Thương' },
  { id: 'W3', name: 'Khoa Tim Mạch' }
];

export const PATIENTS: Patient[] = [
  { 
    id: 'P1', 
    name: 'Nguyễn Văn A', 
    room: '301', 
    bed: 'B1', 
    dietType: DietType.STANDARD, 
    wardId: 'W1', 
    orderStatus: 'ORDERED',
  },
  { 
    id: 'P2', 
    name: 'Trần Thị B', 
    room: '301', 
    bed: 'B2', 
    dietType: DietType.DIABETIC, 
    wardId: 'W1', 
    orderStatus: 'ORDERED',
    medicalNote: 'Tránh đường tuyệt đối',
  },
  { id: 'P3', name: 'Lê Văn C', room: '305', bed: 'B1', dietType: DietType.LIQUID, wardId: 'W1', orderStatus: 'NONE' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Cơm Gà Luộc Rau Củ',
    description: 'Thịt gà ta luộc, cơm gạo tẻ thơm, rau củ luộc thập cẩm.',
    calories: 450,
    protein: 25,
    carbs: 60,
    fat: 10,
    price: 45000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400',
    dietType: DietType.STANDARD,
    mealType: MealType.LUNCH,
    available: true,
    inStock: true
  },
  {
    id: 'm2',
    name: 'Cơm Cá Thu Kho Tộ',
    description: 'Cá thu tươi kho tộ, cơm trắng, canh bí xanh.',
    calories: 420,
    protein: 22,
    carbs: 55,
    fat: 12,
    price: 55000,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400',
    dietType: DietType.STANDARD,
    mealType: MealType.DINNER,
    available: true,
    inStock: true
  },
  {
    id: 'm3',
    name: 'Cháo Thịt Bằm Nấm Hương',
    description: 'Cháo loãng nấu kỹ, thịt nạc băm, nấm hương bổ dưỡng.',
    calories: 250,
    protein: 15,
    carbs: 40,
    fat: 5,
    price: 35000,
    image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=400',
    dietType: DietType.LIQUID,
    mealType: MealType.BREAKFAST,
    available: true,
    inStock: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-771',
    patientId: 'P2',
    patientName: 'Trần Thị B',
    room: '301',
    bed: 'B2',
    items: [{ item: MENU_ITEMS[0], quantity: 1 }],
    total: 45000,
    status: OrderStatus.PENDING,
    note: 'Ít cơm',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
  },
  {
    id: 'ORD-552',
    patientId: 'P2',
    patientName: 'Trần Thị B',
    room: '301',
    bed: 'B2',
    items: [{ item: MENU_ITEMS[1], quantity: 1 }],
    total: 55000,
    status: OrderStatus.COOKING,
    note: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
  },
  {
    id: 'ORD-223',
    patientId: 'P2',
    patientName: 'Trần Thị B',
    room: '301',
    bed: 'B2',
    items: [{ item: MENU_ITEMS[2], quantity: 2 }],
    total: 70000,
    status: OrderStatus.DELIVERING,
    note: 'Ăn nóng',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
  },
  {
    id: 'ORD-001',
    patientId: 'P2',
    patientName: 'Trần Thị B',
    room: '301',
    bed: 'B2',
    items: [{ item: MENU_ITEMS[0], quantity: 1 }],
    total: 45000,
    status: OrderStatus.COMPLETED,
    note: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    rating: 5
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Chào mừng bạn',
    message: 'Hệ thống đặt suất ăn MedMeal đã sẵn sàng phục vụ bạn.',
    type: 'SYSTEM',
    createdAt: new Date().toISOString(),
    isRead: false
  }
];
