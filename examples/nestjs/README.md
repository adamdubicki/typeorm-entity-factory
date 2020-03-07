### SQL TypeORM sample

***NOTE** I lifted this example from https://github.com/nestjs/nest/tree/master/sample/05-sql-typeorm

You will need to bring up the mysql image as described below and run `npm run test` to run the tests.

See src/users/users.spec.ts for an example of using the entity factory for generating data.


### Installation


`npm install`

### Running

This example requires docker or a local MySQL installation.  If using a local MySQL database, see `app.module.ts` for credentials, and make sure there are matching credentials in the database and the source code.

#### Docker

There is a `docker-compose.yml` file for starting Docker.

`docker-compose up`

After running the sample, you can stop the Docker container with

`docker-compose down`

### Run the sample

Then, run Nest as usual:

`npm run start`

