import sql from './db';
import redis from './redis';
import config from './config';
import { SkinportService } from './services/SkinportService';
import { PurchaseService } from './services/PurchaseService';

export const skinportService = new SkinportService(config, redis);
export const purchaseService = new PurchaseService(sql);
