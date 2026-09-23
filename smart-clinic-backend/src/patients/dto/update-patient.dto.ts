import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;
}