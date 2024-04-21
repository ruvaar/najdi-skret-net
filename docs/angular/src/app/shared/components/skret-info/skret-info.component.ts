import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../../services/app-data.service';
import { Skret } from '../../classes/skret';
import { SkretMsgService } from '../../services/skret-msg.service';

@Component({
  selector: 'app-skret-info',
 templateUrl: './skret-info.component.html',
  styleUrls: ['./skret-info.component.css']
})
export class SkretInfoComponent implements OnInit{
  
  constructor(
    private appDataService: AppDataService,
    private skretMsgService : SkretMsgService
  ) { }

  isShown = false;
  skret! : Skret;

  ngOnInit(): void {
    this.skretMsgService.currentMarkerPosition.subscribe(position => {
      this.turnVisibilityOn(position.lat, position.lng, position.avgRating, position.numRatings);
    });
  }

  turnVisibilityOn(lat: number, lng: number, avgRating: number, totalRatings: number) {
    this.appDataService.getToilets().subscribe((data: any) => {
      for (let d of data) {
        if (d.lat == lat && d.lon == lng) {
          this.skret = d;
          this.isShown = true;
          this.skret.avgRating = avgRating;
          this.skret.numRatings = totalRatings;
        }
      }
    });
  }

  toggle(){
    this.isShown = !this.isShown;
  }
  
  navigateToGoogleMaps(destinationLat: Number,destinationLng: Number): void {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=walking`;
    window.open(googleMapsUrl, '_blank');
  }
}
