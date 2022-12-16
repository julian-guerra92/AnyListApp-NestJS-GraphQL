import { registerEnumType } from "@nestjs/graphql";


export enum ValidRoles {
    admin = 'admin',
    user = 'user',
    superUser = 'superUser'
}

registerEnumType(ValidRoles, {
    name: 'ValidRoles',
    description: 'Utilizado para definir los posibles roles de usuarios de mi App.'
});

/*
La enumeración debe ser registrada para que pueda ser reconocida y usada por GraphQL. De lo contrario, esta generará un error en donde se menciona que esta no cuenta con el decorado adecuado.
*/