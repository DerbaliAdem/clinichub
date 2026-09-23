import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  specialty: string;
}