import { EntityFactory } from '../../..';
import { Book } from '../entities/book';
import { FactoryFor } from '../../../factory-for.decorator';

@FactoryFor(Book)
export class BookFactory extends EntityFactory<Book> {
  async make(): Promise<Book> {
    const book = new Book();

    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    book.genre = await this.container.getFactory('Genre').saveOne();

    return book;
  }
}
