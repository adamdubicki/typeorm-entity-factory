import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    name: 'first_name'
  })
  firstName: string;

  @Column('varchar', {
    length: 255,
    name: 'last_name'
  })
  lastName: string;
}