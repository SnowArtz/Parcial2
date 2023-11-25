import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class TrackDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsNumber()
    @IsNotEmpty()
    readonly duracion: number;

    @IsNotEmpty()
    readonly album: object;
}
