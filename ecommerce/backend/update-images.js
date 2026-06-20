//ecommerce/backend/update-images.js
import mongoose from "mongoose";
import Product from "./models/Product.js";
import dotenv from "dotenv";
dotenv.config();

const updates = [
  {
    name: "iPhone 16 Pro",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwnjRu2piR1q7hR_dy4OVQsuY2aPXU8rOhpg&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInzI69QTfhKGZZJSTKjbTAdI4ZeJ5fhSBBw&s",
    ],
  },
  {
    name: "Samsung Galaxy S25",
    images: [
      "https://images.samsung.com/us/smartphones/galaxy-s25/images/galaxy-s25-highlights-color-icy-blue-front-pc.jpg",
      "https://images.samsung.com/us/smartphones/galaxy-s25/galaxy-s25-icy-blue-front.jpg",
    ],
  },
  {
    name: "Google Pixel 9",
    images: [
      "https://lh3.googleusercontent.com/oZ3yV5JGkDE3mCRwWrEqVRyxJcJ5NxfPdHNxPmRx7zQ=w500",
      "https://lh3.googleusercontent.com/YJLqxFZLCHgXqhQDhG2h5JQqVpQZ0rL0Zr3x9Z7zQ=w500",
    ],
  },
  {
    name: "OnePlus 13R",
    images: [
      "https://image01.oneplus.net/ebp/20250113/1736749200343.png",
      "https://oasis.opstatics.com/content/dam/oasis/page/2025/global/oneplus-13r/specs/black.png",
    ],
  },
  {
    name: "Xiaomi 14 Ultra",
    images: [
      "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1708502400.872611.jpg",
      "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14-ultra/pc/gallery1.png",
    ],
  },
  {
    name: "Sony Xperia 1 VI",
    images: [
      "https://www.sony.com/image/5c3d1c8a5e0e5e0e5e0e5e0e5e0e5e0e",
      "https://www.sony.net/Products/di/en-us/products/n6v7/img/product_xperia1vi_platinum_front.png",
    ],
  },
  {
    name: "Oppo Find X7 Pro",
    images: [
      "https://image.oppo.com/content/dam/oppo/product-asset-library/find/find-x7-pro/v1/assets/kv-black.png",
      "https://image.oppo.com/content/dam/oppo/product-asset-library/find/find-x7-pro/v1/assets/gallery-black-front.png",
    ],
  },
  {
    name: "Vivo X100 Pro",
    images: [
      "https://image.vivo.com.cn/shop/product/202311/kv_main_x100pro_black.png",
      "https://image.vivo.com.cn/shop/product/202311/gallery_x100pro_black_front.png",
    ],
  },
  {
    name: "Asus ROG Phone 8",
    images: [
      "https://dlcdnwebimgs.asus.com/gain/9C8E8B8F-7F7D-4E0E-9E6D-7F8F8F8F8F8F",
      "https://dlcdnwebimgs.asus.com/gain/rogphone8/kv-phantom-black.png",
    ],
  },
  {
    name: "Nokia X50",
    images: [
      "https://i.nokia.com/sites/default/files/2024-01/nokia-x50-blue-front.png",
    ],
  },
  {
    name: "Anker Nano Charger",
    images: ["https://m.media-amazon.com/images/I/61fYRy8FKVL.jpg"],
  },
  {
    name: "Samsung Wireless Power Bank",
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/ww/eb-u2510xuegww/gallery/ww-wireless-power-bank-eb-u2510xuegww-thumb-539911840.jpg",
    ],
  },
  {
    name: "Apple MagSafe Wallet",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MJYL3_FV_34FR_awp?wid=1000&hei=1000&fmt=png-alpha&.v=1693702283341",
    ],
  },
  {
    name: "PlayStation 5",
    images: [
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
    ],
  },
  {
    name: "Nintendo Switch OLED",
    images: [
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_500/ncom/en_US/switch/site-design-update/hardware/switch-oled/nintendo-switch-oled-model-white-set",
    ],
  },
  {
    name: "GTA VI",
    images: [
      "https://media-rockstargames-com.akamaized.net/mfe6/prod/__common/img/71d4d17edcd49703a5ea446cc0e588e6.jpg",
    ],
  },
  {
    name: "Apple Watch Ultra 2",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MW9F3_FV_34FR_awp?wid=1000&hei=1000&fmt=png-alpha&.v=1694005924265",
    ],
  },
  {
    name: "Sony WH-1000XM6",
    images: [
      "https://www.sony.com/image/f6f6ef63-7ea6-4262-972c-86da2d3c5ef0?fmt=png-alpha",
    ],
  },
  {
    name: "Realme GT 6 Pro",
    images: [
      "https://image01.realme.net/general/20240612/1718171234567d3e0e3b8c4f4425aa8c3e0f3f3f3f3f.png",
    ],
  },
  {
    name: "Infinix Zero 30",
    images: [
      "https://www.infinixmobility.com/media/catalog/product/z/e/zero_30_5g_fantasy_purple.png",
    ],
  },
  {
    name: "Tecno Phantom V Fold",
    images: [
      "https://www.tecno-mobile.com/media/catalog/product/p/h/phantom_v_fold_black_front.png",
    ],
  },
  {
    name: "Honor Magic 6 Pro",
    images: [
      "https://www.hihonor.com/content/dam/honor/global/products/smartphone/magic6-pro/img/honor-magic6-pro-black-front.png",
    ],
  },
  {
    name: "Motorola Edge 50 Pro",
    images: [
      "https://motorolarc.vtexassets.com/arquivos/ids/157860/motorola-edge-50-pro-luxe-lavender-1.png",
    ],
  },
  {
    name: "Nothing Phone (2a)",
    images: ["https://nothing.tech/cdn/shop/files/Phone2a-Black-Front.png"],
  },
  {
    name: "Baseus 65W GaN Charger",
    images: ["https://m.media-amazon.com/images/I/61HmQqAenZL.jpg"],
  },
  {
    name: "Ugreen USB-C Hub",
    images: ["https://m.media-amazon.com/images/I/71eGCIL3moL.jpg"],
  },
  {
    name: "Sandisk Extreme 1TB SSD",
    images: ["https://m.media-amazon.com/images/I/71L3dUKKKbL.jpg"],
  },
  {
    name: "Logitech MX Master 3S",
    images: [
      "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png",
    ],
  },
  {
    name: "Razer Huntsman Mini",
    images: [
      "https://assets.razerzone.com/eeimages/support/products/1710/1710_huntsman_mini.png",
    ],
  },
  {
    name: "JBL Flip 6",
    images: [
      "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwf33d68e6/JBL_FLIP6_HERO_BLACK_0063_x2.png",
    ],
  },
  {
    name: "Xbox Series S",
    images: [
      "https://compass-ssl.xbox.com/assets/bc/40/bc40fca3-df8a-4dc6-a2f4-07b2e9f793a0.jpg",
    ],
  },
  {
    name: "Steam Deck OLED",
    images: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1675200/header.jpg",
    ],
  },
  {
    name: "PlayStation VR2",
    images: [
      "https://gmedia.playstation.com/is/image/SIEPDC/psvr2-product-thumbnail-01-en",
    ],
  },
  {
    name: "Nintendo Switch Lite",
    images: [
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_500/ncom/en_US/switch/site-design-update/hardware/switch-lite/gallery/yellow/nintendo-switch-lite-yellow-front",
    ],
  },
  {
    name: "Elden Ring",
    images: [
      "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png",
    ],
  },
  {
    name: "Call of Duty: Modern Warfare III",
    images: [
      "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/common/mw3-cover-art.jpg",
    ],
  },
  {
    name: "Forza Horizon 5",
    images: [
      "https://compass-ssl.xbox.com/assets/d4/6e/d46e79d9-35e1-42fb-8cf9-5b4c92a9e4da.jpg",
    ],
  },
  {
    name: "God of War Ragnarök",
    images: [
      "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
    ],
  },
  {
    name: "Samsung Galaxy A55",
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/in/sm-a556ezbdins/gallery/in-galaxy-a55-5g-sm-a556-sm-a556ezbdins-thumb-540342249",
    ],
  },
  {
    name: "Redmi Note 13 Pro+",
    images: [
      "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1705920000.12345678.png",
    ],
  },
  {
    name: "iPhone 15",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923780378",
    ],
  },
  {
    name: "Pixel 8a",
    images: [
      "https://lh3.googleusercontent.com/h1vHqS5G3gDNXu-Y7n1QQqBk8Ny5zS_cJF1k2J3nH5w=w500",
    ],
  },
  {
    name: "Sony Xperia 5 V",
    images: [
      "https://www.sony.net/Products/di/en-us/products/kvb9/img/product_xperia5v_blue_front.png",
    ],
  },
  {
    name: "Oppo Reno 11 Pro",
    images: [
      "https://image.oppo.com/content/dam/oppo/product-asset-library/reno/reno11-pro/v1/assets/kv-purple.png",
    ],
  },
  {
    name: "Vivo V30 Pro",
    images: [
      "https://image.vivo.com.cn/shop/product/202402/kv_main_v30pro_black.png",
    ],
  },
  {
    name: "Asus Zenfone 11",
    images: ["https://dlcdnwebimgs.asus.com/gain/zenfone11ultra/kv-black.png"],
  },
  {
    name: "Huawei P60 Pro",
    images: [
      "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/p60-pro/img/pc/huawei-p60-pro-black-front.png",
    ],
  },
  {
    name: "Nothing Phone (1)",
    images: ["https://nothing.tech/cdn/shop/files/Phone1-Black-Front.png"],
  },
  {
    name: "Apple USB-C Cable",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU2G3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1661957424195",
    ],
  },
  {
    name: "Samsung Buds Case Cover",
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/levant/galaxy-buds-fe/accessories/levant-galaxy-buds-fe-case-front-black.jpg",
    ],
  },
  {
    name: "Anker PowerLine Cable",
    images: ["https://m.media-amazon.com/images/I/71l5Hb8nIQL.jpg"],
  },
  {
    name: "Spigen Screen Protector",
    images: ["https://m.media-amazon.com/images/I/71jWvH0OFQL.jpg"],
  },
  {
    name: "Logitech C920 Webcam",
    images: [
      "https://resource.logitech.com/content/dam/logitech/en/products/webcams/c920/gallery/c920-gallery-1-new.png",
    ],
  },
  {
    name: "PlayStation 4 Slim",
    images: [
      "https://gmedia.playstation.com/is/image/SIEPDC/ps4-slim-product-thumbnail-01-en",
    ],
  },
  {
    name: "Xbox One S",
    images: [
      "https://compass-ssl.xbox.com/assets/a0/12/a01233e3-d8c9-4a4b-8f3b-f5f3f3f3f3f3.jpg",
    ],
  },
  {
    name: "Atari VCS",
    images: [
      "https://atarivcs.com/wp-content/uploads/2021/06/atari-vcs-onyx-front.png",
    ],
  },
  {
    name: "Cyberpunk 2077",
    images: [
      "https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKZ4tKNFj9C00giTzYtH8PF1.png",
    ],
  },
  {
    name: "Horizon Forbidden West",
    images: [
      "https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WHECQJdN.png",
    ],
  },
  {
    name: "Resident Evil 4 Remake",
    images: [
      "https://image.api.playstation.com/vulcan/ap/rnd/202210/0706/EVWyZD63pahuh95eKloFaJuC.png",
    ],
  },
  {
    name: "Samsung Galaxy Watch 6",
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r930nzkains/gallery/in-galaxy-watch6-r930-sm-r930nzkains-thumb-537107104",
    ],
  },
  {
    name: "Garmin Fenix 7",
    images: [
      "https://static.garmincdn.com/en/products/010-02540-00/g/cf-lg.jpg",
    ],
  },
  {
    name: "AirPods Pro 2",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
    ],
  },
  {
    name: "JBL Tune 760NC",
    images: [
      "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw7a7a73e2/JBL_TUNE760NC_ProductImage_Black_Front.png",
    ],
  },
];

async function updateProductImages() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const item of updates) {
    const result = await Product.updateOne(
      { name: item.name },
      { $set: { images: item.images } },
    );
     
  }

  mongoose.connection.close();
}

updateProductImages().catch(console.error);
