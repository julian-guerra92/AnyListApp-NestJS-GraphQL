import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { LoginInput } from '../auth/dto/inputs/login.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepositoty: Repository<User>,
  ) { }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepositoty.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.usersRepositoty.save(newUser);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.usersRepositoty.createQueryBuilder()
      .take(limit)
      .skip(offset)
    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%` })
    }
    if (roles.length !== 0) {
      queryBuilder.andWhere('ARRAY[roles] && ARRAY[:...roles]').setParameter('roles', roles)
    }
    return queryBuilder.getMany();
  }

  async findOneByEmail(loginInput: LoginInput): Promise<User> {
    try {
      const { email } = loginInput;
      return await this.usersRepositoty.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`Email not found.`)
      // this.handleDBError({
      //   code: 'error-001',
      //   detail: `Email not found`
      // });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepositoty.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found.`)
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User
  ): Promise<User> {
    try {
      const user = await this.usersRepositoty.preload({
        ...updateUserInput,
        id
      });
      user.lastUpdateBy = adminUser;
      return await this.usersRepositoty.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepositoty.save(userToBlock);
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please, check server logs');
  }

}
