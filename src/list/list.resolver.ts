import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput, UpdateListInput } from './dto/inputs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args/';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {

  constructor(
    private readonly listService: ListService,
    private readonly listItemService: ListItemService
  ) { }

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList' })
  removeList(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'listItems' })
  async getListitems(
    @Parent() list: List, //Nos da el ID de la lista a la que pertenece el listItem
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'totalItems' })
  async countListItemByList(
    @Parent() list: List
  ): Promise<number> {
    return this.listItemService.listCountItems(list);
  }

}
