import { EntityFactory } from 'src/entity-factory';
import { FactoryFor } from 'src/factory-for.decorator';
import { Genre } from 'src/tests/sample/entities/genre';

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
