export interface RawTeamData {
  team_name: string;
  total_points: string;
}

export interface TeamData {
  team_name: string;
  total_points: number;
  rank: number;
  previousPoints: number | null;
  pointsChanged: boolean;
}
