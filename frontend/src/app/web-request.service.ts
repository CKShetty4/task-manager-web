import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.ROOT_URL;
  }

  get(uri: string, options?: { headers?: HttpHeaders }) {
    return this.http.get(`${this.ROOT_URL}/${uri}`, options); 
  }

  post(uri: string, payload: Object, options?: { headers?: HttpHeaders }) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, options);
  }

  patch(uri: string, payload: Object, options?: { headers?: HttpHeaders }) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload, options);
  }

  delete(uri: string, options?: { headers?: HttpHeaders }) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`, options);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }

  signup(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }
}