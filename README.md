# TypeORM-Entity-Factory

A module for saving bulk entities into a database via TypeORM. Useful for E2E database testing.

## Quickstart

1. Configure your TypeORM managed database. 
`https://github.com/typeorm/typeorm` 

2. Install the npm package:

`npm install ... --save-dev`

3. Create a factory for your entities. For the examples below I will be using a sample database schema.

... TODO ... put DB diagram.

After creating your entities via TypeORM we can create a `Factory` for the entity. A factory class will allow us to specify default stub data to use when creating an entity. 

... TODO put sample factory classes here ...


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

5. Use your factory within your tests.
```
// Create 25 random book instances
const books = await container.getFactory('Book').saveMany(25);

// Create 1 random book instance
const books = await container.getFactory('Book').saveOne();
```

## Overrides

With a configured factory instance we can bulk create database entities with random data. What if we want to override some of the properties of the entities. For example, create 25 books all with the same title.

The saveOne() and saveMany() functions can take in an optional partial entity. This partial entities parameters will override the properties of all created entities generated within the function.

```
await bookFactory.saveMany(25, { title: 'Slaughterhouse-Five' });
```

The factory will map any override parameters onto the entity so long as an entity has a matching property.
