import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GApiService } from '../gapi.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  constructor(private gapiService: GApiService) {
  }

  loggedIn = false;

  ngOnInit(): void {
    this.loggedIn = this.gapiService.isAuthenticated();
    this.sub = this.gapiService.authStatusChange.subscribe(newValue => this.loggedIn = newValue);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
