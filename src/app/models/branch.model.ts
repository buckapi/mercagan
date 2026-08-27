import branchesData from '../data/branches.json';

export type BranchGroup = 'Bucaramanga y área metropolitana' | 'Santander' | 'Bogotá';

interface BranchData {
  id: string;
  name: string;
  group: BranchGroup;
  department: string;
  region: string;
  city?: string;
  address?: string;
  image: string;
  latitude?: number;
  longitude?: number;
  phones: readonly string[];
  whatsApp?: string;
}

export interface BranchPhone {
  value: string;
  display: string;
  telHref: string;
  isMobile: boolean;
}

export interface Branch {
  id: string;
  name: string;
  group: BranchGroup;
  department: string;
  region: string;
  city?: string;
  address?: string;
  mapsUrl: string;
  image: string;
  latitude?: number;
  longitude?: number;
  phones: readonly BranchPhone[];
  primaryPhone: BranchPhone;
  whatsApp?: BranchPhone;
  whatsAppUrl?: string;
}

const createMapsUrl = (name: string, address?: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mercagan ${name}${address ? `, ${address}` : ''}`)}`;

const formatPhone = (value: string): string => `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;

const createPhone = (value: string): BranchPhone => ({
  value,
  display: formatPhone(value),
  telHref: `tel:+57${value}`,
  isMobile: value.startsWith('3'),
});

export const BRANCHES: readonly Branch[] = (branchesData as readonly BranchData[]).map((branch) => {
  const phones = branch.phones.map(createPhone);
  const whatsApp = phones.find((phone) => phone.value === branch.whatsApp) ?? phones.find((phone) => phone.isMobile);

  return {
    ...branch,
    phones,
    primaryPhone: phones.find((phone) => phone.isMobile) ?? phones[0],
    whatsApp,
    whatsAppUrl: whatsApp ? `https://wa.me/57${whatsApp.value}?text=${encodeURIComponent(`Hola, quisiera información sobre Mercagán ${branch.name}.`)}` : undefined,
    mapsUrl: createMapsUrl(branch.name, branch.address),
  };
});
