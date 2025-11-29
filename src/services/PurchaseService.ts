import type { Sql } from 'postgres';
import { Decimal } from 'decimal.js';
import sql from '../db';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export class PurchaseService {
  constructor(private db: Sql) {}

  async purchase(userId: number, productId: number) {
    return await this.db.begin(async (trx) => {
      const product = await trx`SELECT price FROM products WHERE id = ${productId}`;
      const user = await trx`SELECT balance FROM users WHERE id = ${userId} FOR UPDATE`;

      if (product.length === 0) throw new Error('Product not found');
      if (user.length === 0) throw new Error('User not found');

      const price = new Decimal(product[0].price);
      const balance = new Decimal(user[0].balance);

      if (balance.lessThan(price)) {
        throw new Error('Insufficient funds');
      }

      const newBalance = balance.minus(price);

      await trx`UPDATE users SET balance = ${newBalance.toString()} WHERE id = ${userId}`;
      await trx`INSERT INTO purchases (user_id, product_id) VALUES (${userId}, ${productId})`;

      return { newBalance: newBalance.toNumber() };
    });
  }
}