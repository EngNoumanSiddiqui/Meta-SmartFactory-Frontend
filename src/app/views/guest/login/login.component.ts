import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth-service';
import {LoaderService} from '../../../services/shared/loader.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {PreviousRouteService} from '../../../services/shared/previous-page.service';
 
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';
import {UsersService} from '../../../services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  guest = {username: '', password: ''};
  returnUrl = '/';

  constructor(private _router: Router,
              private previousRouteService: PreviousRouteService,
              private _auth: AuthService,
              private route: ActivatedRoute,
              private loader: LoaderService,
              private utilities: UtilitiesService,
              private _userSrvc: UsersService,
              private _employeeSvc: EmployeeService) {
    this._auth.logout();

    // this._translateSvc.use('en');
  }


  ngOnInit() {
    const x = Date.now();
    localStorage.setItem('b-scheduler-trial-start', '' + x);
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    this.loader.showLoader();
    this._auth.authenticate(this.guest.username, this.guest.password)
      .then(result => {

        this._employeeSvc.getProfileDetail().then(employee => {
            if (employee['plant']) {
              this._userSrvc.setPlant(employee['plant']);
            }
            let previous = this.previousRouteService.getPreviousUrl();
            if (!previous || previous.indexOf('login') > 0) {
              previous = this.returnUrl;
            }
            this._router.navigate([previous]);
          }).catch(error => {
            this.utilities.showErrorToast(error)
          });

        this.loader.hideLoader();
        this.utilities.showSuccessToast('success');
       
      })
      .catch(error => {
        this.loader.hideLoader();
        this.utilities.showErrorToast(error)
      })
  }

  goPage(page) {
    this._router.navigate([page]);
  }


}
