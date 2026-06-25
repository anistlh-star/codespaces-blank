export const KEYS = {
  product: (id) => `product:${id}`,

  productList: (hash) => `products:list:${hash}`,

  featured: "products:featured",

  trending: "products:trending",
  popularProducts: "products:popular",
  stats: "products:stats",
  newArrivals: "products:newArrivals",
  brands: `products:brand`,
  userProducts: (userId, hash) => `products:user:${userId}:${hash}`,
  singleCategory : (id) => `category:${id}`,
  categoryList: "categories:list",
  userList: "users:list",
  singleUser : (id)=>`user:${id}`,
  cart: (userId) => `cart:${userId}`,
  order: (userId) => `order:${userId}`,
  orderList: (userId) => `orders:list:${userId}`,
  wishlist: (userId) => `wishlist:${userId}`,
  

};
