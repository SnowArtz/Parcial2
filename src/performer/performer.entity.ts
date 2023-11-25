import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

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

    @ManyToMany(()=> AlbumEntity, album => album.performers)
    albums: AlbumEntity[];
}
