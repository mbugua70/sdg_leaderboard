export interface RawTeamData {
  team_name: string;
  total_points: string;
  log_url?: string;
}

export interface TeamData {
  team_name: string;
  total_points: number;
  rank: number;
  previousPoints: number | null;
  pointsChanged: boolean;
  log_url?: string;
}
