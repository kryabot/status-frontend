import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PingResponse} from "../models/PingResponse";
import {StartupResponse} from "../models/StartupResponse";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  baseUrl: string = 'https://api2.krya.dev/public/status'

  constructor(private http: HttpClient) { }

  protected getHeader(auth?: boolean): HttpHeaders {
    let head = new HttpHeaders();
    head.set('Content-Type', 'application/json');
    head.set('Accept', 'application/json');
    return head;
  }

  getPingStatus(): Observable<PingResponse>{
    return this.http.get<PingResponse>(`${this.baseUrl}/ping`, {headers: this.getHeader()})
  }

  getStartupStatus(): Observable<StartupResponse>{
    return this.http.get<StartupResponse>(`${this.baseUrl}/startup`, {headers: this.getHeader()})
  }

}
