import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListModule } from './list/list.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /*Configuración con proteción a esquema de GraphQL*/
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        introspection: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          /*Se comenta ya que de lo contrario, no cargaría el login. Se recomienda que estos estén separados para evitar este problema*/
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if(!token) throw Error('Token needed!');
          // const payload = jwtService.decode(token);
          // if(!payload) throw Error('Token not valid!');
        }
      })
    }),
    /*Configuración básica*/
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   // debug: false,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault
    //   ]
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(){
    console.log('host:', process.env.STATE);
    console.log('host:', process.env.DB_HOST);
    console.log('port:', +process.env.DB_PORT);
    console.log('username:', process.env.DB_USERNAME);
    console.log('password:', process.env.DB_PASSWORD);
    console.log('database:', process.env.DB_NAME);
  }

 }

/*
- Para la conexión a la base de datos, tener en cuenta la información despuesta en la documentación de Nest Js: https://docs.nestjs.com/techniques/database
 */
