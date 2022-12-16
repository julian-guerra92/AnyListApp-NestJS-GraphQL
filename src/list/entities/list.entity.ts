import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'lists' }) //Necesario para la configuración de DB
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(
    () => User,
    (user) => user.lists,
    { nullable: false, lazy: true }
  )
  @Index('userId-list-index') //Decorador que aumenta la efeciencia en la consulta
  @Field(() => User)
  user: User;

  @OneToMany(
    () => ListItem,
    (listItem) => listItem.list,
    { nullable: false, lazy: true }
  )
  // @Field(() => [ListItem])
  listItem: ListItem;

}
