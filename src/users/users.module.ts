import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { ItemsModule } from '../items/items.module';
import { ListModule } from '../list/list.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ItemsModule,
    ListModule
  ],
  exports: [
    TypeOrmModule,
    UsersService
  ]
})
export class UsersModule { }
