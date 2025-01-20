import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import {ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-edit-task',
  imports: [],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  listId!: string;
  taskId!: string;

    ngOnInit() {
      this.route.params.subscribe(
        (params: Params) => {
          this.listId = params['listId'];
          this.taskId = params['taskId'];

          console.log(params['listId']);
        }
      )
    }
  
    navigateToHome() {
      this.router.navigate(['/lists']); 
    }
  
    updateTask(title: string) {
      this.taskService.updateTask(this.listId, this.taskId, title).subscribe(() => {
        this.router.navigate(['/lists', this.listId]);
      })
    }
}
