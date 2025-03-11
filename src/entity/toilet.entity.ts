import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Connect')
export class Connect extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
}
