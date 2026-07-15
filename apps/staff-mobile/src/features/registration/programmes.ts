import type { SelectOption } from "@/src/components/ui/Select";
import { apiRequest } from "@/src/lib/api";

export interface Programme {
  id: string;
  name: string;
}

// Shown until apps/api's GET /programmes (currently an empty feature stub) is
// implemented, and used as an offline fallback afterwards too.
const FALLBACK_PROGRAMMES: Programme[] = [
  { id: "turkana-cash-2026-q3", name: "Turkana Emergency Cash Transfer" },
  { id: "drought-response-2026", name: "Drought Response Programme" },
  { id: "school-feeding-2026", name: "School Feeding Support" },
];

export const fetchProgrammes = async (): Promise<Programme[]> => {
  try {
    const data = await apiRequest<{ programmes: Programme[] }>("/programmes");
    return data.programmes?.length ? data.programmes : FALLBACK_PROGRAMMES;
  } catch {
    return FALLBACK_PROGRAMMES;
  }
};

export const programmesToOptions = (programmes: Programme[]): SelectOption[] =>
  programmes.map((programme) => ({ value: programme.id, label: programme.name }));
