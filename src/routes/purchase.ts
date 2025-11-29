import { FastifyPluginAsync } from 'fastify';
import { purchaseService } from '../di';

const purchaseRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/purchase', async (req, res) => {
    const { user_id, product_id } = req.body as { user_id?: number; product_id?: number };

    if (!user_id || !product_id) {
      return res.status(400).send({ error: 'user_id and product_id are required' });
    }

    if (typeof user_id !== 'number' || user_id <= 0) {
      return res.status(400).send({ error: 'Invalid user_id' });
    }

    if (typeof product_id !== 'number' || product_id <= 0) {
      return res.status(400).send({ error: 'Invalid product_id' });
    }

    try {
      const result = await purchaseService.purchase(user_id, product_id);
      return res.send({ new_balance: result.newBalance });
    } catch (err: any) {
      console.error(err);
      return res.status(400).send({ error: err.message });
    }
  });
};

export default purchaseRoutes;