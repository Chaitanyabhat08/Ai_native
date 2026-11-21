// Product structure defined
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating: { rate: number; count: number };
}

// Category structure defined
export interface CategoryProducts {
  featured: Product[];
  remaining: Product[];
}

// Enquiry details  structure defined
export interface EnquiryDetails {
  productId: number;
  name: string;
  email: string;
  message: string;
}
