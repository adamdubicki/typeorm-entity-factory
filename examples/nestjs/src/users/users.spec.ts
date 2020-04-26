import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { UserFactory } from './user.entity.factory';
import { getContainer } from '../factory-container';
import { User } from './user.entity';

describe('Users', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let user1: User;
  let user2: User;
  let user3: User;

  const create = '/users';
  const findAllUsers = '/users';
  const findOneUser = '/users/:id';
  const remove = '/users/:id';

  beforeAll(async () => {
    // Initialize the application
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Declare our container
    const container = await getContainer();
    userFactory = container.getFactory(User);
    [user1, user2, user3] = await userFactory.saveMany(3);
  });

  afterAll(async () => {
    await app.close();
  });

  it(`[GET] ${findAllUsers}`, async () => {
    const response = await request(app.getHttpServer())
      .get(findAllUsers)
      .expect(HttpStatus.OK);

    const users = response.body;
    expect(users).toContainEqual(user1);
    expect(users).toContainEqual(user2);
    expect(users).toContainEqual(user3);
  });

  it(`[GET] ${findOneUser}`, async () => {
    const response = await request(app.getHttpServer())
      .get(findOneUser.replace(':id', user1.id.toString()))
      .expect(HttpStatus.OK);

    const user = response.body;
    expect(user).toEqual(user1);
  });

  it(`[DELETE] ${remove}`, async () => {
    await request(app.getHttpServer())
      .delete(remove.replace(':id', user3.id.toString()))
      .expect(HttpStatus.OK);

    const response = await request(app.getHttpServer())
      .get(findAllUsers)
      .expect(HttpStatus.OK);

    const users = response.body;
    expect(users).toContainEqual(user1);
    expect(users).toContainEqual(user2);
    expect(users).not.toContainEqual(user3);
  });

  it(`[POST] ${create}`, async () => {
    const newUser = (
      await request(app.getHttpServer())
        .post(create)
        .send({
          firstName: 'Foo',
          lastName: 'Bar',
        })
        .expect(HttpStatus.CREATED)
    ).body;

    const response = await request(app.getHttpServer())
      .get(findAllUsers)
      .expect(HttpStatus.OK);

    const users = response.body;
    expect(users).toContainEqual(newUser);
  });
});
