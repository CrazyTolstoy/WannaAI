import { Component, ElementRef, Renderer2  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'globus';
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setupToggleSidebar();
  }

  private setupToggleSidebar() {
    const toggleSidebarBtn = this.el.nativeElement.querySelector('.toggle-sidebar-btn');

    if (toggleSidebarBtn) {
      this.renderer.listen(toggleSidebarBtn, 'click', () => {
        const body = this.el.nativeElement.querySelector('body');
        this.renderer.addClass(body, 'toggle-sidebar');
      });
    }
  }
}
