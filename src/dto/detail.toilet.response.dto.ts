export class DetailToiletResponseDto {
  id: number;
  name: string;
  street_address: string;
  lot_address: string;
  disabled_male: string;
  kids_toilet_male: string;
  disabled_female: string;
  kids_toilet_female: string;
  management_agency: string;
  phone_number: string;
  open_hour: string;
  latitude: number;
  longitude: number;
  emergency_bell: string;
  cctv: string;
  diaper_changing_station: string;
  data_reference_date: Date;
}
