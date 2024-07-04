import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtDecodeService } from './jwt-decode.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard {

    constructor(
        private authService: AuthService,
        private jwtDecodeService: JwtDecodeService,
        private router: Router
    ) { }

    canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = this.jwtDecodeService.decodeToken(token);
            if (decodedToken && decodedToken.role === 'admin') {
                return true;
            }
        }

        this.router.navigate(['/home']);
        return false;
    }
}
