import { IsString, MaxLength } from "class-validator";

export class CreateTenancyDto {
    @IsString()
    @MaxLength(50, {message: 'This name is not valid'})
    readonly name: string;

}