import { HighScores, ShopId, Difficulty } from '../types/game';

const STORAGE_KEY = 'math_market_high_scores_v1';

export const DEFAULT_HIGH_SCORES: HighScores = {
  fruit: { easy: 0, hard: 0 },
  drink: { easy: 0, hard: 0 },
  snack: { easy: 0, hard: 0 },
  clothes: { easy: 0, hard: 0 },
  myshop: { easy: 0, hard: 0 },
};

export function getHighScores(): HighScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HIGH_SCORES;
    const parsed = JSON.parse(raw);
    return {
      fruit: { ...DEFAULT_HIGH_SCORES.fruit, ...parsed.fruit },
      drink: { ...DEFAULT_HIGH_SCORES.drink, ...parsed.drink },
      snack: { ...DEFAULT_HIGH_SCORES.snack, ...parsed.snack },
      clothes: { ...DEFAULT_HIGH_SCORES.clothes, ...parsed.clothes },
      myshop: { ...DEFAULT_HIGH_SCORES.myshop, ...parsed.myshop },
    };
  } catch {
    return DEFAULT_HIGH_SCORES;
  }
}

export function saveHighScore(
  shopId: ShopId,
  difficulty: Difficulty,
  solvedCount: number
): { isNewRecord: boolean; previousBest: number } {
  const currentScores = getHighScores();
  const previousBest = currentScores[shopId]?.[difficulty] ?? 0;

  if (solvedCount > previousBest) {
    currentScores[shopId] = {
      ...currentScores[shopId],
      [difficulty]: solvedCount,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentScores));
    } catch {
      // ignore
    }
    return { isNewRecord: true, previousBest };
  }

  return { isNewRecord: false, previousBest };
}

export function resetAllHighScores(): HighScores {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_HIGH_SCORES;
}
