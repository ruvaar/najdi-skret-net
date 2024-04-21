import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "../modules/app-routing/app-routing.module";
import { FormsModule } from "@angular/forms";
import { FrameworkComponent } from "./components/framework/framework.component";
import { HttpClientModule } from "@angular/common/http";
import { HomepageComponent } from "./components/homepage/homepage.component";
import { DatePipe } from "./pipes/date.pipe";
import { PrijavaComponent } from "./components/prijava/prijava.component";
import { RegistracijaComponent } from "./components/registracija/registracija.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MapsComponent } from './components/maps/maps.component';
import { SkretListComponent } from './components/skret-list/skret-list.component';
import { ShitGameComponent } from './components/shit-game/shit-game.component';
import { SkretInfoComponent } from './components/skret-info/skret-info.component';
import { CommentsComponent } from './components/comments/comments.component';

@NgModule({
  declarations: [
    FrameworkComponent,
    HomepageComponent,
    DatePipe,
    PrijavaComponent,
    RegistracijaComponent,
    SkretListComponent,
    MapsComponent,
    ShitGameComponent,
    SkretInfoComponent,
    CommentsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatInputModule
  ],

  providers: [],
  bootstrap: [FrameworkComponent],
})
export class AppModule {}
