import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../list/entities/list.entity';
import { ListService } from '../list/list.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listService: ListService,
        private readonly listItemService: ListItemService
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        if (this.isProd) {
            throw new UnauthorizedException('We cannot run SEED on Prod!')
        }
        await this.deleteDataBase();
        const user = await this.loadUsers();
        await this.loadItems(user);
        const list = await this.loadLists(user);
        const items: Item[] = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {});
        await this.loadListItem(list, items);
        return true;
    }

    async deleteDataBase() {
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User> {
        const users = [];
        for (const user of SEED_USERS) {
            users.push(await this.usersService.create(user));
        }
        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        SEED_ITEMS.forEach(item => {
            this.itemsService.create(item, user);
        })
    }

    async loadLists(user: User): Promise<List> {
        const lists = [];
        for (const list of SEED_LISTS) {
            lists.push(await this.listService.create(list, user));
        }
        return lists[0];
    }

    async loadListItem(list: List, items: Item[]): Promise<void> {
        for (const item of items) {
            this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            })
        }
    }

}

/*
- Será conveniente que este método tampoco pueda ser ejecutado si quien lo requiere no se encuentra autenticado ni con perfil de administrador. Esto sería posible si tuvieramos el login en un CRUD independiente.
 */
