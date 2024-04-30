import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: 'user-profile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    }
];
