import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { CryptocurrencyListComponent } from './components/cryptocurrency-list/cryptocurrency-list.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

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
    },
    {
        path: 'cryptocurrency-list',
        component: CryptocurrencyListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'home/:cryptoName-posts',
        component: PostListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit-post/:id',
        component: EditPostComponent,
        canActivate: [AuthGuard]
    }
];
