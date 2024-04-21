import { Component, OnInit } from '@angular/core';
import { Skret} from '../../classes/skret';
import { AppDataService } from '../../services/app-data.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SkretMsgService } from '../../services/skret-msg.service';


@Component({
  selector: 'app-skret-list',
  templateUrl: './skret-list.component.html',
  styleUrls: ['./skret-list.component.css']
})
export class SkretListComponent implements OnInit{

  constructor(
    private appDataService: AppDataService,
    private http: HttpClient,
    private skretMsgService : SkretMsgService
  ) {}

  skreti!: Skret[];
  closestSkreti!: Skret[];
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
    this.appDataService.getToilets().subscribe((data: any) => {
      this.skreti = data; 
      this.skreti.forEach(skret => {
         skret.avgRating = Math.floor(Math.random() * 5) + 1;
         skret.numRatings = Math.floor(Math.random() * 100) + 1;
        });
      this.closestSkreti = this.skreti;      
      this.getLocation();
    });

  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          this.computeDistances(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not available.");
    }
  }

  computeDistances(lat1 : number, lon1 : number){
    var distances = [];
  //calculate distance between current location and each skret and pick the closest 10
  //get the length of this.skreti
    var len = this.skreti.length;
    for (var i = 0; i <  len; i++ ){
      var lat2 = this.skreti[i].lat;
      var lon2 = this.skreti[i].lon;
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      d = Math.round(d * 100) / 100;
      distances.push(d);
      this.skreti[i].distance = d;
    }

    var closest = [];
    for (let i = 0; i < 10; i++){
      var min = Math.min(...distances);
      var index = distances.indexOf(min);
      closest.push(this.skreti[index]);
      distances[index] = Number.MAX_VALUE;
    }
    this.closestSkreti = closest;

  }

  

  navigateToGoogleMaps(destinationLat: Number,destinationLng: Number): void {
    // Google Maps URL with the destination's latitude and longitude
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=walking`;

    // Open the URL in a new tab/window
    window.open(googleMapsUrl, '_blank');
  }

  selectSkret(skret: Skret): void {
    this.skretMsgService.changeMarkerPosition(skret.lat, skret.lon, skret.avgRating, skret.numRatings);
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }
}
