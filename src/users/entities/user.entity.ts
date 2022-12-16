import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../list/entities/list.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) //Se excluye de la infor de GrahpQL
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  }
  )
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(
    () => User,
    (user) => user.lastUpdateBy,
    { nullable: true, lazy: true },
  )
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy: User;

  @OneToMany(
    () => Item,
    (item) => item.user,
    { lazy: true }
  )
  // @Field(() => [Item])
  items: Item[];

  @OneToMany(
    () => List,
    (list) => list.user
  )
  lists: List[];

}

/**
 Para las relaciones entre columnas de la misma tabla se recomienda utilizar el lazy para que estas sean cargadas cuando responda la peteición el servidor. De lo contrario, este valor tendrá null así en la base de datos se tenga la info.
 */
