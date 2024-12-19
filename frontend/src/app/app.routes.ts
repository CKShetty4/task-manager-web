import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: 'new-list', component: NewListComponent },
    { path: 'lists', component: TaskViewComponent }, // Route for lists without parameters
    { path: 'lists/:listId', component: TaskViewComponent } // Route for lists with parameters
];