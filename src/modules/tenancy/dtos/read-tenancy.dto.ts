import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";

@Exclude()
export class ReadTenancyDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    @MaxLength(50, {message: 'This name is not valid'})
    readonly name: string;

}