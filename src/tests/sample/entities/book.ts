import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Genre } from 'src/tests/sample/entities/genre';

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
