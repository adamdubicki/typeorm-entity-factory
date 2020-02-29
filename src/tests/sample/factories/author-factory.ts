import { Author } from 'src/tests/sample/entities/author';
import { EntityFactory } from 'src/entity-factory';
import { FactoryFor } from 'src/factory-for.decorator';
import { Book } from 'src/tests/sample/entities/book';

@FactoryFor(Author)
export class AuthorFactory extends EntityFactory<Author> {
  /**
   * @inheritdoc
   * Create an Author with default parameters
   * @returns an stubbed Author
   */
  async make(): Promise<Author> {
    const author = new Author();
    author.id = this.faker.random.uuid();
    author.firstName = this.faker.name.firstName();
    author.lastName = this.faker.name.lastName();
    author.books = await this.container.getFactory(Book).saveMany(5);
    return author;
  }
}
