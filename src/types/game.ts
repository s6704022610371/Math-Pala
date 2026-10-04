export type ShopId = 'fruit' | 'drink' | 'snack' | 'clothes' | 'myshop';
export type Difficulty = 'easy' | 'hard';

export interface ShopConfig {
  id: ShopId;
  name: string;
  shortName: string;
  topic: string;
  icon: string;
  shopkeeper: string;
  shopkeeperRole: string;
  shopkeeperAvatar: string;
  image: string;
  themeColor: {
    primary: string;
    secondary: string;
    border: string;
    accent: string;
    badgeBg: string;
    bgLight: string;
    gradient: string;
  };
  easyLabel: string;
  hardLabel: string;
  easyBadge: string;
  hardBadge: string;
  easyDesc: string;
  hardDesc: string;
}

export interface Question {
  id: string;
  shopId: ShopId;
  difficulty: Difficulty;
  storyTitle: string;
  equationText?: string;
  questionPrompt: string;
  visualItems?: { emoji: string; count: number; label: string }[];
  options: number[];
  correctAnswer: number;
  unit: string;
  explanation: string;
}

export interface HighScores {
  [key: string]: {
    easy: number;
    hard: number;
  };
}

export interface GameResult {
  shopId: ShopId;
  difficulty: Difficulty;
  solvedCount: number;
  isNewRecord: boolean;
  previousBest: number;
}
