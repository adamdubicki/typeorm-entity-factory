import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import { Genre } from "./genre";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 255,
    name: "title"
  })
  title: string;

  @OneToOne(type => Genre, { onDelete: "SET NULL" })
  @JoinColumn()
  genre: Genre;
}
