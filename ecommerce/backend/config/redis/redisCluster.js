// //ecommerce/backend/config/redis/redisCluster.js
// import { createCluster } from 'redis';

// export const redisCluster = createCluster({
//     rootNodes: [
//         {
//             url: process.env.REDIS_CLUSTER_URL_1 || 'redis://127.0.0.1:16379'
//         },
//         {
//             url: process.env.REDIS_CLUSTER_URL_2 || 'redis://127.0.0.1:16380'
//         },
//     ]
// });

// redisCluster.on('error', (err) => console.error('Redis Cluster Error', err));

// export async function connectRedisCluster() {
//     if (!redisCluster.isOpen) {
//         try {
//             await redisCluster.connect();
//             console.log('<<<<<<<<<<<   REDIS Connected >>>>>>>>>');
//         } catch (err) {
//             console.error('Failed to connect to Redis Cluster:', err);
//             throw err;
//         }
//     }
//     return redisCluster;
// }
// it will use only  :
// -when millions of users
// -multi-region scaling
// -huge datasets
// -enterprise systems