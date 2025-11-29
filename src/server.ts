import Fastify from 'fastify';
import skinportRoutes from './routes/skinport';
import purchaseRoutes from './routes/purchase';

const app = Fastify({ logger: false });

app.register(skinportRoutes, { prefix: '/api' });
app.register(purchaseRoutes, { prefix: '/api' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();