import axios from 'axios';
import type { Redis } from 'ioredis';
import { Config } from '../config';

type PriceItem = {
  name: string;
  tradable_min: number;
  non_tradable_min: number;
};

export class SkinportService {
  private readonly clientId: string;
  private readonly secretKey: string;
  private readonly redis: Redis;
  private readonly CACHE_KEY = 'skinport:min-prices';
  private readonly CACHE_TTL = 90; // секунд

  constructor(config: Config, redis: Redis) {
    this.clientId = config.skinPort.clientId;
    this.secretKey = config.skinPort.secretKey;
    this.redis = redis;
  }

  private async fetchItems(tradable: number) {
    const params = new URLSearchParams({
      app_id: '730',
      currency: 'EUR',
      tradable: tradable.toString(),
    });

    const credentials = Buffer.from(`${this.clientId}:${this.secretKey}`).toString('base64');

    const response = await axios.get(`https://api.skinport.com/v1/items?${params}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'SkinportTask/1.0',
      },
      timeout: 10000,
    });

    return response.data as Array<{ market_hash_name: string; min_price: number }>;
  }

  async getMinPrices(): Promise<PriceItem[]> {
    const cached = await this.redis.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const [tradableItems, nonTradableItems] = await Promise.all([
      this.fetchItems(1),
      this.fetchItems(0),
    ]);

    const tradableMap = new Map<string, number>();
    const nonTradableMap = new Map<string, number>();

    for (const item of tradableItems) {
      const current = tradableMap.get(item.market_hash_name);
      if (current === undefined || item.min_price < current) {
        tradableMap.set(item.market_hash_name, item.min_price);
      }
    }

    for (const item of nonTradableItems) {
      const current = nonTradableMap.get(item.market_hash_name);
      if (current === undefined || item.min_price < current) {
        nonTradableMap.set(item.market_hash_name, item.min_price);
      }
    }

    const result: PriceItem[] = [];
    for (const [name, tradableMin] of tradableMap) {
      if (nonTradableMap.has(name)) {
        result.push({
          name,
          tradable_min: tradableMin,
          non_tradable_min: nonTradableMap.get(name)!,
        });
      }
    }

    await this.redis.setex(this.CACHE_KEY, this.CACHE_TTL, JSON.stringify(result));
    return result;
  }
}