import { EntityFactory } from "../../..";
import { Book } from './../entities/book';

export class BookFactory extends EntityFactory<Book> {
  async make(): Promise<Book> {
    const book = new Book();

    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    
    return book;
  }
}