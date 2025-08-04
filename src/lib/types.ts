
import type { Timestamp } from "firebase/firestore";

export type User = {
    id?: string;
    name: string;
    email: string;
    photoURL: string;
    isAdmin: boolean;
    isCouncilMember: boolean;
    councilRole?: string;
    councilDepartment?: string;
    description?: string;
}

export type CouncilMember = User & {
  councilRole: string;
  councilDepartment: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  link?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  user: string;
  avatarUrl: string;
  timestamp: Timestamp;
  imageUrl?: string;
};
