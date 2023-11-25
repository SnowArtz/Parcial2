import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate} from 'class-validator';

export class AlbumDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    readonly caratula: string;

    @Type(() => Date)
    @IsDate()
    readonly fechaLanzamiento: Date;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
