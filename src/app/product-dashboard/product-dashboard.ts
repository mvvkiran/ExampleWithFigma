import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  firstStock: number;
  sold: number;
  dateAdded: string;
  pricing: number;
  rating: number;
  selected: boolean;
}

@Component({
  selector: 'app-product-dashboard',
  imports: [CommonModule],
  templateUrl: './product-dashboard.html',
  styleUrl: './product-dashboard.css'
})
export class ProductDashboard {
  decemberIncome = 287000;
  decemberSales = 4500;
  
  products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro with M2 Chip',
      firstStock: 4159,
      sold: 878,
      dateAdded: 'Jul 14, 2023',
      pricing: 1200,
      rating: 4.8,
      selected: false
    },
    {
      id: 2,
      name: 'iPhone 15 128 / 256 / 512 IBOX',
      firstStock: 1590,
      sold: 981,
      dateAdded: 'Aug 09, 2023',
      pricing: 1600,
      rating: 5.0,
      selected: true
    },
    {
      id: 3,
      name: 'Apple Watch Ultra 2 Alpine',
      firstStock: 1090,
      sold: 184,
      dateAdded: 'Aug 12, 2023',
      pricing: 999,
      rating: 4.7,
      selected: true
    },
    {
      id: 4,
      name: 'iPhone 15 Pro Max 256',
      firstStock: 2590,
      sold: 995,
      dateAdded: 'Aug 24, 2023',
      pricing: 1600,
      rating: 4.2,
      selected: false
    },
    {
      id: 5,
      name: 'MacBook Pro with M2 Chip',
      firstStock: 4100,
      sold: 645,
      dateAdded: 'Nov 30, 2023',
      pricing: 1200,
      rating: 5.0,
      selected: false
    },
    {
      id: 6,
      name: 'Apple Watch Series 9 45MM',
      firstStock: 3140,
      sold: 981,
      dateAdded: 'Dec 04, 2023',
      pricing: 980,
      rating: 4.6,
      selected: false
    },
    {
      id: 7,
      name: 'Apple Watch Ultra 2 Alpine',
      firstStock: 2150,
      sold: 167,
      dateAdded: 'Dec 08, 2023',
      pricing: 799,
      rating: 4.8,
      selected: false
    }
  ];

  toggleProductSelection(product: Product) {
    product.selected = !product.selected;
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
  }

  deleteProduct(product: Product) {
    console.log('Delete product:', product);
  }
}
