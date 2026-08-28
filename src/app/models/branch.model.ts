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
  shortName: string;
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

export interface BranchRegion {
  name: string;
  navigationName: string;
  branches: readonly Branch[];
}

export interface BranchDepartment {
  name: string;
  navigationName: string;
  regions: readonly BranchRegion[];
}

const createMapsUrl = (name: string, address?: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}${address ? `, ${address}` : ''}`)}`;

const createShortName = (name: string): string => name.replace(/^Mercagán\s+/, '');

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
    shortName: createShortName(branch.name),
    phones,
    primaryPhone: phones.find((phone) => phone.isMobile) ?? phones[0],
    whatsApp,
    whatsAppUrl: whatsApp ? `https://wa.me/57${whatsApp.value}?text=${encodeURIComponent(`Hola, quisiera información sobre ${branch.name}.`)}` : undefined,
    mapsUrl: createMapsUrl(branch.name, branch.address),
  };
});
