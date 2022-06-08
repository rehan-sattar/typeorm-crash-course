import { Column, Entity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Banker } from './banker';
import { Transactions } from './transaction';
import { Person } from './utils/Person';

@Entity('clients')
export class Client extends Person {
  @Column({ default: 0 })
  balance: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'simple-json', nullable: true })
  additional_info: {
    age: number;
    hair_color: string;
  };

  @Column({
    type: 'simple-array',
    default: []
  })
  family_members: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Transactions, (transaction) => transaction.client, { cascade: true })
  transactions: Transactions[];

  @ManyToMany(() => Banker, { cascade: true })
  bankers: Banker[];
}
