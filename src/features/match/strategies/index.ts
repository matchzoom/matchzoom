import type { MatchStrategy } from './types';
import { wooseokStrategy } from './wooseokStrategy';
import { yujinStrategy } from './yujinStrategy';
import { areumStrategy } from './areumStrategy';
import { jihyunStrategy } from './jihyunStrategy';

export const strategies: Record<string, MatchStrategy> = {
  wooseok: wooseokStrategy,
  yujin: yujinStrategy,
  areum: areumStrategy,
  jihyun: jihyunStrategy,
};
