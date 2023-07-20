import { PartialType } from '@nestjs/swagger';
import { CreateGranteeMasterDto } from './create-grantee-master.dto';

export class UpdateGranteeMasterDto extends PartialType(CreateGranteeMasterDto) {}
