import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  patientId: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string;
}