import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
    
    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    albums: PerformerEntity[];
}
