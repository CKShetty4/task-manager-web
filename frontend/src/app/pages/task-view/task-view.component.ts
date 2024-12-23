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

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.currentListId = params['listId'] || null; // Set currentListId based on route params
      if (this.currentListId) {
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
}