import { ApiExtraModels } from '@nestjs/swagger';
import { ToiletBaseDto } from '../base/toilet-base.dto';

@ApiExtraModels()
export class PublicToiletDto extends ToiletBaseDto {}
