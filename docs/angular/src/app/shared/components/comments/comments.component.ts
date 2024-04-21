import { Component, OnInit } from '@angular/core';
import { Comment } from '../../classes/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ["comments.component.css"]
})
export class CommentsComponent implements OnInit {
newComment: any;
addComment() {
throw new Error('Method not implemented.');
}
  constructor(){}
  
  comments!: Comment[];
  
  ngOnInit(): void {
    //mock comment data
    this.comments = [
      {
        _id: "1",
        username: "bazo jeffrey",
        comment: "This toilet is absolutely amazing if you want to watch a live show of homeless people injecting themselves with drugs! Great experience!",
        createdOn: "2024-01-01",
        rating: 1,
        imgSrc:"https://ass.si/f/jx2i5.jpg"
      },
      {
        _id: "2",
        username: "yilong ma",
        comment: "Bruh the mf toilet broken :glad:",
        createdOn: "2024-01-02",
        rating: 2,
        imgSrc:"https://ass.si/f/w-wnw.jpg"
      }
    ];
  }
}
