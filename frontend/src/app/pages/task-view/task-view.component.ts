import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  imports: [CommonModule]
})
export class TaskViewComponent implements OnInit {

  lists: any[] = [];
  tasks: any[] = [];
  currentListId: string | null = null; // Track the current list ID
  selectedListId: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.currentListId = params['listId'] || null; // Set currentListId based on route params
      if (this.currentListId) {
        this.selectedListId = this.currentListId;
        this.taskService.getTasks(this.currentListId).subscribe(
          (tasks: any) => {
            this.tasks = tasks;
          },
          (error) => {
            console.error('Error fetching tasks:', error);
          }
        );
      } else {
        this.tasks = []; // Reset tasks if no listId
      }
    });

    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  navigateToList(listId: string) {
    this.selectedListId = listId;
    this.router.navigate(['/lists', listId]);
  }

  navigateToTask(listId: string) {
    this.router.navigate(['/lists', listId, 'new-task']);
  }

  navigateToNewList() {
    this.router.navigate(['/new-list']);
  }

  onTaskClick(task: any) {
    this.taskService.complete(task).subscribe(() => {
      console.log("Updated successfully!");
      task.completed = !task.completed;
    });
  }

  isActive(listId: string): boolean {
    return this.router.url.includes(listId);
  }
  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

  onEditListClick() {
    this.router.navigate(['/edit-list', this.selectedListId]);
  }

  onEditTaskClick(taskId: string) {
    this.router.navigate(['/lists', this.selectedListId, 'edit-task', taskId]);
}

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log("Task deleted successfully:", res);
    },
    (error) => {
      console.error("Error deleting task:", error);
    })
  }
}