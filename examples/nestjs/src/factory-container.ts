import { getConnection } from "typeorm";
import { FactoryContainer } from "typeorm-entity-factory";
import { UserFactory } from "./users/user.entity.factory";


export const getContainer = () => FactoryContainer.init({
  connection: getConnection(),
  factories: [
    UserFactory
  ]
})