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
      {id: '1', location: 'Kopaonik', avgRating: 3, numRatings: 10},
      {id: '2', location: 'Zlatibor', avgRating: 4, numRatings: 5},
    ];
  }


}
