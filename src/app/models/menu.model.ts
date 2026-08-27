export interface MenuCategory {
  id: string;
  branchId: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
}

export interface MenuProduct {
  id: string;
  branchId: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  delay: string;
  active: boolean;
}

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const formatCop = (value: number): string => copFormatter.format(value);
