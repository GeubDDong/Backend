import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ToiletModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  street_address: string;

  @Column({ type: 'varchar', length: 150 })
  lot_address: string;

  @Column({ type: 'int' })
  disabled_male: number;

  @Column({ type: 'int' })
  kids_toilet_male: number;

  @Column({ type: 'int' })
  disabled_female: number;

  @Column({ type: 'int' })
  kids_toilet_femaie: number;

  @Column({ type: 'varchar', length: 100 })
  management_agency: string;

  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @Column({ type: 'varchar', length: 50 })
  open_hour: string;

  @Column({ type: 'float8' })
  latitude: number;

  @Column({ type: 'float8' })
  longitude: number;

  @Column({ type: 'char', length: 1 })
  emergency_bell: string;

  @Column({ type: 'char', length: 1 })
  cctv: string;

  @Column({ type: 'char', length: 1 })
  diaper_changing_station: string;

  @Column({ type: 'date' })
  data_reference_date: Date;
}
