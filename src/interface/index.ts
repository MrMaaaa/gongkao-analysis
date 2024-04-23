export interface ScoreItem {
  no?: string;
  id: number | string;
  rank: number | string;
  name: string;
  post: string;
  postId: string;
  score: number;
  shenlun?: number;
  xingce?: number;
  gongan?: number;
}

export interface ScoreFullItem extends Required<ScoreItem> {}

export interface ScoreObjItemCell<T = ScoreItem> {
  max?: T;
  min?: T;
  ave: number;
  diff: number;
}
