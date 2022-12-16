import { Field, ObjectType } from "@nestjs/graphql";
import { User } from '../../users/entities/user.entity';


@ObjectType()
export class AuthResponse {

    @Field(() => String)
    token: string;

    @Field(() => User)
    user: User;


}


/*
Los ObjectType están más relacionados a los querys que van a hacer a nuestro servicio y la data que que queremos se le responde al usuario
 */