import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-task-view',
  imports: [],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  
  constructor(private taskService: TaskService) { }

  ngOnInit() {
  }

  createNewList() {
    this.taskService.createList('New List').subscribe((response:any)=>{
      console.log(response);
    }
      );
  }

}