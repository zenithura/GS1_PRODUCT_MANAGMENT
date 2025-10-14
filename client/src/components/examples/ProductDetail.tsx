import { ProductDetail } from '../ProductDetail';

export default function ProductDetailExample() {
  //todo: remove mock functionality
  const mockProduct = {
    id: '1',
    gtin: '8499383300123',
    productName: 'Premium Organic Coffee Beans',
    brand: 'Mountain Peak Coffee',
    category: 'Beverages',
    description: 'Sustainably sourced arabica beans from high-altitude farms in Colombia. Medium roast with notes of chocolate and caramel.',
    weight: '500g',
    origin: 'Colombia',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    extraTables: [
      {
        title: 'Nutrition Facts',
        rows: [
          { key: 'Calories', value: '2 per serving' },
          { key: 'Caffeine', value: '95mg per cup' },
          { key: 'Serving Size', value: '1 cup (240ml)' },
        ],
      },
      {
        title: 'Certifications',
        rows: [
          { key: 'Organic', value: 'USDA Certified' },
          { key: 'Fair Trade', value: 'Yes' },
          { key: 'Rainforest Alliance', value: 'Certified' },
        ],
      },
    ],
    createdAt: new Date(),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ProductDetail product={mockProduct} />
    </div>
  );
}
