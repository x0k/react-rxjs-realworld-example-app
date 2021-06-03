export enum FeedType {
  Global = 'global',
  ByTag = 'byTag',
  ByAuthor = 'byAuthor',
  Favorite = 'favorite',
  Your = 'your',
}

export type FeedByType = FeedType.Global | FeedType.Your

export type ProfileFeedByType = FeedType.ByAuthor | FeedType.Favorite
