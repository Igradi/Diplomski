import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsAndPollsComponent } from './posts-and-polls.component';

describe('PostsAndPollsComponent', () => {
  let component: PostsAndPollsComponent;
  let fixture: ComponentFixture<PostsAndPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsAndPollsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsAndPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
