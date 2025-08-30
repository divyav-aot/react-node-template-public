import { Entity, PrimaryGeneratedColumn, Column, Timestamp, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'user_id' })
  userId: string

  @Column({ length: 50, name: 'first_name' })
  firstName: string

  @Column({ length: 50, name: 'middle_name', nullable: true, default: null })
  middleName: string

  @Column({ length: 50, name: 'last_name' })
  lastName: string

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date

  @CreateDateColumn({ type: 'timestamp', name: 'created_datetime' })
  createdDateTime: Timestamp

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_datetime' })
  updatedDateTime: Timestamp
}
