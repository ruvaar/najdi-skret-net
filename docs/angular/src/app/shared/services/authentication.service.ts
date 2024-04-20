import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { AppDataService } from "./app-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private appDataService: AppDataService
  ) {}
  public login(user: User): Observable<AuthResponse> {
    return this.appDataService.login(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public register(user: User): Observable<AuthResponse> {
    return this.appDataService.register(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public logout(): void {
    this.storage.removeItem("demo-token");
  }
  public getToken(): string | null {
    return this.storage.getItem("demo-token");
  }
  public saveToken(token: string): void {
    this.storage.setItem("demo-token", token);
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } else return false;
  }

  public isAdmin(): boolean {
    const token: string | null = this.getToken();
    if (this.isLoggedIn() && token) {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.admin;
    } else return false;
  }

  public getCurrentUser(): User | null {
    let user!: User;
    if (this.isLoggedIn()) {
      let token: string | null = this.getToken();
      if (token) {
        let { email, username } = JSON.parse(
          window.atob(token.split(".")[1])
        );
        user = { email, username };
      }
    }
    return user;
  }

  public getCurrentUserId(): string | null {
    let id!: string;
    if (this.isLoggedIn()) {
      let token: string | null = this.getToken();
      if (token) {
        let { _id } = JSON.parse(
          window.atob(token.split(".")[1])
        );
        id = _id;
      }
    }
    return id; 
  } 

}
