import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    name: 'title'
  })
  title: string;
}