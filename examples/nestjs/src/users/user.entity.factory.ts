import { FactoryFor, EntityFactory } from 'typeorm-entity-factory'
import { User } from './user.entity';

@FactoryFor(User)
export class UserFactory extends EntityFactory<User> {
  async make(): Promise<User> {
    const user = new User();
    user.firstName = this.faker.name.firstName();
    user.lastName = this.faker.name.lastName();
    user.isActive = true;
    return user;
  }
}