# TypeORM-Entity-Factory

WIP

A module for saving bulk entities into a database via TypeORM. 

Supports:

* Databases - Post

## Installation and QuickStart

1. Configure your TypeORM managed database.
`https://github.com/typeorm/typeorm`

2. Install the npm package:

`npm install ... --save-dev`

3. Create a factory for your entities.

```
@FactoryFor(Book)
export class BookFactory extends EntityFactory<Book> {
  async make(): Promise<Book> {
    const book = new Book();

    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    
    return book;
  }
}
```

4. Pass your factory classes into the factory container.
This will require the database connection to your entities.
If you have multiple databases, you will need separate factory
containers.

```
const connection: Connection = (retrieve your typeORM connection)

const container = await FactoryContainer.init({
  connection,
  factories: [
    BookFactory
  ],
});
```

5. Use your factory
```
// Create 25 Random Book Instances
const books = await container.getFactory('Book').makeMany(25);
```


