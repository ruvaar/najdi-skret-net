import { Component, OnInit } from '@angular/core';
import { Skret} from '../../classes/skret';

@Component({
  selector: 'app-skret-list',
  templateUrl: './skret-list.component.html',
  styleUrls: ['./skret-list.component.css']
})
export class SkretListComponent implements OnInit{

  constructor() { }
  skreti!: Skret[];
  selectedSkret!: Skret;

  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  ngOnInit(): void {
    this.skreti = [
      {id: '1', location: 'Kopaonik', avgRating: 3, numRatings: 10, lat: 43.2951, lon: 20.7765, tags: {tag1: 'tag1', tag2: 'tag2'}},
      {id: '2', location: 'Zlatibor', avgRating: 4, numRatings: 5, lat: 43.7247, lon: 19.695, tags: {tag1: 'tag1', tag2: 'tag2'}},
    ];
  }


}
