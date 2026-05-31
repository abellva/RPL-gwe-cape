import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  office_id: number;

  @Column()
  office_title: string;

  @Column()
  office_slug: string;

  @Column()
  price: number;

  @Column()
  duration: string;

  @Column({ type: "enum", enum: ["pending", "confirmed", "cancelled"], default: "pending" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}