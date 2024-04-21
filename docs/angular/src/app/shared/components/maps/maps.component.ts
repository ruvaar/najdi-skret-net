import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppDataService } from '../../services/app-data.service';


@Component({
  selector: 'app-maps',
  templateUrl: "./maps.component.html",
  styles: [ `
  #map{
    width: 100%;
    height: 100vh;
  }
`
  ]
})

export class MapsComponent implements OnInit {
  constructor(private http: HttpClient,
    private appService: AppDataService
  ) { }
  
  private mapp!: L.Map;
  private icon!: L.Icon;
  coordinates: string = '';
  markers: any[] = []; 

  ngOnInit() {
    this.initMap();
    this.showSkreti();
    this.getLocation();
  }
  
  private initMap(): void {
    var map = L.map('map').setView([46.0569, 14.5058], 13);
    let customIcon = L.icon({
      iconUrl: '../../../../assets/markers/toilet-icon.png',
      iconSize: [64, 64], // size of the icon
    });
    this.icon = customIcon;

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
        const marker = L.marker([d.lat, d.lon], {icon: this.icon}).addTo(this.mapp)
          .bindPopup(d.lat + " " + d.lon)
          .openPopup();
        marker.on('click', () => {
            this.onMarkerClick(marker); // Call onMarkerClick when marker is clicked
          });
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
          })}).addTo(this.mapp);

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
    
    console.log('Marker clicked - Latitude:', lat, 'Longitude:', lng);
    
    // You can now use this information as needed
    // For example, open a popup or navigate to a detail page
  }

}
