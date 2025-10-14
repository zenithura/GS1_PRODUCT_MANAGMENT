import { ProductForm } from '../ProductForm';

export default function ProductFormExample() {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleGtinCheck = async (gtin: string) => {
    console.log('Checking GTIN:', gtin);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { exists: gtin === '8499383300123' };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProductForm onSubmit={handleSubmit} onGtinCheck={handleGtinCheck} />
    </div>
  );
}
