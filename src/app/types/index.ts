export type EventStatus = 'draft' | 'published' | 'archived';

export interface Owner { id: number; name: string; }

export interface Event {
  id: number;
  title: string;
  status: EventStatus;
  dateStart: string;   // ISO
  price: number;       // рубли, 0 допустим
  capacity: number;
  tags: string[];
  owner: Owner;
  createdAt: string;   // ISO
}

