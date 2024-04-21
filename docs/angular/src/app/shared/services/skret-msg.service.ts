import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkretMsgService {

  constructor() { }

  private markerPositionSource = new BehaviorSubject<{lat: number, lng: number}>({lat: 0, lng: 0});
  currentMarkerPosition = this.markerPositionSource.asObservable();

  changeMarkerPosition(position: {lat: number, lng: number}) {
    this.markerPositionSource.next(position);
  }
}
