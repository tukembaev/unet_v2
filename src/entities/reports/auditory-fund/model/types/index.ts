export interface AuditoryFundCampus {
  id: number;
  cumpus: string;
  cumpusen?: string | null;
  cumpuskg?: string | null;
  url_data?: string | null;
}

export interface AuditoryFundKorpus {
  id: number;
  korpus: string;
  names?: string | null;
  unic_code?: string | null;
  cumpus: number;
}

export interface AuditoryFundRoomType {
  id: number;
  slug: string;
  name_ru: string;
  name_kg?: string | null;
  name_en?: string | null;
}

export interface AuditoryFundRoom {
  id: number;
  cumpus?: string;
  korpus?: string | number;
  num_audit?: string;
  specificity?: string;
  room_type?: number | null;
  room_type_name?: string | null;
  room_type_name_kg?: string | null;
  room_type_name_en?: string | null;
  room_type_slug?: string | null;
  nameRU?: string;
  nameKG?: string;
  nemeENG?: string;
  name2?: string;
  department?: string | null;
  institute?: string | null;
  capacity?: string | null;
  Responsible?: string | null;
  numResponsible?: string | null;
  public_url?: string | null;
  unic_code?: string | null;
}

export interface AuditoryFundRoomsParams {
  page?: number;
  page_size?: number;
  campus?: number;
  korpus?: number;
  room_type?: string;
  search?: string;
}

export interface AuditoryFundRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditoryFundRoom[];
}
