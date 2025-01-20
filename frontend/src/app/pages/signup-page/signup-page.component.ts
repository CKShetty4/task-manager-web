import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-signup-page',
  imports: [],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
 constructor(private authService: AuthService, private router: Router) { }
 ngOnInit() {
}
onSignupButtonClicked(email: string, password: string) {
  this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
    if (res.status === 200) {
      // we have logged in successfully
      this.router.navigate(['/lists']);
    }
    console.log(res);
    
  });
}
onLoginClicked() {
  this.router.navigate(['/login']);
}
}
