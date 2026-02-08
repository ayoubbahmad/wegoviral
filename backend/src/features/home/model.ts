export interface HomeStats {
  label: string;
  value: string;
  trend?: number;
  icon?: string;
}

export interface HomeProject {
  name: string;
  progress: number;
  color: string;
}

export interface HomeChallenge {
  name: string;
  recruits: number;
  hot: boolean;
}

export interface HomeSummaryResponse {
  stats: HomeStats[];
  scripts: any[];
  videos: any[];
  projects: HomeProject[];
  challenges: HomeChallenge[];
}
