export interface SuggestionShrine {
  name: string;
}

export interface SearchShrinesParams {
  shrine?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  pageSize?: number;
}

export interface Shrine {
  id: string;
  name: string;
  imageUrl?: string;
  prefecture?: string;
  region?: string;
  city?: string;
}

export interface ShrineDetail extends Shrine {
  description?: string;
  website?: string;
  openingHours?: string;
  access?: string;
  address?: string;
  founded?: string;
  latitude?: number;
  longitude?: number;
  enshrineDeity?: string[];
  benefits?: string[];
}
