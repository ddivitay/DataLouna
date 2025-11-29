import configJson from '../conf.json';

export type Config = {
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  skinPort: {
    clientId: string;
    secretKey: string;
  };
  redis: {
    host: string;
    port: number;
    password: string | undefined;
    db: number;
  };
};

const config: Config = configJson as unknown as Config;

export default config;