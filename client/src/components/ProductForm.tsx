import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ExtraTable } from "@shared/schema";

const formSchema = z.object({
  gtin: z.string().min(1, "GTIN is required").regex(/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/, "GTIN must be 8, 12, 13, or 14 digits"),
  productName: z.string().min(1, "Product name is required"),
  brand: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  weight: z.string().optional(),
  origin: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ProductFormProps = {
  onSubmit: (data: FormValues & { image?: File; extraTables: ExtraTable[] }) => Promise<void>;
  initialData?: Partial<FormValues>;
  initialExtraTables?: ExtraTable[];
  initialImageUrl?: string;
  mode: "create" | "update";
};

export function ProductForm({ onSubmit, initialData, initialExtraTables = [], initialImageUrl, mode }: ProductFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [extraTables, setExtraTables] = useState<ExtraTable[]>(initialExtraTables);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gtin: initialData?.gtin || "",
      productName: initialData?.productName || "",
      brand: initialData?.brand || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      weight: initialData?.weight || "",
      origin: initialData?.origin || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTable = () => {
    setExtraTables([...extraTables, { title: "", rows: [{ key: "", value: "" }] }]);
  };

  const removeTable = (index: number) => {
    setExtraTables(extraTables.filter((_, i) => i !== index));
  };

  const updateTableTitle = (index: number, title: string) => {
    const updated = [...extraTables];
    updated[index].title = title;
    setExtraTables(updated);
  };

  const addRow = (tableIndex: number) => {
    const updated = [...extraTables];
    updated[tableIndex].rows.push({ key: "", value: "" });
    setExtraTables(updated);
  };

  const removeRow = (tableIndex: number, rowIndex: number) => {
    const updated = [...extraTables];
    updated[tableIndex].rows = updated[tableIndex].rows.filter((_, i) => i !== rowIndex);
    setExtraTables(updated);
  };

  const updateRow = (tableIndex: number, rowIndex: number, field: "key" | "value", value: string) => {
    const updated = [...extraTables];
    updated[tableIndex].rows[rowIndex][field] = value;
    setExtraTables(updated);
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, image: image || undefined, extraTables });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter the GTIN code and product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="gtin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide">GTIN Code *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="8, 12, 13, or 14 digit code"
                      className="font-mono text-lg"
                      data-testid="input-gtin"
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide">Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product name" data-testid="input-product-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium uppercase tracking-wide">Brand</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Brand name" data-testid="input-brand" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium uppercase tracking-wide">Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Product category" data-testid="input-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Product description" rows={4} data-testid="input-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium uppercase tracking-wide">Weight/Volume</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 500g, 1L" data-testid="input-weight" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium uppercase tracking-wide">Origin</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Country of origin" data-testid="input-origin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-sm font-medium uppercase tracking-wide">Product Image</FormLabel>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover-elevate active-elevate-2" data-testid="input-image-upload">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-4" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm">Click to upload image</p>
                      <p className="text-xs">PNG, JPG, GIF, WEBP (max 16MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Custom Information Tables</CardTitle>
                <CardDescription>Add custom key-value data tables</CardDescription>
              </div>
              <Button type="button" onClick={addTable} variant="outline" size="sm" data-testid="button-add-table">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </div>
          </CardHeader>
          {extraTables.length > 0 && (
            <CardContent className="space-y-6">
              {extraTables.map((table, tableIndex) => (
                <Card key={tableIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <Input
                        placeholder="Table Title (e.g., Nutrition Facts)"
                        value={table.title}
                        onChange={(e) => updateTableTitle(tableIndex, e.target.value)}
                        className="font-semibold"
                        data-testid={`input-table-title-${tableIndex}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addRow(tableIndex)}
                          data-testid={`button-add-row-${tableIndex}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTable(tableIndex)}
                          data-testid={`button-remove-table-${tableIndex}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {table.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-3">
                        <Input
                          placeholder="Key"
                          value={row.key}
                          onChange={(e) => updateRow(tableIndex, rowIndex, "key", e.target.value)}
                          data-testid={`input-row-key-${tableIndex}-${rowIndex}`}
                        />
                        <Input
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) => updateRow(tableIndex, rowIndex, "value", e.target.value)}
                          data-testid={`input-row-value-${tableIndex}-${rowIndex}`}
                        />
                        {table.rows.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(tableIndex, rowIndex)}
                            data-testid={`button-remove-row-${tableIndex}-${rowIndex}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          )}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8" disabled={isSubmitting} data-testid="button-submit">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : mode === "update" ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
