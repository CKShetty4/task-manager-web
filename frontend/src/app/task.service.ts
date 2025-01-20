import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { AuthService } from './auth.service'; // Import AuthService
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap,  tap, map } from 'rxjs/operators';
import { throwError,Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService, private authService: AuthService) { }

  private refreshingAccessToken: boolean = false;
  private accessTokenRefreshed: Subject<void> = new Subject();

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
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.get('lists', { headers: newHeaders }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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

  refreshAccessToken(): Observable<void> {
    if (this.refreshingAccessToken) {
      return new Observable((observer) => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        map(() => void 0),
        tap(() => {
          console.log("Access Token Refreshed!");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next(); // Notify that the token has been refreshed
        }),
        catchError((err) => {
          console.log("Failed to refresh access token:", err);
          this.refreshingAccessToken = false; // Reset the flag
          this.authService.logout(); // Log the user out if refresh fails
          return throwError(err); // Propagate the error
        })
      );
    }
  }

  getTasks(listId: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.get(`lists/${listId}/tasks`, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.get(`lists/${listId}/tasks`, { headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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

  createTask(title: string, listId: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.post(`lists/${listId}/tasks`, { title }, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.post(`lists/${listId}/tasks`, { title }, { headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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

  complete(task: any) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    }, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
                completed: !task.completed
              }, { headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.patch(`lists/${id}`, { title },{ headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.patch(`lists/${id}`, { title },{ headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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
  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return  this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title },{ headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return  this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title },{ headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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
  deleteTask(listId: string, taskId: string) {
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
      'x-access-token': accessToken || '' // Set the access token in the headers
    });
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`,{ headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 error, attempt to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newAccessToken = this.authService.getAccessToken();
              const newHeaders = new HttpHeaders({
                'x-access-token': newAccessToken || ''
              });
              return this.webReqService.delete(`lists/${listId}/tasks/${taskId}` ,{ headers: headers }).pipe(
                catchError((err) => {
                  console.log("Error retrying request after token refresh:", err);
                  this.authService.logout(); // Log the user out if refresh fails
                  return throwError(err); // Propagate the error
                })
              );
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

  deleteList(id: string) {
    console.log("Attempting to delete list with ID:", id); // Log the ID
    const accessToken = this.authService.getAccessToken(); // Get the access token
    const headers = new HttpHeaders({
        'x-access-token': accessToken || '', // Set the access token in the headers
        '_userId': this.authService.getUserId() || ''
    });

    const url = `lists/${id}`;
    console.log("Full URL:", url); // Log the full URL
    console.log("Headers being sent:", headers); // Log the headers

    return this.webReqService.delete(url, { headers: headers }).pipe(
        tap(response => {
            console.log("Delete response:", response); // Log the response
        }),
        catchError((error: HttpErrorResponse) => {
            console.error("Error deleting list:", error);
            if (error.status === 401) {
                // 401 error, attempt to refresh the access token
                return this.refreshAccessToken().pipe(
                    switchMap(() => {
                        const newAccessToken = this.authService.getAccessToken();
                        const newHeaders = new HttpHeaders({
                            'x-access-token': newAccessToken || '',
                            '_userId': this.authService.getUserId() || ''
                        });
                        return this.webReqService.delete(url, { headers: newHeaders }).pipe(
                            catchError((err) => {
                                console.log("Error retrying request after token refresh:", err);
                                this.authService.logout(); // Log the user out if refresh fails
                                return throwError(err); // Propagate the error
                            })
                        );
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
}