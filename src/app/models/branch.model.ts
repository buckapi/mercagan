import branchesData from '../data/branches.json';

export interface Branch {
  id: string;
  name: string;
  group: 'Bucaramanga y Santander' | 'Bogotá';
  address: string;
  mapsUrl: string;
  image: string;
}

const createMapsUrl = (name: string, address: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mercagan ${name}, ${address}`)}`;

export const BRANCHES: readonly Branch[] = (branchesData as Omit<Branch, 'mapsUrl'>[]).map((branch) => ({
  ...branch,
  mapsUrl: createMapsUrl(branch.name, branch.address),
}));
