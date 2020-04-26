import { Author } from 'src/tests/sample/entities/author';
import { EntityFactory } from 'src/entity-factory';
import { FactoryFor } from 'src/factory-for.decorator';
import { Book } from 'src/tests/sample/entities/book';

@FactoryFor(Author, 'famous')
export class FamousAuthorFactory extends EntityFactory<Author> {
  /**
   * @inheritdoc
   * Create an Author with default parameters
   * @returns an stubbed Author
   */
  async make(): Promise<Author> {
    const author = new Author();
    author.id = this.faker.random.uuid();

    const bookFactory = await this.container.getFactory(Book);
    const firstDigit: number = parseInt(author.id.charAt(0), 10);

    if (firstDigit % 2 === 0) {
      author.firstName = 'Kurt';
      author.lastName = 'Vonnegut';
      const book1 = await bookFactory.saveOne({ title: 'Slaughterhouse 5' });
      const book2 = await bookFactory.saveOne({ title: 'Cats Cradle' });
      author.books = [book1, book2];
    } else {
      author.firstName = 'Douglas';
      author.lastName = 'Adams';
      const book1 = await bookFactory.saveOne({
        title: 'The Hitchhikers Guide to the Galaxy',
      });
      const book2 = await bookFactory.saveOne({
        title: 'The Restaurant at the End of the Universe',
      });
      author.books = [book1, book2];
    }
    return author;
  }
}
