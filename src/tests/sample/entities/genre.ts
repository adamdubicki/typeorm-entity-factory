import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
