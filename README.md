# TypeORM-Entity-Factory

WIP

A module for saving bulk entities into a database via TypeORM. 

Supports:

* Databases - Post

## Installation & Usage

1. Configure your TypeORM managed database.
`https://github.com/typeorm/typeorm`

2. Install the npm package:

`npm install ... --save-dev`

3. Create a factory for an entity:

```
export class BookFactory extends EntityFactory<Book> {
  async make(): Promise<Book> {
    const book = new Book();

    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    
    return book;
  }
}
```


