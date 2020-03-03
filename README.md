# TypeORM-Entity-Factory

A module for saving bulk entities into a database via TypeORM for E2E database testing.

```npm i typeorm-entity-factory --save-dev```

## State of Library

This module is currently in testing phase. Before version 1.0.0 is released all of the development is considered experimental is subject to change.

Things to add:

* NestJS example
* Contribution guidelines
* CI/CD

## Motivation

For E2E testing it is useful to have sample data within a database for testing queries. Unfortunately, inserting hundreds of entities can be a tedious. Furthermore, with relational data it is time-consuming to ensure that the data is varied enough for thorough testing.

This package allows for the bulk creation of TypeORM entities. Each entity has pseudo-random data which can be overridden.

```typescript
/** Declare the injection container */
const container = await FactoryContainer.init({
  connection, // Your TypeORM database connection
  factories: [
    // An array of factory classes for bulk creating entities
    BookFactory,
    AuthorFactory,
    GenreFactory,
  ],
});

/** Retrieve the factories */
const authorFactory = container.getFactory(Author);
const bookFactory = container.getFactory(Book);
const genreFactory = container.getFactory(Genre);

/** Create single entity with random data and relations. */
const author = await authorFactory.saveOne();
/**
 *  Author {
 *    id: 'fc0286d2-5442-4228-bfb5-a98863f002c6',
 *    firstName: 'Lavina',
 *    lastName: 'Maggio',
 *    books: [
 *      Book {
 *        id: '1af79ea2-5baa-480f-9456-f5b04a7d1c0f',
 *        title: 'Chief Paradigm Assistant',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '3ea7f6b7-477a-4c92-a5c0-3f96c6de9da6',
 *        title: 'Lead Communications Coordinator',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: 'ed9637ef-f11b-48b5-bf1a-5ce4960604c2',
 *        title: 'Corporate Integration Architect',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '64f04192-7f5e-4b95-ba6b-76598012f61c',
 *        title: 'Product Implementation Agent',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '2a739e2e-487d-4104-98c0-70454ab36ea2',
 *        title: 'Internal Configuration Consultant',
 *        genre: [Genre]
 *      }
 *    ]
 *  }
 */

/** Create many entities with random data */
const books = await bookFactory.saveMany(5);
/**
 * [
 *   Book {
 *     id: '1eb24072-57eb-46be-8657-6fcaf41aaac1',
 *     title: 'SMS Fresh Brand'
 *   },
 *   Book {
 *     id: '4b43bb2e-b309-49b9-9f6e-9940aff45ff8',
 *     title: 'Senior Brand Agent'
 *   },
 *   Book {
 *     id: 'd0f737e3-3ace-4b81-8f14-c3d1773addad',
 *     title: 'Customer Response Director'
 *   },
 *   Book {
 *     id: '1bbc1e43-e7f4-48cd-9289-c9d68e3c381d',
 *     title: 'District Accounts Engineer'
 *   },
 *   Book {
 *     id: '9d4acedb-d253-4bb6-8a6b-16e2c6720c60',
 *     title: 'Direct Paradigm Executive'
 *   },
 * ]
 */

/** Pass in optional override values to generate specific data */
const programmingGenre = await genreFactory.saveOne({
  name: 'Programming',
});
/**
 * Genre {
 *  name: 'Programming',
 *  id: 6637
 * }
 */

/** Combine factories for bulk relational data */
const programmingBooks = await bookFactory.saveMany(10, {
  genre: programmingGenre,
});
/**
 * [
 *   Book {
 *     id: '932f74f8-3dd9-4225-8372-62bce0b47442',
 *     title: 'Chief Configuration Specialist',
 *     genre: Genre { name: 'Programming', id: 6637 }
 *   },
 *   Book {
 *     id: '63452727-4321-4477-8fd6-1a90dce36693',
 *     title: 'Senior Operations Assistant',
 *     genre: Genre { name: 'Programming', id: 6637 }
 *   },
 *   Book {
 *     id: '73acc12e-0366-43d9-a7c3-378f824bf9c4',
 *     title: 'Global Program Engineer',
 *     genre: Genre { name: 'Programming', id: 6637 }
 *   },
 *   Book {
 *     id: '78557247-1e21-4e38-828a-e24405fe8185',
 *     title: 'Forward Tactics Orchestrator',
 *     genre: Genre { name: 'Programming', id: 6637 }
 *   },
 *   Book {
 *     id: 'eaa40ccd-fa4b-4765-b8d7-e67c3b060025',
 *     title: 'Legacy Web Developer',
 *     genre: Genre { name: 'Programming', id: 6637 }
 *   },
 * ]
 */
```

## Example

This quick-start assumes you already have a TypeORM database: `https://github.com/typeorm/typeorm`.

For the examples below we will be using a simple database schema.

<p align="center">
  <img src="https://raw.githubusercontent.com/adamdubicki/typeorm-entity-factory/master/images/sample-entity-relationship-diagram.png" width="600" alt="Sample ERD" />
</p>

In this simple example, an author writes many books, and book belongs to a single genre.
These map to the following TypeORM entities:

```typescript
@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    name: 'first_name',
  })
  firstName: string;

  @Column('varchar', {
    length: 255,
    name: 'last_name',
  })
  lastName: string;

  @ManyToMany(type => Book, { onDelete: 'CASCADE' })
  @JoinTable()
  books: Book[];
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    name: 'title',
  })
  title: string;

  @ManyToOne(type => Genre, { onDelete: 'SET NULL' })
  @JoinColumn()
  genre: Genre;
}

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('varchar', {
    length: 255,
    name: 'name',
  })
  name: string;
}
```

