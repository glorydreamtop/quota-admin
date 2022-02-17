import { openInterestEnum } from '../../enums/monitorEnum';

export interface RankParams {
  tradeDate: string;
  contract?: string;
  productId?: string;
  rankType: openInterestEnum;
}

export interface RankMember {
  memberName: string;
  volume: number;
  volumeChange: number;
  rankType?: 0 | 1 | -1;
}

export type RankResult = RankMember[];

export interface SearchProductOrContractParams {
  productId?: string;
  productName?: string;
}
