import { ProductDetail } from "@/components/ProductDetail";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export default function ProductDetailPage() {
  const [, params] = useRoute("/01/:gtin");
  const gtin = params?.gtin;

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ["/api/products/gtin", gtin],
    queryFn: async () => {
      const response = await fetch(`/api/products/gtin/${gtin}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!gtin,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="text-6xl">📦</div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
            <p className="text-lg text-muted-foreground mb-2">
              No product found with GTIN: <span className="font-mono font-semibold">{gtin}</span>
            </p>
            <p className="text-muted-foreground">
              This GTIN code hasn't been registered yet. Would you like to create it?
            </p>
          </div>
          <Link href="/">
            <Button size="lg" data-testid="button-create-product">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Create New Product
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
      </Link>
      <ProductDetail product={product} />
    </div>
  );
}
