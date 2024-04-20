import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Skret } from "../classes/skret";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { environment } from "../../../environments/environment";
import { Comment } from "../classes/comment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private apiUrl = environment.apiUrl;

  public login(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }
  public register(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }
  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams()
      .set("email", user.email)
      .set("username", user.username);
    if (user.password) body = body.set("password", user.password);
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post<AuthResponse>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getToilets(): Observable<Skret[]> {
    const url: string = `${this.apiUrl}/toilets`;
    return this.http
      .get<Skret[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getUsers(): Observable<User[]> {
    const url: string = `${this.apiUrl}/users`;
    return this.http
      .get<User[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getUserById(userId: string | null): Observable<User[]> {
    console.log(userId);
    const url: string = `${this.apiUrl}/users/${userId}`;;
    return this.http
      .get<User[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getUserByMail(mail: string): Observable<any> {
    const url: string = `${this.apiUrl}/users/mail/${mail}`;
    return this.http
      .get<any>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteUsers(): Observable<any> {
    const url: string = `${this.apiUrl}/deleteAllUsers`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  public deleteToilets(): Observable<any> {
    const url: string = `${this.apiUrl}/deleteAllToilets`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  public deleteToilet(id: string): Observable<any> {
    const url: string = `${this.apiUrl}/toilets/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  public expRegister(formData: any): Observable<any> {
    const url: string = `${this.apiUrl}/register`;
    let body = new HttpParams()
      .set("name", formData.name)
      .set("surname", formData.surname)
      .set("email", formData.email)
      .set("password", formData.password);
    let headers = new HttpHeaders().set(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public expLogin(formData: any): Observable<any> {
    const url: string = `${this.apiUrl}/login`;
    let body = new HttpParams()
      .set("email", formData.email)
      .set("password", formData.password);
    let headers = new HttpHeaders().set(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  //Comments
  public getAllComments(): Observable<Comment[]> {
    const url: string = `${this.apiUrl}/comments`;
    return this.http
      .get<Comment[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getSpecificComment(id: number): Observable<Comment[]> {
    const url: string = `${this.apiUrl}/comments/${id}`;
    return this.http
      .get<Comment[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public postComment(comment: Comment): Observable<Comment> {
    const url: string = `${this.apiUrl}/comments`;
    let headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storage.getItem("demo-token")}`
    );

    return this.http
      .post<Comment>(url, comment, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteComments(): Observable<any> {
    const url: string = `${this.apiUrl}/deleteAllComments`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  public deleteComment(id: string): Observable<Comment> {
    let headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storage.getItem("demo-token")}`
    );
    const url: string = `${this.apiUrl}/comments/${id}`;
    return this.http
      .delete<any>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  public updateComment(id: string, content: string): Observable<Comment> {
    let headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storage.getItem("demo-token")}`
    );
    const url: string = `${this.apiUrl}/comments/${id}`;
    let body = new HttpParams().set("comment", content).set("commentid", id);
    return this.http
      .put<any>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}
