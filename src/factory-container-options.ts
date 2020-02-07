import { EntityFactory } from "./entity-factory";

export interface IFactoryContainerOptions {
  factories: { entity: object, factory: EntityFactory<any, any> }[]
}