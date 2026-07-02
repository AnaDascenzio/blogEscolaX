import { DataSource } from 'typeorm'
import { env } from '../../env'
import { User } from '../../api/entities/user.entity'
import { Post } from '../../api/entities/post.entity'

export const appDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [User, Post],
  logging: env.NODE_ENV === 'development',
synchronize: true
})

appDataSource
  .initialize()
  .then(() => {
    console.log('Database with typeorm connected')
  })
  .catch((error) => {
    console.error('Error connecting to database with typeorm', error)
  })