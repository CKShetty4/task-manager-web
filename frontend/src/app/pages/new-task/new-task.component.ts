import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-new-task',
  imports: [],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {
  listId: string='';
constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

ngOnInit() {
  this.route.params.subscribe(
    (params: Params) => {
      this.listId = params['listId'];
    }
  )
}

  navigateToHome() {
    this.router.navigate(['/lists']); 
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.listId).subscribe((response:any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }
}
