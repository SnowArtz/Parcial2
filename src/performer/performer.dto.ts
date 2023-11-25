import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class PerformerDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
