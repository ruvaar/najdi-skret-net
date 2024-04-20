import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../../classes/user";
import { AuthenticationService } from "../../services/authentication.service";
import { HistoryService } from "../../services/history.service";
import * as Awesomplete from "awesomplete";

@Component({
  selector: "app-prijava",
  templateUrl: "./prijava.component.html",
  styles: [],
})
export class PrijavaComponent implements OnInit {
  constructor(
    private historyService: HistoryService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  formData: any = {
    email: "",
    password: "",
  };
  showPassword: boolean = false;
  protected formError!: string;
  protected credentials: User = {
    username: "",
    email: "",
    password: "",
  };
  public header = {
    title: "Sign in",
    subtitle: "",
    sidebar: "",
  };
  awesomepleteInstance!: Awesomplete;

  ngOnInit(): void {
    this.initializeAwesomplete();
  }

  public onLoginSubmit(): void {
    this.formError = "";
    if (!this.formData.email || !this.formData.password) {
      this.formError = "Vsa polja so obvezna, prosimo poskusite znova.";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.formData.email)
    ) {
      this.formError = "Prosimo vnesite veljaven e-poštni naslov.";
    } else if (this.formData.password.length < 8) {
      this.formError = "Geslo mora biti dolgo vsaj 8 znakov.";
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    this.credentials.email = this.formData.email;
    this.credentials.password = this.formData.password;

    this.authenticationService
      .login(this.credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.formError = "";
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  initializeAwesomplete() {
    setTimeout(() => {
      this.awesomepleteInstance = new Awesomplete('input[type="email"]', {
        list: [
          "facebook.com",
          "gmail.com",
          "googlemail.com",
          "google.com",
          "hotmail.com",
          "hotmail.co.uk",
          "mac.com",
          "mail.com",
          "yahoo.com",
          "yahoo.co.uk",
          "windowslive.com",
          "icloud.com",
          "student.uni-lj.si",
          "outlook.com",
        ],
        data: function (text: string, input: string) {
          return input.slice(0, input.indexOf("@")) + "@" + text;
        },
        filter: Awesomplete.FILTER_STARTSWITH,
      });
    }, 200);
    setTimeout(() => {
      let emailInput: HTMLInputElement = document.querySelector(
        '[type="email"]'
      ) as HTMLInputElement;
      emailInput?.addEventListener("awesomplete-selectcomplete", (e) => {
        const input = e.target as HTMLInputElement;
        this.formData.email = input.value;
      });
    }, 200);
  }
}
