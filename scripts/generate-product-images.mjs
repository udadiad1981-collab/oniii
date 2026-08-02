import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public/products');

// 生成更美观的 SVG 占位图（带渐变和商品轮廓）
function generateProductSVG(name, category) {
  const colors = {
    electronics: ['#6366f1', '#8b5cf6'],
    clothing: ['#ec4899', '#f472b6'],
    home: ['#10b981', '#34d399'],
    handicrafts: ['#f59e0b', '#fbbf24'],
    'food-tea': ['#78350f', '#92400e'],
    'beauty-skincare': ['#ec4899', '#f9a8d4'],
    'sports-outdoors': ['#3b82f6', '#60a5fa'],
    'cigars-tobacco': ['#713f12', '#a16207']
  };
  
  const [color1, color2] = colors[category] || ['#6b7280', '#9ca3af'];
  
  // 根据分类生成不同的图标
  const icons = {
    electronics: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" fill="none"/>',
    clothing: '<path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v6h2v-6h8v6h2v-6h1.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" stroke="white" stroke-width="2" fill="none"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" stroke-width="2" fill="none"/><path d="M9 22V12h6v10" stroke="white" stroke-width="2"/>',
    handicrafts: '<circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none"/><path d="M12 4v16M4 12h16" stroke="white" stroke-width="1"/>',
    'food-tea': '<path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="white" stroke-width="2" fill="none"/>',
    'beauty-skincare': '<path d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" stroke="white" stroke-width="2" fill="none"/>',
    'sports-outdoors': '<circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none"/><path d="M12 4a8 8 0 010 16" stroke="white" stroke-width="2"/>',
    'cigars-tobacco': '<rect x="6" y="8" width="12" height="10" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M10 8v-2a2 2 0 014 0v2" stroke="white" stroke-width="2"/>'
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad-${category})"/>
  <g transform="translate(180, 160) scale(2)">
    ${icons[category] || icons.handicrafts}
  </g>
  <text x="200" y="350" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">${name}</text>
</svg>`;
}

// 读取商品数据
const products = [
  { slug: 'cuban-cohoba-reserva-real', name: 'Cuban Cohoba', category: 'cigars-tobacco' },
  { slug: 'silk-embroidered-qipao-dress', name: 'Silk Qipao', category: 'clothing' },
  { slug: 'genuine-leather-crossbody-bag', name: 'Leather Bag', category: 'clothing' },
  { slug: 'shu-embroidery-fan-handmade', name: 'Shu Fan', category: 'handicrafts' },
  { slug: 'osmanthus-oolong-taiwan', name: 'Osmanthus Tea', category: 'food-tea' },
  { slug: 'jingdezhen-blue-white-vase', name: 'Porcelain Vase', category: 'handicrafts' },
  { slug: 'dominican-arturo-fuente-opusx', name: 'Arturo Fuente', category: 'cigars-tobacco' },
  { slug: 'smart-watch-ultra', name: 'Smart Watch', category: 'electronics' },
  { slug: 'outdoor-folding-chair-ultralight', name: 'Folding Chair', category: 'sports-outdoors' },
  { slug: 'sports-waist-pack-waterproof', name: 'Waist Pack', category: 'sports-outdoors' },
  { slug: 'carbon-fiber-trekking-poles', name: 'Trekking Poles', category: 'sports-outdoors' },
  { slug: 'jade-roller-facial-massage', name: 'Jade Roller', category: 'beauty-skincare' }
];

// 生成图片
for (const product of products) {
  const svg = generateProductSVG(product.name, product.category);
  
  // 生成 2 张图片（主图 + 细节图）
  for (let i = 1; i <= 2; i++) {
    const filename = `${product.slug}-${i}.svg`;
    await writeFile(join(publicDir, filename), svg);
  }
}

console.log('✅ Generated', products.length * 2, 'product images');
