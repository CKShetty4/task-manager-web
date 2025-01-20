import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { AuthService } from './auth.service'; // Import AuthService
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService, private authService: AuthService) { }

  createList(title: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const userId = this.authService.getUserId(); // Get the user ID
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    console.log("Creating list with title:", title);
    console.log("User  ID:", userId);
    console.log("Access Token:", accessToken);
    // Include the userId in the request body
    return this.webReqService.post('lists', { title, _userId: userId }, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error creating list:", error);
        return throwError(error); // Propagate the error
      })
    );
  }
  getLists() {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });

    return this.webReqService.get('lists', { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.authService.getNewAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.get('lists', { headers: newHeaders });
            }),
            catchError((err) => {
              console.log("Error refreshing token:", err);
              this.authService.logout(); // Log the user out if refresh fails
              return throwError(err); // Propagate the error
            })
          );
        }
        return throwError(error); // Propagate other errors
      })
    );
  }

  getTasks(listId: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.get(`lists/${listId}/tasks`, { headers: headers });
  }

  createTask(title: string, listId: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.post(`lists/${listId}/tasks`, { title }, { headers: headers });
  }

  complete(task: any) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    },{ headers: headers });
  }
}