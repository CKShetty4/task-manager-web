import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import {ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-edit-list',
  imports: [],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss'
})
export class EditListComponent {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  listId!: string;
    ngOnInit() {
      this.route.params.subscribe(
        (params: Params) => {
          this.listId = params['listId'];
          console.log(params['listId']);
        }
      )
    }
  
    navigateToHome() {
      this.router.navigate(['/lists']); 
    }
  
    updateList(title: string) {
      this.taskService.updateList(this.listId, title).subscribe(() => {
        this.router.navigate(['/lists', this.listId]);
      })
    }
}
