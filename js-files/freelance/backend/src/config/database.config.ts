import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'skillsync',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/*.ts'], 
  migrationsTableName: 'migrations',
};

export const databaseConfig: TypeOrmModuleOptions = typeOrmConfig;
 
// This is used by TypeORM CLI for migrations
export const AppDataSource = new DataSource(typeOrmConfig);   
  