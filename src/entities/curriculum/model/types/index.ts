export interface DirectionItem {
  id: number;
  direction: string;
  semester_count: number;
  subjects_count: number;
  creator_id: number | null;
  employee_name: string;
  start_year: string | null;
  end_year: string | null;
}

export type Directions = DirectionItem[];
