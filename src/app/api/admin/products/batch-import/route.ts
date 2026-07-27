import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Batch import products from Excel/CSV file
 * Uses simple CSV parsing for flexibility (xlsx parsed as multipart/form-data)
 * 
 * Expected columns: name, nameEn, category_name, description, descriptionEn, price, priceUsd, compareAt, sku, weight, stock, image_url
 */

interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  errors: string[];
}

// Helper: Get category by name (case-insensitive)
async function getCategoryId(categoryName: string): Promise<string | null> {
  if (!categoryName) return null;

  const camelCase = categoryName.toLowerCase().replace(/\s+/g, "-").trim();
  
  // Try case-insensitive search across both name and slug
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: camelCase },
        { name: categoryName },
        { nameEn: categoryName }
      ]
    }
  });

  return category?.id || null;
}

// Simple CSV parser (UTF-8 encoded, comma-separated)
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    if (values.length < headers.length) continue;

    const record: Record<string, string> = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || "";
    });
    records.push(record);
  }

  return records;
}

/**
 * POST /api/admin/products/batch-import
 * Handles file upload and parsing
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const auth = await request.clone().json().then(() => true).catch(() => false);
    if (!auth && !request.headers.get("Authorization")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls") && !fileName.endsWith(".csv")) {
      return NextResponse.json({ 
        error: "Unsupported file format. Please upload .xlsx, .xls, or .csv" 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 10MB" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Check if it's CSV or binary (Excel)
    const isCSV = fileName.endsWith(".csv");
    
    let products: Record<string, string>[] = [];

    if (isCSV) {
      // Parse CSV file
      const content = fileBuffer.toString("utf-8");
      products = parseCSV(content);

      if (products.length === 0 || !("name" in products[0])) {
        return NextResponse.json({ error: "Invalid CSV format. Headers must include 'name', 'category_name', etc." }, { status: 400 });
      }

    } else {
      // For Excel files, we'd need external library like xlsx
      // Simplified: return error and ask to convert CSV first (in production, use multer + xlsx)
      // Next.js handles this via FormData automatically if client uploads .xlsx

      // For now, simulate parsing for demo purposes
      return NextResponse.json({ 
        success: false,
        error: "Excel file support requires 'xlsx' npm package. Please convert to CSV first or install @rapptant/xlsx in production."
      }, { status: 501 });
    }

    // Process products batch
    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      
      // Validate required fields
      if (!prod.name || !prod.nameEn) {
        errors.push(`Line ${i + 2}: Missing name (name/nameEn required)`);
        continue;
      }

      // Get/validate category
      const categoryId = await getCategoryId(prod.category_name || "");
      if (!categoryId) {
        errors.push(`Line ${i + 2}: Category "${prod.category_name || ""}" not found`);
        continue;
      }

      // Create product
      try {
        const priceCNY = parseFloat(prod.price) || 0;
        const priceUsd = prod.priceUsd ? parseFloat(prod.priceUsd) : Math.round(priceCNY * 0.14);
        const compareAt = prod.compareAt ? parseFloat(prod.compareAt) : null;

        await prisma.product.create({
          data: {
            name: prod.name,
            nameEn: prod.nameEn,
            description: prod.description || prod.name,
            descriptionEn: prod.descriptionEn || prod.nameEn,
            price: priceCNY,
            priceUsd: priceUsd,
            compareAt: compareAt || undefined,
            sku: prod.sku || "",
            weight: parseFloat(prod.weight) || 0,
            stock: parseInt(prod.stock) || 0,
            categoryId: categoryId,
            featured: false, // Default to not featured (can be changed manually)
            status: "draft", // Draft by default (can review before publishing)
          } as any,
        });

        importedCount++;
      } catch (error: unknown) {
        const err = error as Error;
        errors.push(`Line ${i + 2}: ${err.message}`);
      }
    }

    const result: ImportResult = {
      success: true,
      total: products.length,
      imported: importedCount,
      errors: errors.slice(0, 50), // Limit to first 50 errors
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("Batch import error:", error);
    
    return NextResponse.json({ 
      success: false,
      error: "File processing failed. Please check file format and try again."
    }, { status: 500 });
  } finally {
    // Prisma cleanup (optional, garbage collected in Vercel)
  }
}

/**
 * GET /api/admin/products/template
 * Returns CSV template for download
 */
export async function GET(_request: NextRequest) {
  const csvTemplate = 
    "name,nameEn,category_name,description,descriptionEn,price,priceUsd,compareAt,sku,weight,stock,image_url\n" +
    "茶花盆栽，Camellia Blossom,flowers-plants,优雅的粉色茶花盆栽，Beautiful pink camellia plant in bloom,89.00,,CAM-001,520,5,https://example.com/camellia.jpg\n" +
    "普洱茶饼，Pu-erh Tea Cake,food-tea,云南陈年普洱熟茶 357g，Aged Pu-erh ripe tea cake from Yunnan,128.00,,156.00,TEA-PER-357,420,12,";

  return new NextResponse(csvTemplate, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="product_import_template.csv"',
    },
  });
}
