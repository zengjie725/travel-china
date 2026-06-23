import provincesData from './provinces.json';
import citiesData from './cities.json';

export interface Province {
  id: string;
  name: string;
  shortName: string;
  capital: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
  spots: any[];
}

export interface CityMap {
  [provinceId: string]: City[];
}

export const provinces: Province[] = provincesData.provinces;

export const cities: CityMap = citiesData.cities;

export const getCitiesByProvinceId = (provinceId: string): City[] => {
  return cities[provinceId] || [];
};

export const getProvinceById = (provinceId: string): Province | undefined => {
  return provinces.find((p) => p.id === provinceId);
};
