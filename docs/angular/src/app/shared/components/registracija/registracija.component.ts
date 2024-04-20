import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../classes/user";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppDataService } from "../../services/app-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import * as Awesomplete from "awesomplete";
import { HistoryService } from "../../services/history.service";

@Component({
  selector: "app-registracija",
  templateUrl: "./registracija.component.html",
  styles: [],
})
export class RegistracijaComponent implements OnInit {
  constructor(
    private historyService: HistoryService,
    private appDataService: AppDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  protected formError!: string;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  protected formData: any = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  };

  protected credentials: User = {
    username: "",
    email: "",
    password: "",
  };

  public header = {
    title: "Ustvari nov račun",
    subtitle: "",
    sidebar: "",
  };
  awesomepleteInstance!: Awesomplete;

  ngOnInit(): void {
    this.initializeAwesomplete();
  }
  public onRegisterSubmit() {
    this.formError = "";
    if (
      !this.formData.username ||
      !this.formData.email ||
      !this.formData.password1 ||
      !this.formData.password2
    ) {
      this.formError = "Vsa polja so obvezna, prosimo poskusite znova.";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.formData.email)
    ) {
      this.formError = "Prosimo vnesite veljaven e-poštni naslov.";
    } else if (this.formData.password1.length < 8) {
      this.formError = "Geslo mora biti dolgo vsaj 8 znakov.";
    } else if (this.formData.password2 !== this.formData.password1) {
      this.formError = "Gesli se ne ujemata.";
    } else {
      this.doRegister();
    }
  }

  private doRegister() {
    this.credentials.username = this.formData.username;
    this.credentials.email = this.formData.email;
    this.credentials.password = this.formData.password1;

    this.authenticationService
      .register(this.credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      });
  }

  protected formDataError!: string;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
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
