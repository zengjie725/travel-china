export interface Hotel {
  id: string;
  name: string;
  city: string;
  cityId: string;
  address: string;
  price: string;
  rating: number;
  image: string;
}

export const hotels: Hotel[] = [
  {
    id: 'bj-hotel-1',
    name: '北京故宫大酒店',
    city: '北京',
    cityId: 'beijing',
    address: '北京市东城区故宫附近',
    price: '¥888',
    rating: 4.8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20luxury%20hotel%20modern%20architecture%20night%20lights&image_size=landscape_16_9',
  },
  {
    id: 'bj-hotel-2',
    name: '北京长城酒店',
    city: '北京',
    cityId: 'beijing',
    address: '北京市延庆区八达岭长城附近',
    price: '¥668',
    rating: 4.6,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20Great%20Wall%20hotel%20mountain%20view%20comfortable&image_size=landscape_16_9',
  },
  {
    id: 'sh-hotel-1',
    name: '上海外滩华尔道夫酒店',
    city: '上海',
    cityId: 'shanghai',
    address: '上海市黄浦区外滩',
    price: '¥1288',
    rating: 4.9,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20Bund%20luxury%20hotel%20historic%20building%20elegant&image_size=landscape_16_9',
  },
  {
    id: 'sh-hotel-2',
    name: '上海迪士尼乐园酒店',
    city: '上海',
    cityId: 'shanghai',
    address: '上海市浦东新区迪士尼度假区',
    price: '¥1588',
    rating: 4.8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20Disneyland%20hotel%20fantasy%20castle%20theme&image_size=landscape_16_9',
  },
  {
    id: 'cd-hotel-1',
    name: '成都熊猫基地酒店',
    city: '成都',
    cityId: 'chengdu',
    address: '成都市成华区熊猫基地附近',
    price: '¥588',
    rating: 4.7,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20panda%20hotel%20bamboo%20garden%20comfortable&image_size=landscape_16_9',
  },
  {
    id: 'cd-hotel-2',
    name: '九寨沟洲际酒店',
    city: '九寨沟',
    cityId: 'jiuzhaigou',
    address: '四川省阿坝州九寨沟景区附近',
    price: '¥1288',
    rating: 4.8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Jiuzhaigou%20mountain%20hotel%20lake%20view%20luxury&image_size=landscape_16_9',
  },
  {
    id: 'xs-hotel-1',
    name: '丽江古城客栈',
    city: '丽江',
    cityId: 'lijiang',
    address: '云南省丽江市古城区',
    price: '¥388',
    rating: 4.6,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lijiang%20ancient%20town%20inn%20traditional%20architecture%20courtyard&image_size=landscape_16_9',
  },
  {
    id: 'xs-hotel-2',
    name: '大理洱海酒店',
    city: '大理',
    cityId: 'dali',
    address: '云南省大理市洱海畔',
    price: '¥688',
    rating: 4.7,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dali%20Erhai%20Lake%20hotel%20waterfront%20beautiful%20view&image_size=landscape_16_9',
  },
  {
    id: 'sx-hotel-1',
    name: '西安兵马俑酒店',
    city: '西安',
    cityId: 'xian',
    address: '陕西省西安市临潼区兵马俑附近',
    price: '¥488',
    rating: 4.5,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xi%27an%20hotel%20near%20Terracotta%20Army%20modern%20comfortable&image_size=landscape_16_9',
  },
  {
    id: 'gx-hotel-1',
    name: '桂林漓江酒店',
    city: '桂林',
    cityId: 'guilin',
    address: '广西桂林市漓江畔',
    price: '¥788',
    rating: 4.7,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Guilin%20Li%20River%20hotel%20karst%20mountains%20view%20luxury&image_size=landscape_16_9',
  },
  {
    id: 'hn-hotel-1',
    name: '三亚亚龙湾度假酒店',
    city: '三亚',
    cityId: 'sanya',
    address: '海南省三亚市亚龙湾',
    price: '¥1688',
    rating: 4.9,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya%20Yalong%20Bay%20resort%20hotel%20tropical%20beach%20luxury&image_size=landscape_16_9',
  },
];

export const getHotelsByCityId = (cityId: string): Hotel[] => {
  return hotels.filter((hotel) => hotel.cityId === cityId);
};
