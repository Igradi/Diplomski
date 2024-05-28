import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [animate('500ms ease-in-out')]),
]);

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
    ]),
]);

export const fadeOut = trigger('fadeOut', [
    transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-out', style({ opacity: 0 })),
    ]),
]);
