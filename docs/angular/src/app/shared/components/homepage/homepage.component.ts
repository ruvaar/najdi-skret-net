import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryService } from '../../services/history.service';
@Component({
  selector: 'app-homepage',
  templateUrl: "./homepage.component.html",
  styles: [
  ]
})
export class HomepageComponent implements OnInit {
  constructor(
    private historyService: HistoryService,
    private modalService: NgbModal,
    ) {}
  
  ngOnInit(): void {}

}