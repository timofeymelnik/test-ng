import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Event} from '../../types';
import {EventApiService} from '../../services/event-api.service';

@Component({
  standalone: true,
  selector: 'app-event-item',
  imports: [],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventItemComponent {
  store = inject(EventApiService)
  event = input.required<Event>();

  get isFav() {
    return this.store.favoriteIds().has(this.event().id);
  }

  toggleFav(id: number) {
    this.store.toggleFav(id);
  }
}
