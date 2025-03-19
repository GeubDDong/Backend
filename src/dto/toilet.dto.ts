export class ToiletDto {
  id: number;
  name: string;
  street_address?: string;
  lot_address?: string;
  latitude?: number;
  longitude?: number;
  open_hours?: string;
  liked?: {
    like: boolean;
    count: number;
  };
  nearest: boolean;
}
