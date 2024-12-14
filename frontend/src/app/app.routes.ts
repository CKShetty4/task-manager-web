import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';

export const routes: Routes = [
    {path: '', component:TaskViewComponent},
    {path:'new-list',component:NewListComponent}
];
