export interface TimeEntry {
  id: number;
  date: string;
  project: string;
  category: string;
  description: string;
  hours: number;
  createdAt: Date;
  updatedAt: Date;
}
