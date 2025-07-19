import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideZonelessChangeDetection(), 
        provideRouter([
          { path: 'dashboard', loadComponent: () => import('../product-dashboard/product-dashboard').then(m => m.ProductDashboard) }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of HomeComponent', () => {
      expect(component instanceof HomeComponent).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render the main title', () => {
      const titleElement = debugElement.query(By.css('h1'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe('Welcome to Product Management System');
    });

    it('should render the subtitle', () => {
      const subtitleElement = debugElement.query(By.css('header p'));
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('Manage your products and view analytics from your dashboard');
    });

    it('should render the home container', () => {
      const containerElement = debugElement.query(By.css('.home-container'));
      expect(containerElement).toBeTruthy();
    });

    it('should render the header section', () => {
      const headerElement = debugElement.query(By.css('.header'));
      expect(headerElement).toBeTruthy();
    });

    it('should render the main content section', () => {
      const mainElement = debugElement.query(By.css('.main-content'));
      expect(mainElement).toBeTruthy();
    });

    it('should render the feature grid', () => {
      const featureGridElement = debugElement.query(By.css('.feature-grid'));
      expect(featureGridElement).toBeTruthy();
    });
  });

  describe('Feature Cards', () => {
    it('should render exactly 4 feature cards', () => {
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      expect(featureCards.length).toBe(4);
    });

    it('should render all feature card icons', () => {
      const featureIcons = debugElement.queryAll(By.css('.feature-icon'));
      expect(featureIcons.length).toBe(4);
      expect(featureIcons[0].nativeElement.textContent.trim()).toBe('📊');
      expect(featureIcons[1].nativeElement.textContent.trim()).toBe('📈');
      expect(featureIcons[2].nativeElement.textContent.trim()).toBe('🛍️');
      expect(featureIcons[3].nativeElement.textContent.trim()).toBe('⚙️');
    });

    it('should render all feature card titles', () => {
      const featureTitles = debugElement.queryAll(By.css('.feature-card h3'));
      expect(featureTitles.length).toBe(4);
      expect(featureTitles[0].nativeElement.textContent.trim()).toBe('Product Dashboard');
      expect(featureTitles[1].nativeElement.textContent.trim()).toBe('Analytics');
      expect(featureTitles[2].nativeElement.textContent.trim()).toBe('Orders');
      expect(featureTitles[3].nativeElement.textContent.trim()).toBe('Settings');
    });

    it('should render all feature card descriptions', () => {
      const featureDescriptions = debugElement.queryAll(By.css('.feature-card p'));
      expect(featureDescriptions.length).toBe(4);
      expect(featureDescriptions[0].nativeElement.textContent.trim()).toBe('View your product inventory, sales data, and analytics in one place');
      expect(featureDescriptions[1].nativeElement.textContent.trim()).toBe('Track your sales performance and identify trends');
      expect(featureDescriptions[2].nativeElement.textContent.trim()).toBe('Manage customer orders and track fulfillment');
      expect(featureDescriptions[3].nativeElement.textContent.trim()).toBe('Configure your account and system preferences');
    });
  });

  describe('Navigation Elements', () => {
    it('should render dashboard navigation link', () => {
      const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
      expect(dashboardLink).toBeTruthy();
      expect(dashboardLink.nativeElement.textContent.trim()).toBe('Go to Dashboard');
    });

    it('should have correct routerLink attribute', () => {
      const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
      expect(dashboardLink.nativeElement.getAttribute('routerLink')).toBe('/dashboard');
    });

    it('should have primary button styling for dashboard link', () => {
      const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
      expect(dashboardLink.nativeElement.classList.contains('btn-primary')).toBe(true);
    });

    it('should render "Coming Soon" buttons for other features', () => {
      const comingSoonButtons = debugElement.queryAll(By.css('.btn-secondary'));
      expect(comingSoonButtons.length).toBe(3);
      comingSoonButtons.forEach(button => {
        expect(button.nativeElement.textContent.trim()).toBe('Coming Soon');
      });
    });
  });

  describe('Button Interactions', () => {
    it('should not navigate when clicking "Coming Soon" buttons', () => {
      spyOn(router, 'navigate');
      const comingSoonButtons = debugElement.queryAll(By.css('.btn-secondary'));
      
      comingSoonButtons.forEach(button => {
        button.nativeElement.click();
      });
      
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should have disabled state or no click handler for "Coming Soon" buttons', () => {
      const comingSoonButtons = debugElement.queryAll(By.css('.btn-secondary'));
      comingSoonButtons.forEach(button => {
        const clickSpy = jasmine.createSpy('click');
        button.nativeElement.addEventListener('click', clickSpy);
        button.nativeElement.click();
        expect(clickSpy).toHaveBeenCalled();
      });
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct CSS classes for main sections', () => {
      const homeContainer = debugElement.query(By.css('.home-container'));
      const header = debugElement.query(By.css('.header'));
      const mainContent = debugElement.query(By.css('.main-content'));
      const featureGrid = debugElement.query(By.css('.feature-grid'));

      expect(homeContainer).toBeTruthy();
      expect(header).toBeTruthy();
      expect(mainContent).toBeTruthy();
      expect(featureGrid).toBeTruthy();
    });

    it('should have correct button classes', () => {
      const primaryButton = debugElement.query(By.css('.btn-primary'));
      const secondaryButtons = debugElement.queryAll(By.css('.btn-secondary'));

      expect(primaryButton).toBeTruthy();
      expect(secondaryButtons.length).toBe(3);
    });

    it('should maintain proper DOM structure', () => {
      const homeContainer = debugElement.query(By.css('.home-container'));
      const header = homeContainer.query(By.css('.header'));
      const mainContent = homeContainer.query(By.css('.main-content'));
      const featureGrid = mainContent.query(By.css('.feature-grid'));
      const featureCards = featureGrid.queryAll(By.css('.feature-card'));

      expect(header).toBeTruthy();
      expect(mainContent).toBeTruthy();
      expect(featureGrid).toBeTruthy();
      expect(featureCards.length).toBe(4);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const h1 = debugElement.query(By.css('h1'));
      const h3s = debugElement.queryAll(By.css('h3'));

      expect(h1).toBeTruthy();
      expect(h3s.length).toBe(4);
    });

    it('should have meaningful text content for screen readers', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const subtitleElement = debugElement.query(By.css('header p'));

      expect(titleElement.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      expect(subtitleElement.nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should have descriptive link text', () => {
      const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
      expect(dashboardLink.nativeElement.textContent.trim()).toBe('Go to Dashboard');
    });
  });

  describe('Content Validation', () => {
    it('should not have empty feature card content', () => {
      const featureCards = debugElement.queryAll(By.css('.feature-card'));
      
      featureCards.forEach(card => {
        const icon = card.query(By.css('.feature-icon'));
        const title = card.query(By.css('h3'));
        const description = card.query(By.css('p'));

        expect(icon.nativeElement.textContent.trim().length).toBeGreaterThan(0);
        expect(title.nativeElement.textContent.trim().length).toBeGreaterThan(0);
        expect(description.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have unique feature card titles', () => {
      const featureTitles = debugElement.queryAll(By.css('.feature-card h3'));
      const titleTexts = featureTitles.map(title => title.nativeElement.textContent.trim());
      const uniqueTitles = [...new Set(titleTexts)];
      
      expect(titleTexts.length).toBe(uniqueTitles.length);
    });

    it('should have unique feature card icons', () => {
      const featureIcons = debugElement.queryAll(By.css('.feature-icon'));
      const iconTexts = featureIcons.map(icon => icon.nativeElement.textContent.trim());
      const uniqueIcons = [...new Set(iconTexts)];
      
      expect(iconTexts.length).toBe(uniqueIcons.length);
    });
  });

  describe('Router Integration', () => {
    it('should have RouterLink directive imported and working', () => {
      const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
      expect(dashboardLink).toBeTruthy();
    });

    it('should not cause navigation errors', () => {
      expect(() => {
        const dashboardLink = debugElement.query(By.css('a[routerLink="/dashboard"]'));
        dashboardLink.nativeElement.click();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
