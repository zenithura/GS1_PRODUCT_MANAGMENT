import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { Package, Download } from "lucide-react";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Generate the product link
  const productLink = `${window.location.origin}/01/${product.gtin}`;

  useEffect(() => {
    if (barcodeRef.current && product.gtin) {
      try {
        JsBarcode(barcodeRef.current, product.gtin, {
          format: product.gtin.length === 13 ? "EAN13" : product.gtin.length === 8 ? "EAN8" : "CODE128",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch (error) {
        console.error("Barcode generation error:", error);
      }
    }
  }, [product.gtin]);

  useEffect(() => {
    if (qrCodeRef.current && productLink) {
      QRCode.toCanvas(qrCodeRef.current, productLink, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then(() => {
          // Store the data URL for download
          const dataUrl = qrCodeRef.current?.toDataURL("image/png");
          if (dataUrl) {
            setQrCodeDataUrl(dataUrl);
          }
        })
        .catch((error) => {
          console.error("QR code generation error:", error);
        });
    }
  }, [productLink]);

  const handleDownloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.download = `qr-code-${product.gtin}.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center bg-muted rounded-xl p-8">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="max-w-full max-h-96 object-contain"
                  data-testid="img-product"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Package className="h-24 w-24" />
                  <p className="text-sm">No image uploaded</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="text-product-name">
                  {product.productName}
                </h1>
                {product.brand && (
                  <p className="text-lg text-muted-foreground" data-testid="text-brand">
                    {product.brand}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0" data-testid="badge-category">
                    {product.category}
                  </Badge>
                )}
                {product.origin && (
                  <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400" data-testid="badge-origin">
                    Origin: {product.origin}
                  </Badge>
                )}
                {product.weight && (
                  <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-400" data-testid="badge-weight">
                    {product.weight}
                  </Badge>
                )}
              </div>

              {product.description && (
                <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-4 py-3 pr-4 rounded-r-lg">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-foreground leading-relaxed" data-testid="text-description">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 pl-4 py-3 pr-4 rounded-r-lg">
                <h3 className="text-sm font-medium uppercase tracking-wide text-purple-700 dark:text-purple-400 mb-2">
                  GTIN CODE
                </h3>
                <p className="text-lg font-mono font-semibold text-purple-900 dark:text-purple-300" data-testid="text-gtin">
                  {product.gtin}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-orange-50/50 dark:bg-orange-950/20 border-b-2 border-orange-200 dark:border-orange-800">
          <CardTitle className="text-orange-700 dark:text-orange-400">Barcode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6 bg-white dark:bg-gray-900">
            <svg ref={barcodeRef} data-testid="svg-barcode"></svg>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader className="bg-green-50/50 dark:bg-green-950/20 border-b-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-700 dark:text-green-400">QR Code</CardTitle>
            <Button 
              onClick={handleDownloadQRCode} 
              variant="outline" 
              size="sm"
              disabled={!qrCodeDataUrl}
              data-testid="button-download-qr"
              className="border-green-500 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-900">
            <canvas ref={qrCodeRef} data-testid="canvas-qr-code"></canvas>
            <div className="text-center space-y-1">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">Scan to view product details</p>
              <p className="text-xs text-muted-foreground font-mono break-all max-w-md">
                {productLink}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {product.extraTables && product.extraTables.length > 0 && (
        <div className="space-y-6">
          {product.extraTables.map((table, index) => {
            // Assign different colors to different tables
            const colorSchemes = [
              { border: "border-cyan-200 dark:border-cyan-800", header: "bg-cyan-50/50 dark:bg-cyan-950/20 border-b-2 border-cyan-200 dark:border-cyan-800", title: "text-cyan-700 dark:text-cyan-400", row: "border-cyan-100 dark:border-cyan-900", even: "bg-cyan-50/30 dark:bg-cyan-950/10" },
              { border: "border-pink-200 dark:border-pink-800", header: "bg-pink-50/50 dark:bg-pink-950/20 border-b-2 border-pink-200 dark:border-pink-800", title: "text-pink-700 dark:text-pink-400", row: "border-pink-100 dark:border-pink-900", even: "bg-pink-50/30 dark:bg-pink-950/10" },
              { border: "border-indigo-200 dark:border-indigo-800", header: "bg-indigo-50/50 dark:bg-indigo-950/20 border-b-2 border-indigo-200 dark:border-indigo-800", title: "text-indigo-700 dark:text-indigo-400", row: "border-indigo-100 dark:border-indigo-900", even: "bg-indigo-50/30 dark:bg-indigo-950/10" },
              { border: "border-amber-200 dark:border-amber-800", header: "bg-amber-50/50 dark:bg-amber-950/20 border-b-2 border-amber-200 dark:border-amber-800", title: "text-amber-700 dark:text-amber-400", row: "border-amber-100 dark:border-amber-900", even: "bg-amber-50/30 dark:bg-amber-950/10" },
            ];
            const colors = colorSchemes[index % colorSchemes.length];
            
            return (
              <Card key={index} className={`border-2 ${colors.border}`}>
                <CardHeader className={colors.header}>
                  <CardTitle className={colors.title}>{table.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border-b ${colors.row} last:border-0 ${rowIndex % 2 === 1 ? colors.even : ""}`}
                            data-testid={`row-table-${index}-${rowIndex}`}
                          >
                            <td className="py-4 px-6 font-semibold text-sm w-1/3">{row.key}</td>
                            <td className="py-4 px-6 text-sm">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {product.createdAt && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-xs text-muted-foreground text-center bg-gray-50 dark:bg-gray-900/50 py-2 rounded-lg">
            <span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
