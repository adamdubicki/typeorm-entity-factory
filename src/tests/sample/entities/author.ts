import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Book } from './book';

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
