import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {EventApiService} from '../../services/event-api.service';
import {EventItemComponent} from '../event-item/event-item.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {EventStatus} from '../../types';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [EventItemComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  store = inject(EventApiService);
  searchForm  = new FormControl('');
  router = inject(Router);
  route = inject(ActivatedRoute);

  private searchTerm = this.searchForm.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((t) => {
      this.store.search(t ?? '');

      this.updateUrlParams();
    });

  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement)
      ?.selectedOptions;

    this.store.filterByStatus(Array.from(status).map(o => o.value as EventStatus))
    this.updateUrlParams();
  }

  ngOnInit() {
    this.initUrlParams();
  }

  isSelected(status: EventStatus) {
    return this.store.status().has(status);
  }

  private initUrlParams() {
    const qParams = this.route.snapshot.queryParams;

    const search = qParams['search'] ?? '';
    if (search) {
      this.searchForm.setValue(search);
    }

    const status = qParams['status'] ?? '';
    if (status) {
      this.store.filterByStatus(status.split(',') as EventStatus[]);
    }
  }

  private updateUrlParams() {
    const qParams: {
      [key: string]: string;
    } = {};

    const value = this.searchForm.value;
    if (value && value.trim()) {
      qParams['search'] = value.trim();
    }

    const status = Array.from(this.store.status()).join(',');
    if (status) {
      qParams['status'] = status;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: qParams,
      queryParamsHandling: 'replace',
    })
  }
}
