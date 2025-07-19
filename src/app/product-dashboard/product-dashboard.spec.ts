import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

import { ProductDashboard } from './product-dashboard';

describe('ProductDashboard', () => {
  let component: ProductDashboard;
  let fixture: ComponentFixture<ProductDashboard>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDashboard],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDashboard);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct dashboard statistics', () => {
      expect(component.decemberIncome).toBe(287000);
      expect(component.decemberSales).toBe(4500);
    });

    it('should initialize with 7 products', () => {
      expect(component.products).toBeDefined();
      expect(component.products.length).toBe(7);
    });

    it('should have valid product data structure', () => {
      component.products.forEach(product => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.firstStock).toBeDefined();
        expect(product.sold).toBeDefined();
        expect(product.dateAdded).toBeDefined();
        expect(product.pricing).toBeDefined();
        expect(product.rating).toBeDefined();
        expect(product.selected).toBeDefined();
        
        expect(typeof product.id).toBe('number');
        expect(typeof product.name).toBe('string');
        expect(typeof product.firstStock).toBe('number');
        expect(typeof product.sold).toBe('number');
        expect(typeof product.dateAdded).toBe('string');
        expect(typeof product.pricing).toBe('number');
        expect(typeof product.rating).toBe('number');
        expect(typeof product.selected).toBe('boolean');
      });
    });
  });

  describe('Product Selection Toggle', () => {
    it('should toggle product selection from false to true', () => {
      const product = component.products[0];
      const initialSelection = product.selected;
      
      component.toggleProductSelection(product);
      
      expect(product.selected).toBe(!initialSelection);
    });

    it('should toggle product selection from true to false', () => {
      const product = component.products.find(p => p.selected === true);
      expect(product).toBeDefined();
      
      if (product) {
        component.toggleProductSelection(product);
        expect(product.selected).toBe(false);
      }
    });

    it('should handle multiple product selections independently', () => {
      const product1 = component.products[0];
      const product2 = component.products[1];
      
      const initial1 = product1.selected;
      const initial2 = product2.selected;
      
      component.toggleProductSelection(product1);
      component.toggleProductSelection(product2);
      
      expect(product1.selected).toBe(!initial1);
      expect(product2.selected).toBe(!initial2);
    });

    it('should handle null product gracefully', () => {
      expect(() => {
        component.toggleProductSelection(null as any);
      }).toThrow();
    });

    it('should handle undefined product gracefully', () => {
      expect(() => {
        component.toggleProductSelection(undefined as any);
      }).toThrow();
    });
  });

  describe('Product Edit Functionality', () => {
    it('should call editProduct method with correct product', () => {
      spyOn(console, 'log');
      const product = component.products[0];
      
      component.editProduct(product);
      
      expect(console.log).toHaveBeenCalledWith('Edit product:', product);
    });

    it('should handle edit for all products', () => {
      spyOn(console, 'log');
      
      component.products.forEach(product => {
        component.editProduct(product);
        expect(console.log).toHaveBeenCalledWith('Edit product:', product);
      });
    });

    it('should handle null product in edit', () => {
      spyOn(console, 'log');
      
      component.editProduct(null as any);
      
      expect(console.log).toHaveBeenCalledWith('Edit product:', null);
    });

    it('should handle undefined product in edit', () => {
      spyOn(console, 'log');
      
      component.editProduct(undefined as any);
      
      expect(console.log).toHaveBeenCalledWith('Edit product:', undefined);
    });
  });

  describe('Product Delete Functionality', () => {
    it('should call deleteProduct method with correct product', () => {
      spyOn(console, 'log');
      const product = component.products[0];
      
      component.deleteProduct(product);
      
      expect(console.log).toHaveBeenCalledWith('Delete product:', product);
    });

    it('should handle delete for all products', () => {
      spyOn(console, 'log');
      
      component.products.forEach(product => {
        component.deleteProduct(product);
        expect(console.log).toHaveBeenCalledWith('Delete product:', product);
      });
    });

    it('should handle null product in delete', () => {
      spyOn(console, 'log');
      
      component.deleteProduct(null as any);
      
      expect(console.log).toHaveBeenCalledWith('Delete product:', null);
    });

    it('should handle undefined product in delete', () => {
      spyOn(console, 'log');
      
      component.deleteProduct(undefined as any);
      
      expect(console.log).toHaveBeenCalledWith('Delete product:', undefined);
    });
  });

  describe('Template Rendering', () => {
    it('should render dashboard title', () => {
      const titleElement = debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Dashboard');
    });

    it('should render December income correctly', () => {
      const incomeElement = debugElement.query(By.css('.stat-value'));
      expect(incomeElement.nativeElement.textContent).toContain('287,000');
    });

    it('should render December sales correctly', () => {
      const salesElements = debugElement.queryAll(By.css('.stat-value'));
      expect(salesElements[1].nativeElement.textContent).toContain('4.5k');
    });

    it('should render correct number of product rows', () => {
      const productRows = debugElement.queryAll(By.css('.product-row'));
      expect(productRows.length).toBe(7);
    });

    it('should render product names correctly', () => {
      const productNameElements = debugElement.queryAll(By.css('.product-name'));
      expect(productNameElements.length).toBe(7);
      expect(productNameElements[0].nativeElement.textContent.trim()).toBe('MacBook Pro with M2 Chip');
    });

    it('should render product stock correctly', () => {
      const stockElements = debugElement.queryAll(By.css('.stock-value'));
      expect(stockElements[0].nativeElement.textContent).toContain('4,159');
    });

    it('should render product pricing correctly', () => {
      const pricingElements = debugElement.queryAll(By.css('.pricing-value'));
      expect(pricingElements[0].nativeElement.textContent).toContain('$1,200');
    });

    it('should render product ratings correctly', () => {
      const ratingElements = debugElement.queryAll(By.css('.rating-value'));
      expect(ratingElements[0].nativeElement.textContent).toBe('4.8');
    });

    it('should render checkboxes with correct states', () => {
      const checkboxes = debugElement.queryAll(By.css('input[type="checkbox"]'));
      const productCheckboxes = checkboxes.slice(1); // Skip the header checkbox
      
      expect(productCheckboxes.length).toBe(7);
      
      // Check that selected products have checked checkboxes
      component.products.forEach((product, index) => {
        const checkbox = productCheckboxes[index].nativeElement as HTMLInputElement;
        expect(checkbox.checked).toBe(product.selected);
      });
    });
  });

  describe('User Interactions', () => {
    it('should toggle selection when checkbox is clicked', () => {
      const checkboxes = debugElement.queryAll(By.css('input[type="checkbox"]'));
      const firstProductCheckbox = checkboxes[1]; // Skip header checkbox
      const product = component.products[0];
      const initialSelection = product.selected;
      
      firstProductCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      expect(product.selected).toBe(!initialSelection);
    });

    it('should call editProduct when edit button is clicked', () => {
      spyOn(component, 'editProduct');
      const editButtons = debugElement.queryAll(By.css('.edit-btn'));
      
      editButtons[0].nativeElement.click();
      
      expect(component.editProduct).toHaveBeenCalledWith(component.products[0]);
    });

    it('should call deleteProduct when delete button is clicked', () => {
      spyOn(component, 'deleteProduct');
      const deleteButtons = debugElement.queryAll(By.css('.delete-btn'));
      
      deleteButtons[0].nativeElement.click();
      
      expect(component.deleteProduct).toHaveBeenCalledWith(component.products[0]);
    });
  });

  describe('Edge Cases and Data Validation', () => {
    it('should handle products with zero stock', () => {
      const originalProducts = [...component.products];
      component.products = [
        { ...component.products[0], firstStock: 0 },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const stockElements = debugElement.queryAll(By.css('.stock-value'));
      expect(stockElements[0].nativeElement.textContent).toBe('0');
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should handle products with zero sold items', () => {
      const originalProducts = [...component.products];
      component.products = [
        { ...component.products[0], sold: 0 },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const soldElements = debugElement.queryAll(By.css('.sold-value'));
      expect(soldElements[0].nativeElement.textContent).toBe('0');
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should handle products with very large numbers', () => {
      const originalProducts = [...component.products];
      component.products = [
        { ...component.products[0], firstStock: 1000000, pricing: 999999 },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const stockElements = debugElement.queryAll(By.css('.stock-value'));
      const pricingElements = debugElement.queryAll(By.css('.pricing-value'));
      
      expect(stockElements[0].nativeElement.textContent).toContain('1,000,000');
      expect(pricingElements[0].nativeElement.textContent).toContain('$999,999');
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should handle products with decimal ratings', () => {
      const originalProducts = [...component.products];
      component.products = [
        { ...component.products[0], rating: 4.75 },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const ratingElements = debugElement.queryAll(By.css('.rating-value'));
      expect(ratingElements[0].nativeElement.textContent).toBe('4.75');
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should handle products with very long names', () => {
      const originalProducts = [...component.products];
      const longName = 'This is a very long product name that might cause layout issues in the table';
      component.products = [
        { ...component.products[0], name: longName },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const nameElements = debugElement.queryAll(By.css('.product-name'));
      expect(nameElements[0].nativeElement.textContent.trim()).toBe(longName);
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should handle empty date strings', () => {
      const originalProducts = [...component.products];
      component.products = [
        { ...component.products[0], dateAdded: '' },
        ...component.products.slice(1)
      ];
      fixture.detectChanges();
      
      const dateElements = debugElement.queryAll(By.css('.date-value'));
      expect(dateElements[0].nativeElement.textContent).toBe('');
      
      // Restore original data
      component.products = originalProducts;
      fixture.detectChanges();
    });

    it('should maintain product order after operations', () => {
      const originalOrder = component.products.map(p => p.id);
      
      // Perform various operations
      component.toggleProductSelection(component.products[0]);
      component.editProduct(component.products[1]);
      component.deleteProduct(component.products[2]);
      
      const currentOrder = component.products.map(p => p.id);
      expect(currentOrder).toEqual(originalOrder);
    });
  });

  describe('Dashboard Statistics', () => {
    it('should display correct income format with thousands separator', fakeAsync(() => {
      component.decemberIncome = 1234567;
      tick();
      fixture.detectChanges();
      
      const incomeElement = debugElement.query(By.css('.stat-value'));
      expect(incomeElement.nativeElement.textContent).toContain('1,234,567');
    }));

    it('should display sales in thousands format', fakeAsync(() => {
      component.decemberSales = 12500;
      tick();
      fixture.detectChanges();
      
      const salesElements = debugElement.queryAll(By.css('.stat-value'));
      expect(salesElements[1].nativeElement.textContent).toContain('12.5k');
    }));

    it('should handle zero income', fakeAsync(() => {
      component.decemberIncome = 0;
      tick();
      fixture.detectChanges();
      
      const incomeElement = debugElement.query(By.css('.stat-value'));
      expect(incomeElement.nativeElement.textContent).toContain('0');
    }));

    it('should handle zero sales', fakeAsync(() => {
      component.decemberSales = 0;
      tick();
      fixture.detectChanges();
      
      const salesElements = debugElement.queryAll(By.css('.stat-value'));
      expect(salesElements[1].nativeElement.textContent).toContain('0.0k');
    }));
  });

  describe('Product Data Integrity', () => {
    it('should have unique product IDs', () => {
      const ids = component.products.map(p => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have non-negative stock values', () => {
      component.products.forEach(product => {
        expect(product.firstStock).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have non-negative sold values', () => {
      component.products.forEach(product => {
        expect(product.sold).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have positive pricing values', () => {
      component.products.forEach(product => {
        expect(product.pricing).toBeGreaterThan(0);
      });
    });

    it('should have ratings between 0 and 5', () => {
      component.products.forEach(product => {
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have non-empty product names', () => {
      component.products.forEach(product => {
        expect(product.name.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
