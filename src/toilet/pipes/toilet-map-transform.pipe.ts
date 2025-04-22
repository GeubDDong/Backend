import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ToiletMapRequestDto } from 'src/dto/toilet/request/toilet-request.dto';
import { ToiletBoundsDto } from 'src/dto/toilet/request/toilet-request.dto';
import { ToiletFilterDto } from 'src/dto/toilet/request/toilet-request.dto';

@Injectable()
export class ToiletMapRequestPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    const bounds: ToiletBoundsDto = {
      cenLat: parseFloat(query.cenLat),
      cenLng: parseFloat(query.cenLng),
      top: parseFloat(query.top),
      bottom: parseFloat(query.bottom),
      left: parseFloat(query.left),
      right: parseFloat(query.right),
    };

    const filters: ToiletFilterDto = {
      has_male_toilet: query.has_male_toilet === 'true',
      has_female_toilet: query.has_female_toilet === 'true',
      has_disabled_male_toilet: query.has_disabled_male_toilet === 'true',
      has_disabled_female_toilet: query.has_disabled_female_toilet === 'true',
      has_kids_toilet: query.has_kids_toilet === 'true',
      has_cctv: query.has_cctv === 'true',
      has_emergency_bell: query.has_emergency_bell === 'true',
      has_diaper_changing_station: query.has_diaper_changing_station === 'true',
    };

    const merged = { bounds, filters };

    const dto = plainToInstance(ToiletMapRequestDto, merged);

    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException();
    }

    return dto;
  }
}
