import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppDataService } from '../../services/app-data.service';
import { SkretMsgService } from '../../services/skret-msg.service';


@Component({
  selector: 'app-maps',
  templateUrl: "./maps.component.html",
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {
  constructor(private http: HttpClient,
    private appService: AppDataService,
    private skretMsgService : SkretMsgService
  ) { }
  
  private mapp!: L.Map;
  private icon1!: L.Icon;
  private icon2!: L.Icon;
  coordinates: string = '';
  markers: any[] = []; 

  ngOnInit() {
    this.initMap();
    this.showSkreti();
    this.getLocation();
  }
  
  private initMap(): void {
    var map = L.map('map').setView([46.0569, 14.5058], 13);
    let customIcon1 = L.icon({
      iconUrl: '../../../../assets/markers/toilet-iconGold.png',
      iconSize: [64, 64], // size of the icon
    });
    this.icon1 = customIcon1;

    let customIcon2 = L.icon({
      iconUrl: '../../../../assets/markers/toilet-iconGreen.png',
      iconSize: [64, 64], // size of the icon
    });
    this.icon2 = customIcon2;

    this.mapp = map;
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
  
  }

  private showSkreti(): void {
    this.appService.getToilets().subscribe((data: any) => {
      for (let d of data) {
        if (d.lat == 0 && d.lon == 0) {
          continue;
        }
        if (!d.tags.fee || d.tags.fee != 'no') {
          const marker = L.marker([d.lat, d.lon], {icon: this.icon1}).addTo(this.mapp)
          marker.on('click', () => {
            this.onMarkerClick(marker); // Call onMarkerClick when marker is clicked
          });
        } else {
          const marker = L.marker([d.lat, d.lon], {icon: this.icon2}).addTo(this.mapp)
          marker.on('click', () => {
            this.onMarkerClick(marker);
          });
        }
      }
      this.mapp.setView([46.0569, 14.5058], 13);
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.coordinates = `Latitude: ${latitude}, Longitude: ${longitude}`;
          this.mapp.setView([latitude, longitude], 15);
          L.marker([latitude, longitude], {icon: L.icon({
            iconUrl: '../../../../assets/markers/strick.png',
            iconSize: [32, 64], // size of the icon
          })},).addTo(this.mapp);

          // You can now use latitude and longitude in your application
          // For example, display them on a map or send to a server
        },
        (error) => {
          console.error("Error getting location:", error.message);
          this.coordinates = 'Error getting location.';
        }
      );
    } else {
      console.log("Geolocation is not available.");
      this.coordinates = 'Geolocation is not available.';
    }
  }

  onMarkerClick(marker: any) {
    // Get marker's latitude and longitude
    const lat = marker.getLatLng().lat;
    const lng = marker.getLatLng().lng;
    var position = {lat: lat, lng: lng};
    this.skretMsgService.changeMarkerPosition(position);
  }
}
