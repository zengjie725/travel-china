export interface Food {
  id: string;
  name: string;
  city: string;
  cityId: string;
  description: string;
  image: string;
  price: string;
  tags: string[];
}

export const foods: Food[] = [
  {
    id: 'bj-dumpling',
    name: '北京烤鸭',
    city: '北京',
    cityId: 'beijing',
    description: '北京烤鸭是具有世界声誉的北京著名菜式，由中国汉族研制而成，在国内外享有盛誉。其制作工艺复杂，以果木炭火烤制，色泽红润，肉质肥而不腻，外脆里嫩。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Peking%20duck%20crispy%20skin%20Chinese%20food%20delicious&image_size=landscape_16_9',
    price: '¥198',
    tags: ['京菜', '招牌菜', '必吃'],
  },
  {
    id: 'bj-hotpot',
    name: '老北京铜锅涮肉',
    city: '北京',
    cityId: 'beijing',
    description: '老北京涮羊肉是北京传统的火锅美食，使用铜制炭火火锅，清汤锅底，搭配新鲜羊肉片，蘸料丰富，味道鲜美。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20hotpot%20copper%20pot%20mutton%20Chinese%20traditional&image_size=landscape_16_9',
    price: '¥128',
    tags: ['京菜', '火锅', '冬季'],
  },
  {
    id: 'sh-xiaolongbao',
    name: '小笼包',
    city: '上海',
    cityId: 'shanghai',
    description: '上海小笼包是上海特色点心，皮薄馅大，汤汁鲜美，是江南地区著名的传统小吃。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20xiaolongbao%20soup%20dumplings%20Chinese%20food&image_size=landscape_16_9',
    price: '¥38',
    tags: ['沪菜', '点心', '必吃'],
  },
  {
    id: 'sh-crab',
    name: '大闸蟹',
    city: '上海',
    cityId: 'shanghai',
    description: '阳澄湖大闸蟹是上海及周边地区的特色美食，以其膏满黄肥、味道鲜美而闻名。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20hairy%20crab%20fresh%20seafood%20delicious&image_size=landscape_16_9',
    price: '¥298',
    tags: ['沪菜', '海鲜', '时令'],
  },
  {
    id: 'cd-hotpot',
    name: '四川火锅',
    city: '成都',
    cityId: 'chengdu',
    description: '四川火锅以麻辣鲜香著称，锅底采用牛油炒制，搭配各种香料，味道浓郁，是川菜的代表。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sichuan%20hotpot%20spicy%20red%20oil%20Chinese%20food&image_size=landscape_16_9',
    price: '¥158',
    tags: ['川菜', '火锅', '必吃'],
  },
  {
    id: 'cd-mapo',
    name: '麻婆豆腐',
    city: '成都',
    cityId: 'chengdu',
    description: '麻婆豆腐是川菜经典名菜，以豆腐为主料，配以牛肉末，麻辣鲜香，口感嫩滑。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mapo%20tofu%20spicy%20Sichuan%20Chinese%20food&image_size=landscape_16_9',
    price: '¥38',
    tags: ['川菜', '经典', '下饭'],
  },
  {
    id: 'xs-yunnan',
    name: '过桥米线',
    city: '昆明',
    cityId: 'kunming',
    description: '过桥米线是云南特色美食，以米线、高汤和各种配料组成，味道鲜美，营养丰富。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yunnan%20cross%20bridge%20rice%20noodles%20Chinese%20food&image_size=landscape_16_9',
    price: '¥48',
    tags: ['滇菜', '特色', '必吃'],
  },
  {
    id: 'xs-lijiang-yunnan',
    name: '腊排骨火锅',
    city: '丽江',
    cityId: 'lijiang',
    description: '腊排骨火锅是丽江特色美食，采用腌制的腊排骨，配以各种蔬菜，味道鲜香浓郁。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lijiang%20cured%20pork%20ribs%20hotpot%20Yunnan%20food&image_size=landscape_16_9',
    price: '¥128',
    tags: ['滇菜', '火锅', '特色'],
  },
  {
    id: 'sx-xian',
    name: '肉夹馍',
    city: '西安',
    cityId: 'xian',
    description: '肉夹馍是陕西传统美食，将炖好的肉夹入馍中，味道鲜美，是西安最具代表性的小吃之一。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20roujiamo%20meat%20burger%20Xi%27an%20food&image_size=landscape_16_9',
    price: '¥15',
    tags: ['陕菜', '小吃', '必吃'],
  },
  {
    id: 'sx-noodles',
    name: '陕西凉皮',
    city: '西安',
    cityId: 'xian',
    description: '陕西凉皮是陕西传统小吃，以面粉制成的凉皮配以黄瓜丝、豆芽等，调味酸辣爽口。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shaanxi%20cold%20noodles%20liangpi%20Chinese%20food&image_size=landscape_16_9',
    price: '¥12',
    tags: ['陕菜', '小吃', '夏季'],
  },
  {
    id: 'gx-guilin',
    name: '桂林米粉',
    city: '桂林',
    cityId: 'guilin',
    description: '桂林米粉是广西桂林特色美食，以米粉为主料，配以卤水和各种配料，味道鲜美。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Guilin%20rice%20noodles%20Chinese%20food%20delicious&image_size=landscape_16_9',
    price: '¥18',
    tags: ['桂菜', '特色', '必吃'],
  },
  {
    id: 'hn-sanya',
    name: '海南文昌鸡',
    city: '三亚',
    cityId: 'sanya',
    description: '文昌鸡是海南四大名菜之首，肉质鲜嫩，皮脆骨软，味道鲜美。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hainan%20Wenchang%20chicken%20Chinese%20food%20delicious&image_size=landscape_16_9',
    price: '¥168',
    tags: ['琼菜', '招牌', '必吃'],
  },
];

export const getFoodsByCityId = (cityId: string): Food[] => {
  return foods.filter((food) => food.cityId === cityId);
};