### Creating our first factory

An entity factory generates entities in bulk and stubs them with default data. To start off with we will make the GenreFactory to bulk create Genres. Each factory comes with a faker instance injected into it for creating random data.

```typescript
@FactoryFor(Genre)
export class GenreFactory extends EntityFactory<Genre> {
  /**
   * @inheritdoc
   * Create a Genre with default parameters
   * @returns a stubbed Genre
   */
  async make(): Promise<Genre> {
    const genre = new Genre();
    genre.name = this.faker.random.word();
    return genre;
  }
}
```

Each entity factory only needs to implement a make() function. The make function returns an instantiated entity class with stub data.

To use our new factory, we need to pass it into init function of the FactoryContainer class.

```typescript
const container = FactoryContainer.init({
  connection, // Your TypeORM database connection
  factories: [GenreFactory], // An array of our entity factories
});
```

This will inject the database connection into all of factories and allow us to perform nested factories described later. The connection must be to the database which has the entity generated by the factories parameter.

Using the container instance we can retrieve an instance of the genre factory.

```typescript
const genreFactory = container.getFactory(Genre);
```

The factory class has two methods of interest makeOne() and makeMany(). These method calls invoke the make method that we defined in our factory.

```typescript
/**
 * Create a genre of name 'Romance'.
 * The saveOne method takes in a override param object.
 * Any keys within the object which are shared with the entity
 * will be overridden automatically.
 */

const genre = await genreFactory.saveOne({ name: 'Romance' });

/**
 * Create five genres with no overrides.
 * The saveMany method is nearly the same as the saveOne method
 * but takes in a `count` as a primary argument which decides
 * how many of that entity it will create. The secondary argument
 * is the same overrides object as on saveOne. The override object will
 * be applied to each of the entities created in the saveMany() invocation.
 */
const genres = await genreFactory.saveMany(5);
```

### Nested Factories

Now that we are familiar with creating factories - lets make a more complicated factory that auto-generates it's own relation.

```typescript
@FactoryFor(Book)
export class BookFactory extends EntityFactory<Book> {
  /**
   * @inheritdoc
   * Create a Book with default parameters
   * @returns a stubbed Book
   */
  async make(): Promise<Book> {
    const book = new Book();
    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    // Each factory has reference to the container it was injected into
    book.genre = await this.container.getFactory(Genre).saveOne();
    return book;
  }
}
```

The BookFactory creates its own Genre using the GenreFactory we declared earlier. Factories can be 'nested' in this way for creating data with relations.

Just like the GenreFactory, the BookFactory has to be injected into the container so that all factory references can be resolved at run-time.

```typescript
const container = FactoryContainer.init({
  connection,
  factories: [
    GenreFactory,
    BookFactory, // <<< Newly Added
  ],
});
```

With our two factories completed, we are now able to bulk create some more sophisticated data.

```typescript
const bookFactory = container.getFactory(Genre);

/** Create 10 random books - each with their own unique Genre */
const randomBooks = await bookFactory.saveMany(10);

/** Pass in optional override values to generate specific data */
const programmingGenre = await genreFactory.saveOne({
  name: 'Programming',
});

/** Combine factories for bulk relational data */
const programmingBooks = await bookFactory.saveMany(10, {
  genre: programmingGenre,
});
```

The last factory to make is the AuthorFactory - which luckily is much more complicated than the BookFactory.

```typescript
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
```

Just like the BookFactory and GenreFactory, we have to add this to container.

```typescript
const container = FactoryContainer.init({
  connection,
  factories: [GenreFactory, BookFactory, AuthorFactory],
});
```

Invoking `saveOne()` on the AuthorFactory class will create five books, each with their own genre.

```typescript
const authorFactory = container.getFactory(Author);
await authorFactory.saveMany();
/**
 *  Author {
 *    id: 'fc0286d2-5442-4228-bfb5-a98863f002c6',
 *    firstName: 'Lavina',
 *    lastName: 'Maggio',
 *    books: [
 *      Book {
 *        id: '1af79ea2-5baa-480f-9456-f5b04a7d1c0f',
 *        title: 'Chief Paradigm Assistant',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '3ea7f6b7-477a-4c92-a5c0-3f96c6de9da6',
 *        title: 'Lead Communications Coordinator',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: 'ed9637ef-f11b-48b5-bf1a-5ce4960604c2',
 *        title: 'Corporate Integration Architect',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '64f04192-7f5e-4b95-ba6b-76598012f61c',
 *        title: 'Product Implementation Agent',
 *        genre: [Genre]
 *      },
 *      Book {
 *        id: '2a739e2e-487d-4104-98c0-70454ab36ea2',
 *        title: 'Internal Configuration Consultant',
 *        genre: [Genre]
 *      }
 *    ]
 *  }
 */
```

## Local development

This repository uses docker-compose for it's local development. Please refer to the [docker documentation](https://docs.docker.com/install/]) for installing docker onto your machine.

To use this repository for development:

1. Clone the repository: `git clone https://github.com/adamdubicki/typeorm-entity-factory.git`

2. Instantiate the development and database container: `docker-compose up -d` The development container is configured with npm and a test suite for experimenting with changes. The docker-compose.yml maps the src files into the container, changes made in your local repository will be reflected in the container.

3. You can then shell into the development container with `docker exec -it typeorm-entity-factory /bin/bash`.

4. From within the container you can run the test suite with `npm run test`.
