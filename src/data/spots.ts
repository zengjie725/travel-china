import mockData from './mock_data.json';
import scenicSpots5A from './scenic_spots_5a.json';

export interface PhotoSpot {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Spot {
  spotId: string;
  id?: string;
  name: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  description: string;
  images: string[];
  tags: string[];
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  level?: string;
  address?: string;
  bestPhotoSpots?: PhotoSpot[];
  guide?: string;
  tips?: string[];
  ticketPrice?: string;
  openingHours?: string;
  bestSeason?: string;
  phone?: string;
  website?: string;
  suggestedDuration?: string;
}

export interface RawSpot {
  spotId: string;
  name: string;
  description: string;
  images: string[];
  tags: string[];
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  ticketPrice?: string;
  openingHours?: string;
  bestSeason?: string;
}

export interface RawCity {
  id: string;
  name: string;
  spots: RawSpot[];
}

export interface RawProvince {
  id: string;
  name: string;
  cities: RawCity[];
}

interface MockData {
  provinces: RawProvince[];
}

interface ScenicSpot5A {
  id: string;
  name: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  level: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  tags: string[];
  rating: number;
}

interface ScenicSpots5AResponse {
  version: string;
  updateTime: string;
  count: number;
  spots: ScenicSpot5A[];
}

const transformMockData = (): Spot[] => {
  const allSpots: Spot[] = [];
  (mockData as MockData).provinces.forEach((province) => {
    province.cities.forEach((city) => {
      city.spots.forEach((spot) => {
        allSpots.push({
          ...spot,
          province: province.name,
          provinceId: province.id,
          city: city.name,
          cityId: city.id,
        });
      });
    });
  });
  return allSpots;
};

const transform5ASpots = (): Spot[] => {
  const spots5A = scenicSpots5A as ScenicSpots5AResponse;
  return spots5A.spots.map((spot) => ({
    spotId: spot.id,
    id: spot.id,
    name: spot.name,
    province: spot.province,
    provinceId: spot.provinceId,
    city: spot.city,
    cityId: spot.cityId,
    description: '',
    images: [],
    tags: spot.tags,
    rating: spot.rating,
    location: spot.location,
    level: spot.level,
    address: spot.address,
  }));
};

const mockSpots = transformMockData();
const spots5A = transform5ASpots();

const existingSpotIds = new Set(mockSpots.map((s) => s.spotId));

const combinedSpots = [...mockSpots];

spots5A.forEach((spot5A) => {
  if (!existingSpotIds.has(spot5A.spotId)) {
    combinedSpots.push(spot5A);
  } else {
    const existingSpot = combinedSpots.find((s) => s.spotId === spot5A.spotId);
    if (existingSpot) {
      existingSpot.level = spot5A.level;
      existingSpot.address = spot5A.address;
    }
  }
});

export const spots: Spot[] = combinedSpots;

export const getSpotsByCityId = (cityId: string): Spot[] => {
  return spots.filter((spot) => spot.cityId === cityId);
};

export const getSpotById = (spotId: string): Spot | undefined => {
  return spots.find((spot) => spot.spotId === spotId);
};

export const searchSpots = (keyword: string): Spot[] => {
  const lowerKeyword = keyword.toLowerCase();
  return spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(lowerKeyword) ||
      spot.city.toLowerCase().includes(lowerKeyword) ||
      spot.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
};

export const get5ASpots = (): Spot[] => {
  return spots.filter((spot) => spot.level === '5A');
};

export { mockData };
