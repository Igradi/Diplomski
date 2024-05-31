import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { CryptocurrencyListComponent } from './components/cryptocurrency-list/cryptocurrency-list.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { CreatePollComponent } from './components/create-poll/create-poll.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';
import { GuestHomeComponent } from './components/guest-home/guest-home.component';
import { AddCryptocurrencyComponent } from './components/add-cryptocurrency/add-cryptocurrency.component';
import { ManagePollsComponent } from './components/manage-polls/manage-polls.component';
import { PollAnalyticsComponent } from './components/poll-analytics/poll-analytics.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PollListComponent } from './components/poll-list/poll-list.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'cryptocurrency-list', component: CryptocurrencyListComponent, canActivate: [AuthGuard] },
    { path: 'posts/:cryptoName', component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'polls/:cryptoName', component: PollListComponent, canActivate: [AuthGuard] },
    { path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard] },
    { path: 'admin-dashboard/create-poll', component: CreatePollComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'edit-comment/:id', component: EditCommentComponent, canActivate: [AuthGuard] },
    { path: 'welcome', component: GuestHomeComponent },
    { path: 'admin-dashboard/add-cryptocurrency', component: AddCryptocurrencyComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'admin-dashboard/manage-polls', component: ManagePollsComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'poll-analytics/:id', component: PollAnalyticsComponent, canActivate: [AuthGuard] },
    { path: 'post-details/:id', component: PostDetailsComponent, canActivate: [AuthGuard] },
];
