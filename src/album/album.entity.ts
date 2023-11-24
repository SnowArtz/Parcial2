import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from '../track/track.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
    
    @Column()
    caratula: string;
    
    @Column()
    fecha: Date;

    @Column()
    descripcion: string;

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];

    @JoinTable()
    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    performers: PerformerEntity[];

}
