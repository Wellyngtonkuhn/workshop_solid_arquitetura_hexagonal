import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  
  // 1. Limite de Conexões (O mais importante)
  max: 20, 
  
  // 2. Tempo de Inatividade
  idleTimeoutMillis: 30000, 
  
  // 3. Tempo Máximo de Espera
  connectionTimeoutMillis: 2000,
});

// Listener de erro para evitar que o Node quebre (crash) se o pool perder a conexão por falha de rede
pool.on('error', (err, client) => {
  console.error('>>>>> Erro na pool de conexões', err)
  process.exit(-1);
});

export const db = drizzle(pool);