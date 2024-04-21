import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkretMsgService {

  constructor() { }

  private markerPositionSource = new BehaviorSubject<{lat: number, lng: number, avgRating : number, numRatings : number}>({lat: 0, lng: 0, avgRating: 0, numRatings: 0});
  currentMarkerPosition = this.markerPositionSource.asObservable();

  changeMarkerPosition(lat: number, lng: number, avgRating?: number, numRatings?: number) {
    //generate random rating and number of ratings if not provided
    if (!avgRating) avgRating = Math.floor(Math.random() * 5) + 1;
    if (!numRatings) numRatings = Math.floor(Math.random() * 100) + 1;

    this.markerPositionSource.next({lat, lng, avgRating, numRatings});
  }
}
