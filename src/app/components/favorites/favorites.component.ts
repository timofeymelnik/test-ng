import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {EventApiService} from '../../services/event-api.service';
import {EventItemComponent} from '../event-item/event-item.component';

@Component({
  selector: 'app-favorites',
  imports: [
    EventItemComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  store = inject(EventApiService);
}
