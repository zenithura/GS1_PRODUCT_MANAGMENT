import { ProductForm } from "@/components/ProductForm";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type FlowStep = "gtin-input" | "action-select" | "form";
type ActionType = "update" | "create";

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<FlowStep>("gtin-input");
  const [gtin, setGtin] = useState("");
  const [gtinStatus, setGtinStatus] = useState<"idle" | "checking" | "exists" | "new">("idle");
  const [existingProduct, setExistingProduct] = useState<any>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [gtinError, setGtinError] = useState("");

  const validateGtin = (value: string) => {
    if (!value) {
      return "GTIN is required";
    }
    if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(value)) {
      return "GTIN must be 8, 12, 13, or 14 digits";
    }
    return "";
  };

  const handleGtinCheck = async () => {
    const error = validateGtin(gtin);
    if (error) {
      setGtinError(error);
      return;
    }
    
    setGtinError("");
    setGtinStatus("checking");
    
    try {
      const response = await fetch(`/api/products/check/${gtin}`);
      const data = await response.json();
      
      if (data.exists) {
        setGtinStatus("exists");
        setExistingProduct(data.product);
      } else {
        setGtinStatus("new");
        setExistingProduct(null);
      }
      
      setStep("action-select");
    } catch (error) {
      console.error("Error checking GTIN:", error);
      toast({
        title: "Error",
        description: "Failed to check GTIN. Please try again.",
        variant: "destructive",
      });
      setGtinStatus("idle");
    }
  };

  const handleActionSelect = (selectedAction: ActionType) => {
    setAction(selectedAction);
    setStep("form");
  };

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      
      // Add product data as JSON string
      const productData = {
        gtin: data.gtin,
        productName: data.productName,
        brand: data.brand,
        category: data.category,
        description: data.description,
        weight: data.weight,
        origin: data.origin,
        extraTables: data.extraTables,
      };
      
      formData.append("data", JSON.stringify(productData));
      
      // Add image if present
      if (data.image) {
        formData.append("image", data.image);
      }
      
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save product");
      }
      
      const product = await response.json();
      
      toast({
        title: "Success",
        description: `Product ${product.gtin} ${action === "update" ? "updated" : "created"} successfully!`,
      });

      setTimeout(() => {
        setLocation(`/01/${product.gtin}`);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStep("gtin-input");
    setGtin("");
    setGtinStatus("idle");
    setExistingProduct(null);
    setAction(null);
    setGtinError("");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Create Digital Link</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate GS1 Digital Links for your products. Enter a GTIN code to get started.
        </p>
      </div>

      {step === "gtin-input" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter GTIN Code</CardTitle>
            <CardDescription>Enter the product's GTIN to check if it exists in the database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase tracking-wide">GTIN Code *</label>
              <div className="relative">
                <Input
                  value={gtin}
                  onChange={(e) => {
                    setGtin(e.target.value);
                    setGtinError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGtinCheck();
                    }
                  }}
                  placeholder="8, 12, 13, or 14 digit code"
                  className="font-mono text-lg pr-10"
                  disabled={gtinStatus === "checking"}
                />
                {gtinStatus === "checking" && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
              {gtinError && (
                <p className="text-sm text-destructive">{gtinError}</p>
              )}
            </div>
            <Button 
              onClick={handleGtinCheck} 
              className="w-full"
              disabled={gtinStatus === "checking" || !gtin}
            >
              {gtinStatus === "checking" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check GTIN"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "action-select" && (
        <Card>
          <CardHeader>
            <CardTitle>GTIN: {gtin}</CardTitle>
            <CardDescription>
              {gtinStatus === "exists" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  This product exists in the database
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  This product does not exist in the database
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gtinStatus === "exists" && existingProduct && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">Existing Product:</p>
                <p className="text-sm"><strong>Name:</strong> {existingProduct.productName}</p>
                {existingProduct.brand && <p className="text-sm"><strong>Brand:</strong> {existingProduct.brand}</p>}
                {existingProduct.category && <p className="text-sm"><strong>Category:</strong> {existingProduct.category}</p>}
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm font-medium">Choose an action:</p>
              <div className="grid gap-3">
                {gtinStatus === "exists" && (
                  <Button 
                    onClick={() => handleActionSelect("update")}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    Update Existing Product
                  </Button>
                )}
                <Button 
                  onClick={() => handleActionSelect("create")}
                  variant={gtinStatus === "exists" ? "outline" : "default"}
                  size="lg"
                  className="w-full"
                >
                  Create New Product
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="ghost"
                  size="lg"
                  className="w-full"
                >
                  Check Different GTIN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "form" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">GTIN: {gtin}</p>
              <p className="text-sm font-medium">
                {action === "update" ? "Updating Existing Product" : "Creating New Product"}
              </p>
            </div>
            <Button onClick={handleReset} variant="outline" size="sm">
              Change GTIN
            </Button>
          </div>
          <ProductForm 
            onSubmit={handleSubmit}
            initialData={action === "update" && existingProduct ? {
              gtin: existingProduct.gtin,
              productName: existingProduct.productName,
              brand: existingProduct.brand,
              category: existingProduct.category,
              description: existingProduct.description,
              weight: existingProduct.weight,
              origin: existingProduct.origin,
            } : { gtin }}
            initialExtraTables={action === "update" && existingProduct?.extraTables ? existingProduct.extraTables : []}
            initialImageUrl={action === "update" && existingProduct?.imageUrl ? existingProduct.imageUrl : undefined}
            mode={action || "create"}
          />
        </div>
      )}
    </div>
  );
}
