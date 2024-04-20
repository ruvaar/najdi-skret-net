import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "../../shared/components/homepage/homepage.component";
import { PrijavaComponent } from "../../shared/components/prijava/prijava.component";
import { RegistracijaComponent } from "../../shared/components/registracija/registracija.component";

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "prijava", component: PrijavaComponent },
  { path: "registracija", component: RegistracijaComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
