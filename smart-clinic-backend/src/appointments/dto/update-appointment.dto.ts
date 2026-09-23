import { IsEnum } from 'class-validator';

import { AppointmentStatus } from '../../generated/prisma/client';

export class UpdateAppointmentDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}