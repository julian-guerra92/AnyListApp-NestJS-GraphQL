import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'items' }) //Necesario para la configuración de DB
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  @ManyToOne(
    () => User,
    (user) => user.items,
    { nullable: false, lazy: true }
  )
  @Index('userId-index') //Decorador que aumenta la efeciencia en la consulta
  @Field(() => User)
  user: User;

  @OneToMany(
    () => ListItem,
    (listItem) => listItem.item,
    { lazy: true }
  )
  @Field(() => [ListItem])
  listItem: ListItem[];

}
