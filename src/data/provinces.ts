import nationalSkeletonData from './national_skeleton.json';

export interface City {
  id: string;
  name: string;
  type: string;
}

export interface Province {
  id: string;
  name: string;
  shortName: string;
  capital: string;
  code: string;
  cities: City[];
}

// 转换骨架数据为应用所需格式
const rawData = nationalSkeletonData as {
  provinces: Array<{
    id: string;
    name: string;
    shortName: string;
    capital: string;
    code: string;
    cities: Array<{ id: string; name: string; type: string }>;
  }>;
};

// 转换为Province格式
export const provinces: Province[] = rawData.provinces.map((p) => ({
  id: p.id,
  name: p.name,
  shortName: p.shortName,
  capital: p.capital,
  code: p.code,
  cities: p.cities.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  })),
}));

// 热门城市（首府和著名城市标记为热门）
export const popularCities = provinces
  .flatMap((p) => p.cities.map((c) => ({ ...c, provinceName: p.name, capital: p.capital })))
  .filter((c) => {
    const cityName = c.name.replace('市', '').replace('区', '');
    return c.capital.includes(cityName);
  });
