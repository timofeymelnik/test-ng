import {computed, effect, inject, Injectable, Signal, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Event, EventStatus} from '../types';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  status = signal<Set<EventStatus>>(new Set())
  events = signal<Event[]>([]);
  query = signal<string>('');
  favoriteIds = signal<Set<Event['id']>>(new Set());
  favorites = computed(() => {
    return this.events().filter(e => {
      return this.favoriteIds().has(e.id);
    })
  });
  filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.status();

    return this.events().filter(e => {
        return e.title.toLowerCase().includes(query) && (status.size === 0 || status.has(e.status));
      }
    );
  });

  constructor(private http: HttpClient) {
    this.loadEvents();
    this.loadFavorites();

    effect(() => {
      this.syncFavorites();
    });
  }

  getFavorites(): Signal<Event[]> {
    return this.favorites;
  }

  loadEvents() {
    return this.http.get<Event[]>('assets/db.json').subscribe({
      next: (data) => {
        this.events.set(data);
        return data;
      },
      error: (error) => {
        console.error('There was an error!', error);
        return [];
      }
    });
  }

  search(t: string) {
    this.query.set(t);
  }

  filterByStatus(s: EventStatus[]) {
    this.status.set(new Set(s));
  }

  toggleFav(id: Event['id']) {
    const favs = new Set(this.favoriteIds());

    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }

    this.favoriteIds.set(favs)
  }

  private syncFavorites() {
    const favs = [...this.favoriteIds()];
    localStorage.setItem('favs', JSON.stringify(favs));
  }

  loadFavorites() {
    const favs = localStorage.getItem('favs');

    if (!favs) {
      return;
    }

    try {
      const ids = JSON.parse(favs);
      this.favoriteIds.set(new Set(ids));
    } catch (e) {
      console.error('There was an error!', e);
    }
  }

  getEventById(id: number) {
    return this.events().find(e => e.id === id);
  };
}
