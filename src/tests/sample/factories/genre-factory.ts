import { EntityFactory } from '../../..';
import { Genre } from '../entities/genre';
import { FactoryFor } from '../../../factory-for.decorator';

@FactoryFor(Genre)
export class GenreFactory extends EntityFactory<Genre> {
  async make(): Promise<Genre> {
    const genre = new Genre();

    genre.name = this.faker.random.word();

    return genre;
  }
}
