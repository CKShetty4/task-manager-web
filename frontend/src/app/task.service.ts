import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, tap, map, Observable, throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private refreshingAccessToken: boolean = false;
  private accessTokenRefreshed: Subject<void> = new Subject();

  constructor(private webReqService: WebRequestService, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = this.authService.getAccessToken();
    return new HttpHeaders({
      'x-access-token': accessToken || '',
      '_userId': this.authService.getUserId() || ''
    });
  }

  private handleError<T>(operation: string, requestFn: () => Observable<T>): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse) => {
      if (error.status === 401) {
        return this.refreshAccessToken().pipe(
          switchMap(() => requestFn()),
          catchError(err => {
            console.error(`${operation} failed after refreshing token:`, err);
            this.authService.logout();
            return throwError(err);
          })
        );
      }
      console.error(`${operation} failed:`, error);
      return throwError(error);
    };
  }

  private refreshAccessToken(): Observable<void> {
    if (this.refreshingAccessToken) {
        return new Observable(observer => {
            this.accessTokenRefreshed.subscribe(() => {
                observer.next();
                observer.complete();
            });
        });
    } else {
        this.refreshingAccessToken = true;
        return this.authService.getNewAccessToken().pipe(
            tap(() => {
                console.log("Access Token Refreshed!");
                this.refreshingAccessToken = false;
                this.accessTokenRefreshed.next();
            }),
            map(() => void 0), // Transform the emitted value to void
            catchError(err => {
                console.log("Failed to refresh access token:", err);
                this.refreshingAccessToken = false;
                this.authService.logout();
                return throwError(err);
            })
        );
    }
}

  createList(title: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.post('lists', { title }, { headers }).pipe(
      catchError(this.handleError('createList', () => this.createList(title)))
    );
  }

  getLists(): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.get('lists', { headers }).pipe(
      catchError(this.handleError('getLists', () => this.getLists()))
    );
  }

  getTasks(listId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.get(`lists/${listId}/tasks`, { headers }).pipe(
      catchError(this.handleError('getTasks', () => this.getTasks(listId)))
    );
  }

  createTask(title: string, listId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.post(`lists/${listId}/tasks`, { title }, { headers }).pipe(
      catchError(this.handleError('createTask', () => this.createTask(title, listId)))
    );
  }

  complete(task: any): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, { completed: !task.completed }, { headers }).pipe(
      catchError(this.handleError('complete', () => this.complete(task)))
    );
  }

  deleteList(id: string): Observable<any> {
    const headers = this.getHeaders(); // Get headers with the access token
    return this.webReqService.delete(`lists/${id}`, { headers }).pipe(
        catchError(this.handleError('deleteList', () => this.deleteList(id))) // Handle errors
    );
}

  deleteTask(listId: string, taskId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`, { headers }).pipe(
      catchError(this.handleError('deleteTask', () => this.deleteTask(listId, taskId)))
    );
  }

  updateList(id: string, title: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.patch(`lists/${id}`, { title }, { headers }).pipe(
      catchError(this.handleError('updateList', () => this.updateList(id, title)))
    );
  }

  updateTask(listId: string, taskId: string, title: string): Observable<any> {
    const headers = this.getHeaders();
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title }, { headers }).pipe(
      catchError(this.handleError('updateTask', () => this.updateTask(listId, taskId, title)))
    );
  }
}