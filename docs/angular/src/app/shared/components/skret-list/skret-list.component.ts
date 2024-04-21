import { Component, OnInit } from '@angular/core';
import { Skret} from '../../classes/skret';
import { AppDataService } from '../../services/app-data.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-skret-list',
  templateUrl: './skret-list.component.html',
  styleUrls: ['./skret-list.component.css']
})
export class SkretListComponent implements OnInit{

  constructor(
    private appDataService: AppDataService,
    private http: HttpClient
  ) {}

  skreti!: Skret[];
  filteredSkreti!: Skret[];
  selectedSkret!: Skret;

  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    
  }

  ngOnInit(): void {
    this.getToilets();
  }

  getToilets(): void {
    this.appDataService.getToilets().subscribe(skreti => this.skreti = skreti);
  }
}
