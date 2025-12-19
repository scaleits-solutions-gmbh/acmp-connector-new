import * as sql from 'mssql';

/**
 * MSSQL Connection Configuration Interface
 */
export interface MssqlConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionTimeout: number;
  requestTimeout: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

/**
 * Environment-based configuration with defaults
 */
const getConfigFromEnv = (): MssqlConfig => ({
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'ACMP',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT || '30000', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
  },
});

/**
 * MSSQL Connection Manager Singleton
 */
class MssqlConnectionManager {
  private static instance: MssqlConnectionManager;
  private pool: sql.ConnectionPool | null = null;
  private config: MssqlConfig;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.config = getConfigFromEnv();
  }

  public static getInstance(): MssqlConnectionManager {
    if (!MssqlConnectionManager.instance) {
      MssqlConnectionManager.instance = new MssqlConnectionManager();
    }
    return MssqlConnectionManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected && this.pool) return;
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = this.initializeConnection();
    try {
      await this.connectionPromise;
      this.isConnected = true;
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  private async initializeConnection(): Promise<void> {
    this.pool = new sql.ConnectionPool(this.config);
    this.pool.on('close', () => {
      this.isConnected = false;
    });
    this.pool.on('error', () => {
      this.isConnected = false;
    });
    await this.pool.connect();
  }

  public async getPool(): Promise<sql.ConnectionPool> {
    if (!this.pool || !this.isConnected) await this.connect();
    if (!this.pool) throw new Error('MSSQL connection not established');
    return this.pool;
  }

  public async executeQuery<T = any>(query: string, params?: Record<string, any>): Promise<sql.IResult<T>> {
    const pool = await this.getPool();
    const request = pool.request();
    if (params) {
      Object.entries(params).forEach(([key, value]) => request.input(key, value));
    }
    return request.query<T>(query);
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.isConnected = false;
      this.pool = null;
      this.connectionPromise = null;
    }
  }
}

export const mssqlManager = MssqlConnectionManager.getInstance();

/**
 * Convenience functions for common operations
 */
export const MssqlUtils = {
  async query<T = any>(sqlQuery: string, params?: Record<string, any>): Promise<T[]> {
    const result = await mssqlManager.executeQuery<T>(sqlQuery, params);
    return result.recordset || [];
  },

  async scalar<T = any>(sqlQuery: string, params?: Record<string, any>): Promise<T | null> {
    const result = await mssqlManager.executeQuery<T>(sqlQuery, params);
    const recordset = result.recordset;
    if (!recordset || recordset.length === 0) return null;
    const firstRow = recordset[0] as Record<string, any>;
    const firstKey = Object.keys(firstRow)[0];
    return firstKey !== undefined ? (firstRow[firstKey] as T) : null;
  },
};

export { sql };
