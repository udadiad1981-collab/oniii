import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding oniii database...");

  // Clean existing data
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@oniii.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("✅ Admin user created (admin@oniii.com / admin123)");

  // Create settings
  await prisma.setting.create({
    data: {
      id: "singleton",
      storeName: "oniii",
      storeNameZh: "oniii",
      storeEmail: "support@oniii.com",
      currency: "USD",
      shippingFrom: "CN",
    },
  });

  // Create categories
  const electronics = await prisma.category.create({
    data: { name: "电子产品", nameEn: "Electronics", slug: "electronics", description: "Smart devices, accessories, and gadgets" },
  });
  const clothing = await prisma.category.create({
    data: { name: "服装配饰", nameEn: "Clothing & Accessories", slug: "clothing-accessories", description: "Fashion, bags, jewelry and more" },
  });
  const home = await prisma.category.create({
    data: { name: "家居生活", nameEn: "Home & Living", slug: "home-living", description: "Home decor, kitchen, bedding and furniture" },
  });
  const handicraft = await prisma.category.create({
    data: { name: "手工艺品", nameEn: "Handicrafts", slug: "handicrafts", description: "Traditional Chinese crafts and artwork" },
  });
  const food = await prisma.category.create({
    data: { name: "食品茶叶", nameEn: "Food & Tea", slug: "food-tea", description: "Chinese tea, snacks, and specialty foods" },
  });
  const beauty = await prisma.category.create({
    data: { name: "美妆护肤", nameEn: "Beauty & Skincare", slug: "beauty-skincare", description: "Skincare, makeup, and personal care" },
  });
  const sports = await prisma.category.create({
    data: { name: "运动户外", nameEn: "Sports & Outdoors", slug: "sports-outdoors", description: "Fitness, camping, and outdoor gear" },
  });
  console.log("✅ Categories created");

  // Helper to create product
  async function createProduct(data: {
    name: string;
    nameEn: string;
    slug: string;
    description: string;
    descriptionEn: string;
    price: number; // CNY
    compareAt?: number;
    costPrice?: number;
    weight: number; // grams
    stock: number;
    categoryId: string;
    featured?: boolean;
    material?: string;
    dimensions?: string;
    sku?: string;
  }) {
    const priceUsd = Math.round(data.price * 0.138 * 100) / 100;
    const compareAtUsd = data.compareAt ? Math.round(data.compareAt * 0.138 * 100) / 100 : undefined;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameEn: data.nameEn,
        slug: data.slug,
        description: data.description,
        descriptionEn: data.descriptionEn,
        price: data.price,
        priceUsd,
        compareAt: data.compareAt,
        costPrice: data.costPrice,
        weight: data.weight,
        stock: data.stock,
        categoryId: data.categoryId,
        status: "published",
        featured: data.featured || false,
        material: data.material,
        dimensions: data.dimensions,
        sku: data.sku,
        images: {
          create: [
            { url: `/products/${data.slug}-1.svg`, alt: data.nameEn, sortOrder: 0 },
            { url: `/products/${data.slug}-2.svg`, alt: data.nameEn, sortOrder: 1 },
          ],
        },
      },
    });
    return product;
  }

  // ===== ELECTRONICS (8 products) =====
  await createProduct({
    name: "真无线降噪蓝牙耳机 Pro",
    nameEn: "True Wireless Noise-Cancelling Earbuds Pro",
    slug: "wireless-earbuds-pro",
    description: "高品质真无线蓝牙耳机，支持主动降噪，续航8小时，IPX5防水，触控操作。高清音质，低延迟游戏模式。兼容iOS和Android。",
    descriptionEn: "Premium true wireless earbuds with active noise cancellation, 8-hour battery life, IPX5 water resistance, and touch controls. Hi-Fi sound quality with low-latency gaming mode. Compatible with iOS and Android.",
    price: 159,
    compareAt: 299,
    weight: 55,
    stock: 500,
    categoryId: electronics.id,
    featured: true,
    material: "ABS + Silicone",
    dimensions: "6.5 x 4.5 x 2.8 cm",
    sku: "ELEC-EB-001",
  });

  await createProduct({
    name: "智能手表 Ultra 系列",
    nameEn: "Smart Watch Ultra Series",
    slug: "smart-watch-ultra",
    description: "1.9英寸AMOLED屏幕，心率/血氧/睡眠监测，100+运动模式，IP68防水，14天续航。支持蓝牙通话和消息提醒。",
    descriptionEn: "1.9-inch AMOLED display, heart rate/SpO2/sleep monitoring, 100+ sport modes, IP68 waterproof, 14-day battery life. Bluetooth calling and message notifications supported.",
    price: 249,
    compareAt: 399,
    weight: 52,
    stock: 320,
    categoryId: electronics.id,
    featured: true,
    sku: "ELEC-SW-002",
  });

  await createProduct({
    name: "65W GaN 快速充电器",
    nameEn: "65W GaN Fast Charger",
    slug: "gan-fast-charger-65w",
    description: "氮化镓黑科技，65W大功率，支持PD3.0/QC4.0快充协议。可同时充笔记本、平板和手机。体积小巧，折叠插脚便于携带。",
    descriptionEn: "Gallium Nitride technology, 65W high power, supports PD3.0/QC4.0 fast charging. Charge laptop, tablet, and phone simultaneously. Compact size with foldable plug for travel.",
    price: 89,
    compareAt: 149,
    weight: 95,
    stock: 800,
    categoryId: electronics.id,
    featured: true,
    sku: "ELEC-GN-003",
  });

  await createProduct({
    name: "便携式蓝牙音箱 360°环绕声",
    nameEn: "Portable Bluetooth Speaker 360° Surround",
    slug: "portable-bluetooth-speaker-360",
    description: "360°环绕立体声，20W大功率，IPX7防水，TWS串联。12小时续航，支持免提通话和TF卡播放。户外派对必备。",
    descriptionEn: "360° surround sound, 20W powerful output, IPX7 waterproof, TWS pairing. 12-hour battery, hands-free calling, and TF card playback. Perfect for outdoor parties.",
    price: 129,
    compareAt: 199,
    weight: 450,
    stock: 250,
    categoryId: electronics.id,
    sku: "ELEC-SP-004",
  });

  await createProduct({
    name: "4K WiFi 迷你投影仪",
    nameEn: "4K WiFi Mini Projector",
    slug: "4k-wifi-mini-projector",
    description: "支持4K解码，1080P物理分辨率，WiFi6无线投屏，自动梯形校正。LED光源30000小时寿命，适合家庭影院。",
    descriptionEn: "4K decoding, 1080P native resolution, WiFi6 wireless screen mirroring, auto keystone correction. LED light source with 30,000-hour lifespan. Perfect for home theater.",
    price: 599,
    compareAt: 899,
    weight: 1200,
    stock: 100,
    categoryId: electronics.id,
    featured: true,
    sku: "ELEC-PJ-005",
  });

  await createProduct({
    name: "手机三轴稳定器云台",
    nameEn: "3-Axis Smartphone Gimbal Stabilizer",
    slug: "smartphone-gimbal-stabilizer",
    description: "三轴防抖云台，AI智能追踪，手势控制，一键切换横竖屏。支持主流手机，抖音/YouTube拍摄神器。",
    descriptionEn: "3-axis stabilization gimbal with AI tracking, gesture control, one-tap landscape/portrait switch. Compatible with all major smartphones. Perfect for TikTok/YouTube creators.",
    price: 199,
    weight: 350,
    stock: 180,
    categoryId: electronics.id,
    sku: "ELEC-GM-006",
  });

  await createProduct({
    name: "USB-C 扩展坞 12合1",
    nameEn: "USB-C Hub 12-in-1 Docking Station",
    slug: "usb-c-hub-12in1",
    description: "12合1多功能扩展坞：HDMI 4K@60Hz、VGA、3×USB3.0、SD/TF卡槽、千兆网口、PD100W充电、3.5mm音频。MacBook/Windows通用。",
    descriptionEn: "12-in-1 multi-function hub: HDMI 4K@60Hz, VGA, 3×USB3.0, SD/TF slots, Gigabit Ethernet, PD100W charging, 3.5mm audio. Universal compatibility with MacBook and Windows.",
    price: 149,
    compareAt: 249,
    weight: 80,
    stock: 400,
    categoryId: electronics.id,
    sku: "ELEC-HB-007",
  });

  await createProduct({
    name: "RGB 机械键盘 无线三模",
    nameEn: "RGB Mechanical Keyboard Wireless Tri-Mode",
    slug: "rgb-mechanical-keyboard-wireless",
    description: "87键紧凑布局，热插拔轴体，RGB背光22种灯效。支持蓝牙5.0/2.4G/USB-C三模连接，4000mAh大电池。",
    descriptionEn: "87-key compact layout, hot-swappable switches, 22 RGB lighting effects. Bluetooth 5.0/2.4G/USB-C tri-mode connection, 4000mAh large battery.",
    price: 229,
    weight: 700,
    stock: 200,
    categoryId: electronics.id,
    sku: "ELEC-KB-008",
  });

  // ===== CLOTHING (8 products) =====
  await createProduct({
    name: "真丝刺绣旗袍连衣裙",
    nameEn: "Silk Embroidered Qipao Dress",
    slug: "silk-embroidered-qipao-dress",
    description: "100%桑蚕丝面料，手工刺绣牡丹图案。经典立领斜襟设计，修身显瘦。适合晚宴、婚礼、节日庆典。多种颜色可选。",
    descriptionEn: "100% mulberry silk with hand-embroidered peony pattern. Classic mandarin collar with slant opening. Figure-flattering silhouette. Perfect for evening parties, weddings, and festive occasions. Multiple colors available.",
    price: 499,
    compareAt: 799,
    weight: 280,
    stock: 80,
    categoryId: clothing.id,
    featured: true,
    material: "100% Mulberry Silk",
    sku: "CLO-QP-001",
  });

  await createProduct({
    name: "纯棉亚麻宽松衬衫",
    nameEn: "Cotton Linen Relaxed Shirt",
    slug: "cotton-linen-relaxed-shirt",
    description: "天然棉麻混纺面料，透气舒适。宽松版型，日系简约风格。适合春夏季节，商务休闲两相宜。",
    descriptionEn: "Natural cotton-linen blend fabric, breathable and comfortable. Relaxed fit with Japanese minimal style. Perfect for spring/summer, suitable for both business and casual wear.",
    price: 139,
    weight: 200,
    stock: 350,
    categoryId: clothing.id,
    material: "55% Linen, 45% Cotton",
    sku: "CLO-SH-002",
  });

  await createProduct({
    name: "真皮手工斜挎包 复古风",
    nameEn: "Genuine Leather Handmade Crossbody Bag Vintage",
    slug: "genuine-leather-crossbody-bag",
    description: "头层牛皮手工制作，复古做旧工艺。大容量多隔层设计，可调节肩带。适合日常通勤和旅行。",
    descriptionEn: "Top-grain genuine leather handcrafted with vintage finish. Spacious multi-compartment design with adjustable strap. Ideal for daily commute and travel.",
    price: 289,
    compareAt: 459,
    weight: 450,
    stock: 120,
    categoryId: clothing.id,
    featured: true,
    material: "Top-Grain Cow Leather",
    sku: "CLO-BG-003",
  });

  await createProduct({
    name: "羊绒围巾 双面印花",
    nameEn: "Cashmere Scarf Double-Sided Print",
    slug: "cashmere-scarf-double-sided",
    description: "100%内蒙古山羊绒，双面印花工艺。柔软保暖不扎脖，尺寸200×70cm。精美礼盒包装。",
    descriptionEn: "100% Inner Mongolia cashmere with double-sided print. Soft, warm, and non-itchy. Size: 200×70cm. Elegant gift box packaging included.",
    price: 199,
    compareAt: 329,
    weight: 120,
    stock: 200,
    categoryId: clothing.id,
    material: "100% Cashmere",
    dimensions: "200 x 70 cm",
    sku: "CLO-SC-004",
  });

  await createProduct({
    name: "竹纤维抗菌袜 6双装",
    nameEn: "Bamboo Fiber Antibacterial Socks 6-Pack",
    slug: "bamboo-fiber-socks-6pack",
    description: "天然竹纤维材质，天然抗菌除臭，吸湿透气。无骨缝合工艺，不磨脚。男女通用均码，6双混色装。",
    descriptionEn: "Natural bamboo fiber with antibacterial and deodorizing properties. Moisture-wicking and breathable. Seamless toe construction for comfort. Unisex one-size, 6 pairs mixed colors.",
    price: 69,
    weight: 250,
    stock: 1000,
    categoryId: clothing.id,
    material: "80% Bamboo Fiber, 15% Cotton, 5% Spandex",
    sku: "CLO-SK-005",
  });

  await createProduct({
    name: "中式盘扣棉麻外套",
    nameEn: "Chinese Knot-Button Cotton Linen Jacket",
    slug: "chinese-knot-button-jacket",
    description: "改良中式设计，传统盘扣元素。棉麻面料舒适透气，可做外套或开衫。东方美学与现代剪裁的完美融合。",
    descriptionEn: "Modern Chinese design with traditional knot buttons. Cotton-linen fabric, comfortable and breathable. Can be worn as jacket or cardigan. Perfect blend of Eastern aesthetics and modern tailoring.",
    price: 259,
    weight: 350,
    stock: 90,
    categoryId: clothing.id,
    material: "70% Cotton, 30% Linen",
    sku: "CLO-JK-006",
  });

  await createProduct({
    name: "桑蚕丝方巾 水墨画印花",
    nameEn: "Silk Square Scarf Ink-Wash Painting Print",
    slug: "silk-square-scarf-ink-painting",
    description: "100%桑蚕丝，中国传统水墨画数码印花。90×90cm经典尺寸，手工卷边。精致礼盒，送礼首选。",
    descriptionEn: "100% mulberry silk with Chinese ink-wash painting digital print. Classic 90×90cm size with hand-rolled edges. Deluxe gift box, perfect for gifting.",
    price: 119,
    weight: 50,
    stock: 300,
    categoryId: clothing.id,
    material: "100% Mulberry Silk",
    dimensions: "90 x 90 cm",
    sku: "CLO-SF-007",
  });

  await createProduct({
    name: "超轻防晒皮肤衣 UPF50+",
    nameEn: "Ultra-Light UV Protection Jacket UPF50+",
    slug: "uv-protection-jacket-upf50",
    description: "UPF50+高倍防晒，超轻薄仅重90g。透气速干面料，可收纳至口袋。适合户外运动、旅行、日常通勤。",
    descriptionEn: "UPF50+ high UV protection, ultra-lightweight at only 90g. Breathable quick-dry fabric, packable into pocket. Ideal for outdoor sports, travel, and daily commute.",
    price: 99,
    weight: 90,
    stock: 500,
    categoryId: clothing.id,
    material: "Nylon + Spandex",
    sku: "CLO-UV-008",
  });

  // ===== HOME & LIVING (8 products) =====
  await createProduct({
    name: "纯棉刺绣床上四件套",
    nameEn: "Cotton Embroidered Bedding Set 4-Piece",
    slug: "cotton-embroidered-bedding-set",
    description: "60支长绒棉面料，精致刺绣工艺。包含被套1件、床单1件、枕套2件。柔软亲肤，四季通用。多尺寸可选。",
    descriptionEn: "60-count long-staple cotton with fine embroidery. Includes 1 duvet cover, 1 flat sheet, 2 pillowcases. Soft and skin-friendly for all seasons. Multiple sizes available.",
    price: 359,
    compareAt: 599,
    weight: 2500,
    stock: 150,
    categoryId: home.id,
    featured: true,
    material: "100% Long-Staple Cotton",
    sku: "HOME-BD-001",
  });

  await createProduct({
    name: "陶瓷功夫茶具套装 12件",
    nameEn: "Ceramic Kung Fu Tea Set 12-Piece",
    slug: "ceramic-kung-fu-tea-set",
    description: "宜兴紫砂工艺，12件全套：茶壶、公道杯、6只品茗杯、茶漏、茶夹、茶巾、茶盘。精美礼盒装。",
    descriptionEn: "Yixing-style ceramic craftsmanship, 12-piece complete set: teapot, fairness pitcher, 6 tasting cups, strainer, tongs, cloth, and tea tray. Elegant gift box.",
    price: 199,
    compareAt: 349,
    weight: 1800,
    stock: 80,
    categoryId: home.id,
    featured: true,
    material: "Ceramic / Purple Clay",
    sku: "HOME-TS-002",
  });

  await createProduct({
    name: "记忆棉护颈枕头",
    nameEn: "Memory Foam Cervical Pillow",
    slug: "memory-foam-cervical-pillow",
    description: "慢回弹记忆棉，人体工学曲线设计，有效支撑颈椎。透气冰丝枕套，可拆洗。缓解颈椎疲劳，改善睡眠质量。",
    descriptionEn: "Slow-rebound memory foam with ergonomic curve design for optimal cervical support. Breathable ice-silk pillowcase, removable and washable. Relieves neck fatigue and improves sleep quality.",
    price: 129,
    compareAt: 199,
    weight: 800,
    stock: 400,
    categoryId: home.id,
    material: "Memory Foam + Ice Silk Cover",
    dimensions: "60 x 35 x 12/10 cm",
    sku: "HOME-PL-003",
  });

  await createProduct({
    name: "LED 护眼台灯 智能调光",
    nameEn: "LED Eye-Care Desk Lamp Smart Dimming",
    slug: "led-eye-care-desk-lamp",
    description: "无频闪无蓝光危害，RA≥95高显色。智能感光自动调光，45分钟定时休息提醒。多角度调节，适合学习办公。",
    descriptionEn: "Flicker-free and blue-light safe, RA≥95 high color rendering. Smart ambient light sensor with auto-dimming, 45-min rest timer. Multi-angle adjustable, perfect for study and work.",
    price: 169,
    weight: 950,
    stock: 250,
    categoryId: home.id,
    sku: "HOME-LP-004",
  });

  await createProduct({
    name: "不锈钢保温杯 真空双层",
    nameEn: "Stainless Steel Vacuum Insulated Bottle",
    slug: "stainless-steel-insulated-bottle",
    description: "316不锈钢内胆，真空双层保温12小时/保冷24小时。500ml容量，食品级硅胶密封圈。BPA-free，适合咖啡/茶/水。",
    descriptionEn: "316 stainless steel inner tank, vacuum double-wall insulation: 12h hot / 24h cold. 500ml capacity with food-grade silicone seal. BPA-free, perfect for coffee/tea/water.",
    price: 79,
    weight: 280,
    stock: 600,
    categoryId: home.id,
    material: "316 Stainless Steel",
    dimensions: "7 x 7 x 23 cm",
    sku: "HOME-BT-005",
  });

  await createProduct({
    name: "手工编织竹收纳篮 3件套",
    nameEn: "Hand-Woven Bamboo Storage Baskets 3-Pack",
    slug: "hand-woven-bamboo-baskets-3pack",
    description: "天然竹材手工编织，环保无异味。大中小三件套，可折叠收纳。适合衣物、玩具、杂物整理。",
    descriptionEn: "Natural bamboo hand-woven, eco-friendly and odorless. Set of 3 (large/medium/small), foldable for storage. Ideal for organizing clothes, toys, and sundries.",
    price: 89,
    weight: 600,
    stock: 200,
    categoryId: home.id,
    material: "Natural Bamboo",
    sku: "HOME-BS-006",
  });

  await createProduct({
    name: "超声波香薰机 加湿器二合一",
    nameEn: "Ultrasonic Aroma Diffuser & Humidifier 2-in-1",
    slug: "aroma-diffuser-humidifier",
    description: "300ml大容量，超声波静音雾化。7色LED氛围灯，自动断电保护。可添加精油，营造温馨居家氛围。",
    descriptionEn: "300ml large capacity, ultrasonic silent misting. 7-color LED ambient light with auto shut-off protection. Add essential oils for a cozy home atmosphere.",
    price: 99,
    compareAt: 159,
    weight: 400,
    stock: 300,
    categoryId: home.id,
    sku: "HOME-DF-007",
  });

  await createProduct({
    name: "防水防油桌布 北欧风格",
    nameEn: "Waterproof Oil-Proof Tablecloth Nordic Style",
    slug: "waterproof-tablecloth-nordic",
    description: "PVC防水涂层+棉布底衬，防油防烫。北欧简约图案设计，一擦即净。多种尺寸和花色可选。",
    descriptionEn: "PVC waterproof coating with cotton backing, oil-proof and heat-resistant. Nordic minimalist pattern design, wipe-clean surface. Multiple sizes and patterns available.",
    price: 69,
    weight: 300,
    stock: 450,
    categoryId: home.id,
    material: "Cotton + PVC Coating",
    sku: "HOME-TC-008",
  });

  // ===== HANDICRAFTS (8 products) =====
  await createProduct({
    name: "双面蜀绣团扇 传统手工",
    nameEn: "Double-Sided Shu Embroidery Fan Handmade",
    slug: "shu-embroidery-fan-handmade",
    description: "四川蜀绣非遗传承，双面刺绣花鸟图案。竹骨真丝扇面，配精美扇架。收藏送礼两相宜。",
    descriptionEn: "Sichuan Shu embroidery intangible heritage, double-sided bird-and-flower pattern. Bamboo frame with silk fan surface, includes display stand. Perfect for collection or gifting.",
    price: 259,
    weight: 150,
    stock: 40,
    categoryId: handicraft.id,
    featured: true,
    material: "Silk + Bamboo",
    sku: "HCR-FN-001",
  });

  await createProduct({
    name: "手工剪纸艺术 十二生肖套装",
    nameEn: "Handmade Paper-Cut Art Chinese Zodiac Set",
    slug: "paper-cut-art-zodiac-set",
    description: "非遗手工剪纸，十二生肖全套12张。红色宣纸精剪，附相框可装裱。中国传统文化的完美收藏品。",
    descriptionEn: "Intangible heritage handmade paper-cut, complete 12 Chinese zodiac set. Red rice paper finely cut, frameable. A perfect collection of traditional Chinese culture.",
    price: 129,
    compareAt: 199,
    weight: 100,
    stock: 60,
    categoryId: handicraft.id,
    material: "Red Rice Paper",
    sku: "HCR-PC-002",
  });

  await createProduct({
    name: "景德镇手绘青花瓷瓶",
    nameEn: "Jingdezhen Hand-Painted Blue & White Porcelain Vase",
    slug: "jingdezhen-blue-white-vase",
    description: "景德镇高岭土手工拉坯，传统青花手绘。1300°C高温烧制，釉面温润如玉。每件独一无二的艺术品。",
    descriptionEn: "Jingdezhen kaolin clay hand-thrown, traditional blue-and-white hand-painting. Fired at 1300°C, glaze as smooth as jade. Each piece is a unique artwork.",
    price: 399,
    weight: 1500,
    stock: 25,
    categoryId: handicraft.id,
    featured: true,
    material: "Kaolin Porcelain",
    dimensions: "Height: 25 cm, Diameter: 12 cm",
    sku: "HCR-VS-003",
  });

  await createProduct({
    name: "竹编工艺灯笼 中式装饰",
    nameEn: "Bamboo Woven Decorative Lantern Chinese Style",
    slug: "bamboo-woven-lantern",
    description: "手工竹编工艺，内嵌LED暖光灯。直径30cm，可悬挂或摆放。中式庭院、茶室、餐厅氛围装饰首选。",
    descriptionEn: "Handwoven bamboo craftsmanship with built-in warm LED light. 30cm diameter, can be hung or placed. Perfect ambiance decor for Chinese courtyard, tea room, or restaurant.",
    price: 149,
    weight: 500,
    stock: 70,
    categoryId: handicraft.id,
    material: "Bamboo + LED",
    dimensions: "Diameter: 30 cm",
    sku: "HCR-LN-004",
  });

  await createProduct({
    name: "水墨画宣纸卷轴挂画",
    nameEn: "Ink Wash Painting on Rice Paper Scroll",
    slug: "ink-wash-painting-scroll",
    description: "当代水墨画家原创手绘，宣纸卷轴装裱。山水花鸟主题，长约150cm。中式家居、茶空间装饰佳品。",
    descriptionEn: "Original hand-painted by contemporary ink-wash artist, mounted on rice paper scroll. Landscape or flower-bird themes, approx 150cm length. Excellent decor for Chinese-style home or tea space.",
    price: 299,
    weight: 200,
    stock: 30,
    categoryId: handicraft.id,
    material: "Rice Paper + Silk Mount",
    dimensions: "150 x 50 cm",
    sku: "HCR-PT-005",
  });

  await createProduct({
    name: "纯手工刺绣杯垫 6枚装",
    nameEn: "Hand-Embroidered Coasters Set of 6",
    slug: "hand-embroidered-coasters-6pack",
    description: "苏绣工艺手工刺绣，花鸟鱼虫图案。棉麻底布+刺绣面，隔热防滑。6枚不同图案，礼盒包装。",
    descriptionEn: "Suzhou embroidery handcraft, flower/bird/fish/insect patterns. Cotton-linen base with embroidered surface, heat-insulated and non-slip. 6 different designs in gift box.",
    price: 89,
    weight: 150,
    stock: 150,
    categoryId: handicraft.id,
    material: "Cotton Linen + Embroidery Thread",
    sku: "HCR-CS-006",
  });

  await createProduct({
    name: "漆器首饰盒 雕花工艺",
    nameEn: "Lacquerware Jewelry Box Carved Design",
    slug: "lacquerware-jewelry-box",
    description: "传统大漆工艺，多层雕花。内衬天鹅绒，多层分区收纳。精美复古中式风格，传家品质。",
    descriptionEn: "Traditional lacquerware craft with multi-layer carved design. Velvet-lined interior with multiple compartments. Exquisite vintage Chinese style, heirloom quality.",
    price: 459,
    weight: 800,
    stock: 20,
    categoryId: handicraft.id,
    material: "Wood + Lacquer + Velvet",
    dimensions: "20 x 15 x 10 cm",
    sku: "HCR-JB-007",
  });

  await createProduct({
    name: "中国结 手工编织 吉祥挂饰",
    nameEn: "Chinese Knot Handmade Auspicious Wall Hanging",
    slug: "chinese-knot-wall-hanging",
    description: "传统手工编织中国结，寓意吉祥如意。配流苏和玉珠装饰，长约60cm。家居、车内装饰，节日送礼首选。",
    descriptionEn: "Traditional hand-tied Chinese knot symbolizing good fortune. With tassel and jade bead decoration, approx 60cm length. Home/car decoration, perfect holiday gift.",
    price: 49,
    weight: 80,
    stock: 300,
    categoryId: handicraft.id,
    material: "Silk Cord + Jade Bead",
    dimensions: "Length: 60 cm",
    sku: "HCR-CK-008",
  });

  // ===== FOOD & TEA (8 products) =====
  await createProduct({
    name: "西湖龙井 明前特级绿茶 250g",
    nameEn: "West Lake Longjing Pre-Qingming Green Tea 250g",
    slug: "longjing-green-tea-premium",
    description: "正宗杭州西湖产区，明前采摘一芽一叶。色绿、香郁、味甘、形美。传统手工炒制，铁盒密封保鲜。",
    descriptionEn: "Authentic Hangzhou West Lake origin, pre-Qingming harvest one-bud-one-leaf. Green color, rich aroma, sweet taste, elegant shape. Traditional hand-roasted, sealed tin for freshness.",
    price: 299,
    compareAt: 459,
    weight: 250,
    stock: 100,
    categoryId: food.id,
    featured: true,
    sku: "FOOD-LJ-001",
  });

  await createProduct({
    name: "云南普洱茶 古树熟茶 357g饼",
    nameEn: "Yunnan Pu-erh Ancient Tree Ripe Tea 357g Cake",
    slug: "puerh-ancient-tree-ripe",
    description: "云南勐海古树茶园，传统渥堆发酵。汤色红浓明亮，口感醇厚顺滑，陈香显著。越陈越香，收藏佳品。",
    descriptionEn: "Yunnan Menghai ancient tree garden, traditional pile fermentation. Bright red infusion, smooth and mellow taste with prominent aged aroma. Better with aging, collectible quality.",
    price: 199,
    weight: 357,
    stock: 80,
    categoryId: food.id,
    sku: "FOOD-PR-002",
  });

  await createProduct({
    name: "手工牛轧糖 经典花生味 500g",
    nameEn: "Handmade Nougat Classic Peanut Flavor 500g",
    slug: "handmade-nougat-peanut",
    description: "纯手工制作，新西兰奶粉+美国杏仁+山东花生。奶香浓郁，软硬适中不粘牙。独立包装，新鲜直达。",
    descriptionEn: "Pure handmade with NZ milk powder, US almonds, and Shandong peanuts. Rich milky flavor, perfectly chewy without sticking. Individually wrapped for freshness.",
    price: 79,
    weight: 500,
    stock: 200,
    categoryId: food.id,
    sku: "FOOD-NG-003",
  });

  await createProduct({
    name: "有机枸杞 宁夏特级 250g",
    nameEn: "Organic Goji Berries Ningxia Premium 250g",
    slug: "organic-goji-berries-ningxia",
    description: "宁夏中宁有机种植，自然晾晒无硫熏。颗粒饱满肉厚，天然甜味。可直接食用、泡茶、煲汤。",
    descriptionEn: "Ningxia Zhongning organic cultivation, naturally sun-dried with no sulfur. Plump and meaty berries with natural sweetness. Eat directly, brew tea, or cook in soup.",
    price: 59,
    weight: 250,
    stock: 400,
    categoryId: food.id,
    sku: "FOOD-GB-004",
  });

  await createProduct({
    name: "龙口粉丝 传统工艺 500g×3袋",
    nameEn: "Longkou Vermicelli Traditional Craft 500g×3 Pack",
    slug: "longkou-vermicelli-traditional",
    description: "山东龙口传统工艺，绿豆豌豆纯粮制作。晶莹剔透，爽滑筋道。火锅、凉拌、炒菜皆宜。",
    descriptionEn: "Shandong Longkou traditional craft, pure mung bean and pea starch. Crystal clear, smooth and chewy. Perfect for hot pot, cold dishes, and stir-fry.",
    price: 39,
    weight: 1500,
    stock: 500,
    categoryId: food.id,
    sku: "FOOD-VM-005",
  });

  await createProduct({
    name: "桂花乌龙茶 台湾高山 150g",
    nameEn: "Osmanthus Oolong Tea Taiwan High Mountain 150g",
    slug: "osmanthus-oolong-taiwan",
    description: "台湾阿里山高山乌龙，天然桂花窨制。花香茶韵完美融合，回甘持久。真空密封罐装保鲜。",
    descriptionEn: "Taiwan Alishan high-mountain oolong, naturally scented with osmanthus flowers. Perfect fusion of floral aroma and tea flavor with lasting sweetness. Vacuum-sealed canister for freshness.",
    price: 149,
    weight: 150,
    stock: 120,
    categoryId: food.id,
    featured: true,
    sku: "FOOD-OT-006",
  });

  await createProduct({
    name: "纯芝麻酱 传统石磨 350g",
    nameEn: "Pure Sesame Paste Traditional Stone-Ground 350g",
    slug: "pure-sesame-paste-stone-ground",
    description: "传统石磨低温研磨，100%纯芝麻无添加。浓郁醇香，拌面火锅蘸料必备。百年老字号工艺。",
    descriptionEn: "Traditional stone-milled at low temperature, 100% pure sesame with no additives. Rich and aromatic, essential for noodle dishes and hot pot dipping. Century-old brand craftsmanship.",
    price: 49,
    weight: 350,
    stock: 300,
    categoryId: food.id,
    sku: "FOOD-SP-007",
  });

  await createProduct({
    name: "红枣核桃糕 养生零食 500g",
    nameEn: "Red Date Walnut Cake Healthy Snack 500g",
    slug: "red-date-walnut-cake",
    description: "新疆红枣+云南核桃，古法蒸制。不添加防腐剂和色素，软糯香甜。补气血养生零食。",
    descriptionEn: "Xinjiang red dates + Yunnan walnuts, traditional steamed. No preservatives or artificial colors, soft and sweet. Nourishing healthy snack for blood and energy.",
    price: 69,
    weight: 500,
    stock: 250,
    categoryId: food.id,
    sku: "FOOD-DW-008",
  });

  // ===== BEAUTY (4 products) =====
  await createProduct({
    name: "珍珠粉美白面膜 10片装",
    nameEn: "Pearl Powder Whitening Sheet Mask 10-Pack",
    slug: "pearl-powder-whitening-mask",
    description: "天然淡水珍珠粉+烟酰胺+玻尿酸。美白淡斑，补水保湿。天丝膜布轻薄服帖，适合所有肤质。",
    descriptionEn: "Natural freshwater pearl powder + niacinamide + hyaluronic acid. Brightening and spot-fading with deep hydration. Tencel sheet mask, thin and snug fit for all skin types.",
    price: 89,
    weight: 250,
    stock: 400,
    categoryId: beauty.id,
    sku: "BTY-MK-001",
  });

  await createProduct({
    name: "蚕丝蛋白洗发水 500ml",
    nameEn: "Silk Protein Shampoo 500ml",
    slug: "silk-protein-shampoo",
    description: "水解蚕丝蛋白+何首乌提取物，修护受损发质。无硅油配方，温和清洁。适合干枯毛躁发质。",
    descriptionEn: "Hydrolyzed silk protein + fleeceflower root extract, repairs damaged hair. Silicone-free formula, gentle cleansing. Suitable for dry and frizzy hair.",
    price: 69,
    weight: 550,
    stock: 300,
    categoryId: beauty.id,
    sku: "BTY-SH-002",
  });

  await createProduct({
    name: "中药草本足浴包 30包/盒",
    nameEn: "Herbal Foot Soak Bags Traditional Chinese 30-Pack",
    slug: "herbal-foot-soak-bags",
    description: "艾草、红花、生姜、当归等八味中药材配制。泡脚驱寒暖身，缓解疲劳，改善睡眠。独立包装，使用方便。",
    descriptionEn: "Eight traditional Chinese herbs: mugwort, safflower, ginger, angelica and more. Foot soaking for warming, fatigue relief, and better sleep. Individually packaged for convenience.",
    price: 59,
    weight: 600,
    stock: 500,
    categoryId: beauty.id,
    sku: "BTY-FS-003",
  });

  await createProduct({
    name: "玉石滚轮美容仪 脸部按摩",
    nameEn: "Jade Roller Facial Massage Beauty Tool",
    slug: "jade-roller-facial-massage",
    description: "天然岫玉滚轮+不锈钢刮痧板套装。促进面部血液循环，消除水肿，提拉紧致。日常美容护理必备。",
    descriptionEn: "Natural Xiuyan jade roller + stainless steel gua sha set. Promotes facial blood circulation, reduces puffiness, lifts and firms. Essential daily beauty care tool.",
    price: 49,
    weight: 120,
    stock: 350,
    categoryId: beauty.id,
    material: "Natural Jade + Stainless Steel",
    sku: "BTY-JR-004",
  });

  // ===== SPORTS (4 products) =====
  await createProduct({
    name: "瑜伽垫 TPE环保双面防滑",
    nameEn: "Yoga Mat TPE Eco-Friendly Double-Sided Non-Slip",
    slug: "yoga-mat-tpe-eco",
    description: "TPE环保材质，6mm厚度。双面防滑纹理，缓冲减震保护关节。含收纳绑带和背包，方便携带。",
    descriptionEn: "TPE eco-friendly material, 6mm thickness. Double-sided non-slip texture, cushioning for joint protection. Includes carrying strap and bag for portability.",
    price: 129,
    compareAt: 199,
    weight: 850,
    stock: 200,
    categoryId: sports.id,
    material: "TPE",
    dimensions: "183 x 61 x 0.6 cm",
    sku: "SPT-YM-001",
  });

  await createProduct({
    name: "碳纤维登山杖 伸缩折叠",
    nameEn: "Carbon Fiber Trekking Poles Telescopic Foldable",
    slug: "carbon-fiber-trekking-poles",
    description: "碳纤维材质仅重230g/支，3节伸缩设计。钨钢杖尖+EVA握把，防滑减震。配收纳袋，户外登山必备。",
    descriptionEn: "Carbon fiber, only 230g per pole, 3-section telescopic design. Tungsten steel tip + EVA grip, non-slip and shock-absorbing. Includes storage bag, essential for hiking.",
    price: 169,
    weight: 460,
    stock: 150,
    categoryId: sports.id,
    material: "Carbon Fiber + Tungsten Steel",
    sku: "SPT-TP-002",
  });

  await createProduct({
    name: "户外便携折叠椅 超轻",
    nameEn: "Outdoor Portable Folding Chair Ultra-Light",
    slug: "outdoor-folding-chair-ultralight",
    description: "航空铝合金框架，仅重900g。承重150kg，一秒速开。配收纳袋，适合露营、钓鱼、沙滩。",
    descriptionEn: "Aircraft-grade aluminum alloy frame, only 900g. 150kg weight capacity, one-second setup. Includes carry bag, perfect for camping, fishing, and beach.",
    price: 119,
    weight: 900,
    stock: 180,
    categoryId: sports.id,
    material: "Aluminum Alloy + 600D Oxford Fabric",
    sku: "SPT-CH-003",
  });

  await createProduct({
    name: "运动腰包 防水跑步手机袋",
    nameEn: "Sports Waist Pack Waterproof Running Phone Bag",
    slug: "sports-waist-pack-waterproof",
    description: "IPX6防水面料，触屏可视窗口。可容纳7英寸手机+钥匙+卡片。反光条设计，夜跑更安全。",
    descriptionEn: "IPX6 waterproof fabric with touch-screen visible window. Fits 7-inch phone + keys + cards. Reflective strip design for safe night running.",
    price: 39,
    weight: 100,
    stock: 600,
    categoryId: sports.id,
    material: "Waterproof Nylon",
    sku: "SPT-WP-004",
  });

  console.log("✅ 48 products created across 7 categories");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
