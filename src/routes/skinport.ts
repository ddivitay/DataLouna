import { FastifyPluginAsync } from 'fastify';
import { skinportService } from '../di';

const skinportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/skinport', async (req, res) => {
    try {
      const prices = await skinportService.getMinPrices();
      return res.send(prices);
    } catch (err: any) {
      console.error(err);
      return res.status(500).send({ error: err.message });
    }
  });
};

export default skinportRoutes;