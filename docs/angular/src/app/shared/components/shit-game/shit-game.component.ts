import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var Elm: any; 
@Component({
  selector: 'app-shit-game',
  templateUrl: "./shit-game.component.html",
  styleUrls:['shit-game.component.css']
})
export class ShitGameComponent implements OnInit {

  ngOnInit(): void {
    // Mount Elm application to the container element
    const app = Elm.Main.init({
      node: document.getElementById('elm-container')
    });
  }


}