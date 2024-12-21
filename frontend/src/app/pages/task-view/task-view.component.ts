import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  imports: [CommonModule] // Import CommonModule here
})
export class TaskViewComponent implements OnInit {

  lists: any[] = [];
  tasks: any[] = [];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const listId = params['listId'];
        // console.log('List ID:', listId); // Log the listId to check its value
        if (listId) {
          this.taskService.getTasks(listId).subscribe(
            (tasks: any) => {
              this.tasks = tasks;
            },
            (error) => {
              console.error('Error fetching tasks:', error);
            }
          );
        } else {
          // console.error('No listId provided');
        }
      }
    );
  
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  navigateToList(listId: string) {
    this.router.navigate(['/lists', listId]);
  }
  navigateToTask(listId: string) {
    this.router.navigate(['/lists', listId, 'new-task']);
  }

  navigateToNewList() {
    this.router.navigate(['/new-list']); // Navigate to the new list page
  }

  onTaskClick(task: any) {
    // we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed successully!");
      task.completed = !task.completed;
    })
  }

  isActive(listId: string): boolean {
    // Check if the current route matches the listId
    return this.router.url.includes(listId);
  }
}