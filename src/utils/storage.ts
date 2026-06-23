const USER_KEY = 'travel_user';
const TOKEN_KEY = 'travel_token';
const RECORDS_KEY = 'travel_records';
const FOOTPRINTS_KEY = 'travel_footprints';
const COMMENTS_KEY = 'travel_comments';

export interface StorageUser {
  userId: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  createTime: string;
  lastLoginTime: string;
}

export interface TravelRecord {
  recordId: string;
  userId: string;
  spotId: string;
  spotName: string;
  city: string;
  photos: string[];
  post: string;
  createTime: string;
}

export interface Comment {
  commentId: string;
  spotId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  rating: number;
  images: string[];
  createTime: string;
  likes: number;
}

export const storage = {
  getUser: (): StorageUser | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: StorageUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRecords: (userId: string): TravelRecord[] => {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      if (!data) return [];
      const allRecords = JSON.parse(data) as TravelRecord[];
      return allRecords.filter((r) => r.userId === userId);
    } catch {
      return [];
    }
  },

  addRecord: (record: TravelRecord): void => {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      const allRecords = data ? (JSON.parse(data) as TravelRecord[]) : [];
      allRecords.push(record);
      localStorage.setItem(RECORDS_KEY, JSON.stringify(allRecords));
    } catch {
      console.error('Failed to save record');
    }
  },

  deleteRecord: (recordId: string): void => {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      if (!data) return;
      const allRecords = JSON.parse(data) as TravelRecord[];
      const filtered = allRecords.filter((r) => r.recordId !== recordId);
      localStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
    } catch {
      console.error('Failed to delete record');
    }
  },

  getFootprints: (userId: string): string[] => {
    try {
      const data = localStorage.getItem(FOOTPRINTS_KEY);
      if (!data) return [];
      const footprints = JSON.parse(data) as Record<string, string[]>;
      return footprints[userId] || [];
    } catch {
      return [];
    }
  },

  addFootprint: (userId: string, cityId: string): void => {
    try {
      const data = localStorage.getItem(FOOTPRINTS_KEY);
      const footprints = data ? (JSON.parse(data) as Record<string, string[]>) : {};
      if (!footprints[userId]) {
        footprints[userId] = [];
      }
      if (!footprints[userId].includes(cityId)) {
        footprints[userId].push(cityId);
      }
      localStorage.setItem(FOOTPRINTS_KEY, JSON.stringify(footprints));
    } catch {
      console.error('Failed to save footprint');
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // 评论相关
  getComments: (spotId: string): Comment[] => {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      if (!data) return [];
      const allComments = JSON.parse(data) as Comment[];
      return allComments.filter((c) => c.spotId === spotId);
    } catch {
      return [];
    }
  },

  addComment: (comment: Comment): void => {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      const allComments = data ? (JSON.parse(data) as Comment[]) : [];
      allComments.unshift(comment);
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    } catch {
      console.error('Failed to save comment');
    }
  },

  deleteComment: (commentId: string): void => {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      if (!data) return;
      const allComments = JSON.parse(data) as Comment[];
      const filtered = allComments.filter((c) => c.commentId !== commentId);
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
    } catch {
      console.error('Failed to delete comment');
    }
  },

  likeComment: (commentId: string): void => {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      if (!data) return;
      const allComments = JSON.parse(data) as Comment[];
      const comment = allComments.find((c) => c.commentId === commentId);
      if (comment) {
        comment.likes += 1;
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
      }
    } catch {
      console.error('Failed to like comment');
    }
  },
};
