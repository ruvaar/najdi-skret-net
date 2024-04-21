import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../classes/user";
import { AuthenticationService } from "../../services/authentication.service";
import { HistoryService } from "../../services/history.service";

@Component({
  selector: "app-framework",
  templateUrl: "framework.component.html",
  styles: [
   ".logo { height: 75px; width:75px; margin: -10px 10px -10px -20px; }",
  ],
})
export class FrameworkComponent {
  constructor(
    private historyService: HistoryService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  getHomeFontType(): string {
    return this.router.url === "/" ? "bold" : "normal";
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl(this.historyService.getPreviousUrl())
  }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
  public getCurrentUserId() {
    return this.authenticationService.getCurrentUserId();
  } 

  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.username : "Guest";
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  showDonationInfo: boolean = false;
  toggleDonationInfo() {
    this.showDonationInfo = !this.showDonationInfo;
  }
  showVolunteerInfo: boolean = false;
  toggleVolunteerInfo() {
    this.showVolunteerInfo = !this.showVolunteerInfo;
  }
}
