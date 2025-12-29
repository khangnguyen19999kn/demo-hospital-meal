
export type Role = 'PATIENT' | 'DOCTOR' | 'KITCHEN' | 'ADMIN';

export enum DietType {
  STANDARD = 'Cơm thường',
  DIABETIC = 'Tiểu đường',
  LIQUID = 'Ăn lỏng / Cháo',
  LOW_SODIUM = 'Ít muối / Thận'
}

export enum MealType {
  ALL = 'Tất cả',
  BREAKFAST = 'Bữa sáng',
  LUNCH = 'Bữa trưa',
  DINNER = 'Bữa tối',
  SNACK = 'Bữa phụ'
}

export enum OrderStatus {
  PENDING = 'Chờ xác nhận',
  COOKING = 'Đang chế biến',
  DELIVERING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  image: string;
  dietType: DietType;
  mealType: MealType;
  available: boolean;
  inStock: boolean; // Mới: Kiểm soát kho
}

export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  bed: string;
  items: { item: MenuItem; quantity: number }[];
  total: number;
  status: OrderStatus;
  note: string;
  createdAt: string;
  rating?: number; // Mới: Đánh giá
  feedback?: string; // Mới: Bình luận
}

export interface Patient {
  id: string;
  name: string;
  room: string;
  bed: string;
  dietType: DietType;
  wardId: string;
  orderStatus: 'NONE' | 'ORDERED';
  allergies?: string[];
  medicalNote?: string;
  nutritionGoal?: {
    calories: number;
    protein: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'MEDICAL' | 'SYSTEM';
  createdAt: string;
  isRead: boolean;
}

export interface Ward {
  id: string;
  name: string;
}
