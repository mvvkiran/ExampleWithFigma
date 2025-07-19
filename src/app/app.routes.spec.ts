import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

@Component({
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
class TestAppComponent { }

describe('App Routes Configuration', () => {
  let router: Router;
  let location: Location;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(TestAppComponent);
    fixture.detectChanges();
  });

  describe('Route Configuration', () => {
    it('should have correct route configuration', () => {
      expect(routes).toBeDefined();
      expect(routes.length).toBe(4);
    });

    it('should have default redirect route', () => {
      const defaultRoute = routes.find(route => route.path === '');
      expect(defaultRoute).toBeDefined();
      expect(defaultRoute?.redirectTo).toBe('/home');
      expect(defaultRoute?.pathMatch).toBe('full');
    });

    it('should have home route with lazy loading', () => {
      const homeRoute = routes.find(route => route.path === 'home');
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.loadComponent).toBeDefined();
    });

    it('should have dashboard route with lazy loading', () => {
      const dashboardRoute = routes.find(route => route.path === 'dashboard');
      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.loadComponent).toBeDefined();
    });

    it('should have wildcard route for 404 handling', () => {
      const wildcardRoute = routes.find(route => route.path === '**');
      expect(wildcardRoute).toBeDefined();
      expect(wildcardRoute?.redirectTo).toBe('/home');
    });
  });

  describe('Navigation Tests', () => {
    it('should navigate to home by default', async () => {
      await router.navigate(['']);
      expect(location.path()).toBe('/home');
    });

    it('should navigate to home route', async () => {
      await router.navigate(['/home']);
      expect(location.path()).toBe('/home');
    });

    it('should navigate to dashboard route', async () => {
      await router.navigate(['/dashboard']);
      expect(location.path()).toBe('/dashboard');
    });

    it('should redirect unknown routes to home', async () => {
      await router.navigate(['/unknown-route']);
      expect(location.path()).toBe('/home');
    });

    it('should redirect nested unknown routes to home', async () => {
      await router.navigate(['/some/unknown/nested/route']);
      expect(location.path()).toBe('/home');
    });
  });

  describe('Lazy Loading Configuration', () => {
    it('should have proper lazy loading for HomeComponent', () => {
      const homeRoute = routes.find(route => route.path === 'home');
      expect(homeRoute?.loadComponent).toBeDefined();
      expect(typeof homeRoute?.loadComponent).toBe('function');
    });

    it('should have proper lazy loading for ProductDashboard', () => {
      const dashboardRoute = routes.find(route => route.path === 'dashboard');
      expect(dashboardRoute?.loadComponent).toBeDefined();
      expect(typeof dashboardRoute?.loadComponent).toBe('function');
    });

    it('should load HomeComponent dynamically', async () => {
      const homeRoute = routes.find(route => route.path === 'home');
      if (homeRoute?.loadComponent) {
        const component = await homeRoute.loadComponent();
        expect(component).toBeDefined();
        expect(typeof component).toBe('function');
      }
    });

    it('should load ProductDashboard dynamically', async () => {
      const dashboardRoute = routes.find(route => route.path === 'dashboard');
      if (dashboardRoute?.loadComponent) {
        const component = await dashboardRoute.loadComponent();
        expect(component).toBeDefined();
        expect(typeof component).toBe('function');
      }
    });
  });

  describe('Route Parameters and Query Strings', () => {
    it('should handle route parameters correctly', async () => {
      await router.navigate(['/home'], { queryParams: { test: 'value' } });
      expect(location.path()).toBe('/home?test=value');
    });

    it('should handle dashboard with query parameters', async () => {
      await router.navigate(['/dashboard'], { queryParams: { filter: 'active' } });
      expect(location.path()).toBe('/dashboard?filter=active');
    });

    it('should handle fragment navigation', async () => {
      await router.navigate(['/home'], { fragment: 'section1' });
      expect(location.path()).toContain('/home');
    });
  });

  describe('Route Guards and Resolvers', () => {
    it('should not have any route guards configured', () => {
      routes.forEach(route => {
        expect(route.canActivate).toBeUndefined();
        expect(route.canLoad).toBeUndefined();
        expect(route.canDeactivate).toBeUndefined();
      });
    });

    it('should not have any resolvers configured', () => {
      routes.forEach(route => {
        expect(route.resolve).toBeUndefined();
      });
    });
  });

  describe('Route Data and Metadata', () => {
    it('should not have additional data configured for routes', () => {
      routes.forEach(route => {
        if (route.path !== '' && route.path !== '**') {
          expect(route.data).toBeUndefined();
        }
      });
    });

    it('should not have title configuration', () => {
      routes.forEach(route => {
        expect(route.title).toBeUndefined();
      });
    });

    it('should not have children routes configured', () => {
      routes.forEach(route => {
        expect(route.children).toBeUndefined();
      });
    });
  });

  describe('Navigation Events', () => {
    it('should emit navigation events during routing', (done) => {
      let hasEvents = false;
      const subscription = router.events.subscribe(() => {
        if (!hasEvents) {
          hasEvents = true;
          expect(hasEvents).toBe(true);
          subscription.unsubscribe();
          done();
        }
      });
      
      router.navigate(['/home']);
    });

    it('should handle multiple rapid navigations', async () => {
      await router.navigate(['/home']);
      await router.navigate(['/dashboard']);
      await router.navigate(['/home']);
      
      expect(location.path()).toBe('/home');
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      try {
        await router.navigate([null as any]);
        expect(location.path()).toBe('/home');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle empty navigation array', async () => {
      await router.navigate([]);
      expect(location.path()).toBe('/home');
    });
  });

  describe('Route Matching', () => {
    it('should match exact paths only', () => {
      const homeRoute = routes.find(route => route.path === 'home');
      const dashboardRoute = routes.find(route => route.path === 'dashboard');
      
      expect(homeRoute?.path).toBe('home');
      expect(dashboardRoute?.path).toBe('dashboard');
    });

    it('should have correct path matching strategy for default route', () => {
      const defaultRoute = routes.find(route => route.path === '');
      expect(defaultRoute?.pathMatch).toBe('full');
    });

    it('should handle case sensitivity correctly', async () => {
      await router.navigate(['/HOME']);
      expect(location.path()).toBe('/home');
    });

    it('should handle trailing slashes', async () => {
      await router.navigate(['/home/']);
      expect(location.path()).toBe('/home');
    });
  });

  describe('Route Order and Priority', () => {
    it('should have routes in correct order', () => {
      expect(routes[0].path).toBe('');
      expect(routes[1].path).toBe('home');
      expect(routes[2].path).toBe('dashboard');
      expect(routes[3].path).toBe('**');
    });

    it('should have wildcard route as last route', () => {
      const lastRoute = routes[routes.length - 1];
      expect(lastRoute.path).toBe('**');
    });

    it('should process routes in order of specificity', () => {
      const specificRoutes = routes.filter(route => route.path !== '' && route.path !== '**');
      specificRoutes.forEach(route => {
        expect(route.path).not.toBe('**');
      });
    });
  });
});