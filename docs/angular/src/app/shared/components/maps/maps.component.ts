import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


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
  constructor(private http: HttpClient) { }
  

  ngOnInit() {
    this.initMap();
  }
  
  private initMap(): void {
    var map = L.map('map').setView([46.0569, 14.5058], 13);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    L.marker([46.0569, 14.5058]).addTo(map)
      .bindPopup('Poglej ga no, hot skret v tvoji bljizini!')
      .openPopup();
  }

}
