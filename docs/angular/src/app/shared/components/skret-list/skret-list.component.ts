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
    this.appDataService.getToilets().subscribe((skreti) => {
       this.skreti = skreti;
         this.skreti.forEach(skret => {
         skret.avgRating = Math.floor(Math.random() * 5) + 1;
         skret.numRatings = Math.floor(Math.random() * 100) + 1;
        });
      }
    );
  }

  

  navigateToGoogleMaps(destinationLat: Number,destinationLng: Number): void {
    // Google Maps URL with the destination's latitude and longitude
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=walking`;

    // Open the URL in a new tab/window
    window.open(googleMapsUrl, '_blank');
  }
}
