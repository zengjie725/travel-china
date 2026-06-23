import nationalSkeletonData from './national_skeleton_full.json';

export interface City {
  id: string;
  name: string;
  spots: any[];
}

export interface Province {
  id: string;
  name: string;
  shortName: string;
  capital: string;
  code: string;
  cities: City[];
}

interface SkeletonData {
  provinces: Province[];
}

export const provinces: Province[] = (nationalSkeletonData as SkeletonData).provinces;

export const getCitiesByProvinceId = (provinceId: string): City[] => {
  const province = provinces.find((p) => p.id === provinceId);
  return province?.cities || [];
};

export const getProvinceById = (provinceId: string): Province | undefined => {
  return provinces.find((p) => p.id === provinceId);
};

export const getTotalProvinceCount = (): number => provinces.length;

export const getTotalCityCount = (): number => {
  return provinces.reduce((sum, p) => sum + p.cities.length, 0);
};
