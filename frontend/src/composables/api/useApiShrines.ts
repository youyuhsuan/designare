// Composable
import { instance } from "@/composables/api/useApi";
// Config
import { API_ENDPOINTS } from "@/config/apiConfig";
// Types
import type {
  SearchShrinesParams,
  SuggestionShrine,
  Shrine,
  ShrineDetail,
} from "@/types/shrinesType";

const useApiShrines = () => {
  // Get shrine name suggestions for autocomplete
  const getShrineSuggestions = (keyword: string) =>
    instance.get<SuggestionShrine[]>(`${API_ENDPOINTS.SHRINES.SUGGESTIONS}`, {
      params: { keyword },
    });

  // Get featured today shrines for homepage
  const getFeaturedShrines = () =>
    instance.get<Shrine[]>(`${API_ENDPOINTS.SHRINES.FEATURED}`);

  // Get shrines with optional query parameters
  const getShrines = (params: SearchShrinesParams) =>
    instance.post<Shrine[]>(`${API_ENDPOINTS.SHRINES.BASE}`, params);

  const getShrine = (id: string) =>
    instance.get<ShrineDetail>(`${API_ENDPOINTS.SHRINES.BASE}/${id}`);

  return { getShrineSuggestions, getFeaturedShrines, getShrines, getShrine };
};

export default useApiShrines;
