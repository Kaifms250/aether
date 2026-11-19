ALTER TABLE public.products
  ALTER COLUMN rating TYPE NUMERIC(3, 2) USING rating::NUMERIC(3, 2);
ALTER TABLE public.products
  ADD COLUMN storefront_catalog BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.orders
  ADD COLUMN checkout_request_id UUID;
CREATE UNIQUE INDEX orders_user_checkout_request_idx
  ON public.orders (user_id, checkout_request_id)
  WHERE checkout_request_id IS NOT NULL;

UPDATE public.categories
SET name = 'Home Decor',
    tagline = 'Architecture, miniaturised.'
WHERE slug = 'home';

WITH catalog (
  category_slug, slug, name, brand, description, price, discount_pct,
  rating, stock, image_id, tag, is_featured
) AS (
  VALUES
    ('electronics', 'anker-gan-prime-100w', 'GaN Prime 100W Charger', 'Anker', 'A compact four-port GaN charger with intelligent power allocation for laptops and mobile devices.', 8990, 12, 4.11, 11, 'photo-1622979135225-d2ba269cf1ac', 'Power', true),
    ('electronics', 'nothing-ear-open-pro', 'Ear Open Pro', 'Nothing', 'Open-ear wireless audio with a lightweight titanium bridge and spatial sound tuning.', 12990, 10, 4.12, 12, 'photo-1583394838336-acd977736f90', 'Audio', true),
    ('electronics', 'framework-laptop-13', 'Laptop 13 Modular Edition', 'Framework', 'A repairable 13-inch notebook with a high-resolution display and swappable expansion ports.', 125990, 8, 4.13, 13, 'photo-1517336714731-489689fd1ca8', 'Computing', true),
    ('electronics', 'asus-zenbeam-pocket', 'ZenBeam Pocket Projector', 'Asus', 'A portable LED projector with automatic keystone correction and a built-in rechargeable battery.', 64990, 15, 4.14, 14, 'photo-1511707171634-5f897ff02aa9', 'Display', false),
    ('electronics', 'keychron-q1-pro', 'Q1 Pro Wireless Keyboard', 'Keychron', 'An aluminium hot-swappable mechanical keyboard with gasket mounting and multi-device Bluetooth.', 22990, 9, 4.15, 15, 'photo-1527864550417-7fd91fc51a46', 'Desk', true),
    ('electronics', 'fujifilm-x-s20-kit', 'X-S20 Creator Camera Kit', 'Fujifilm', 'A compact mirrorless camera with in-body stabilisation, film simulations and 6K video capture.', 89990, 7, 4.16, 16, 'photo-1608043152269-423dbba4e7e1', 'Imaging', false),
    ('electronics', 'sennheiser-momentum-mini', 'Momentum Mini Headphones', 'Sennheiser', 'Foldable over-ear headphones with balanced studio-inspired sound and replaceable ear pads.', 34990, 14, 4.17, 17, 'photo-1496181133206-80ce9b88a853', 'Audio', true),
    ('electronics', 'eufy-clean-x9', 'Clean X9 Robot Vacuum', 'Eufy', 'A lidar-mapped robot vacuum with room scheduling, obstacle avoidance and a self-emptying dock.', 52990, 11, 4.18, 18, 'photo-1545454675-3531b543be5d', 'Home tech', false),
    ('electronics', 'boox-note-air4', 'Note Air4 E-Ink Tablet', 'Boox', 'A glare-free e-ink tablet for handwritten notes, reading and searchable document annotation.', 45990, 6, 4.19, 19, 'photo-1606220945770-b5b6c2c55bf1', 'Reading', false),
    ('electronics', 'canon-powershot-v1', 'PowerShot V1 Compact Camera', 'Canon', 'A pocketable vlogging camera with a wide-angle lens, directional microphone and 4K recording.', 69990, 13, 4.20, 20, 'photo-1502920917128-1aa500764cbd', 'Imaging', false),

    ('fashion', 'arket-merino-overshirt', 'Merino Utility Overshirt', 'Arket', 'A relaxed merino-blend overshirt with corozo buttons and a softly structured collar.', 15790, 10, 4.21, 21, 'photo-1539533018447-63fcce2678e3', 'Outerwear', true),
    ('fashion', 'cos-cotton-poplin-dress', 'Cotton Poplin Column Dress', 'COS', 'A clean-lined column dress in crisp organic cotton poplin with concealed side pockets.', 13190, 8, 4.22, 22, 'photo-1542272604-787c3835535d', 'Everyday', false),
    ('fashion', 'norse-projects-alva-knit', 'Alva Lambswool Knit', 'Norse Projects', 'A mid-weight lambswool crewneck knitted in Scotland with a ribbed collar and cuffs.', 17490, 12, 4.23, 23, 'photo-1620799140408-edc6dcb6d633', 'Knitwear', true),
    ('fashion', 'universal-works-bakers-jacket', 'Bakers Chore Jacket', 'Universal Works', 'A garment-dyed cotton chore jacket with three practical patch pockets and a soft hand.', 14990, 9, 4.24, 24, 'photo-1591047139829-d91aecb6caea', 'Jackets', false),
    ('fashion', 'studio-nicholson-volume-pant', 'Sorte Volume Trousers', 'Studio Nicholson', 'Wide-leg cotton twill trousers with a deep front pleat and adjustable side tabs.', 24990, 7, 4.25, 25, 'photo-1604176354204-9268737828e4', 'Trousers', true),
    ('fashion', 'margaret-howell-linen-shirt', 'Washed Linen Camp Shirt', 'Margaret Howell', 'A breathable linen shirt woven in Europe and finished with mother-of-pearl buttons.', 16890, 11, 4.26, 26, 'photo-1602810318383-e386cc2a3ccf', 'Shirts', false),
    ('fashion', 'percival-ribbed-polo', 'Ribbed Cotton Polo', 'Percival', 'A textured short-sleeve polo in long-staple cotton with a relaxed open collar.', 7990, 15, 4.27, 27, 'photo-1473966968600-fa801b869a1a', 'Knitwear', false),
    ('fashion', 'folk-assembly-trouser', 'Assembly Cotton Trousers', 'Folk', 'Straight-cut cotton trousers with a garment-washed finish and reinforced pocket bags.', 11990, 6, 4.28, 28, 'photo-1620012253295-c15cc3e65df4', 'Trousers', false),
    ('fashion', 'sunspel-riviera-polo', 'Riviera Pique Polo', 'Sunspel', 'A lightweight long-staple cotton polo with a fine pique texture and tailored fit.', 9990, 13, 4.29, 29, 'photo-1521572163474-6864f9cf17ab', 'Shirts', true),
    ('fashion', 'ymc-disco-cord-shirt', 'Disco Corduroy Shirt', 'YMC', 'A soft needlecord button-through shirt with a curved hem and subtle chest pocket.', 13890, 10, 4.30, 30, 'photo-1556909114-f6e7ad7d3136', 'Shirts', false),

    ('footwear', 'nike-pegasus-trail-6', 'Pegasus Trail 6', 'Nike', 'A cushioned hybrid running shoe with responsive foam and a grippy all-terrain outsole.', 11499, 10, 4.31, 31, 'photo-1600185365483-26d7a4cc7519', 'Trail run', true),
    ('footwear', 'adidas-gazelle-indoor', 'Gazelle Indoor', 'Adidas', 'A low-profile suede trainer with a gum rubber sole and the original archival T-toe.', 8499, 8, 4.32, 32, 'photo-1595950653106-6c9ebd614d3a', 'Lifestyle', true),
    ('footwear', 'asics-gel-nimbus-27', 'Gel-Nimbus 27', 'Asics', 'A high-mileage road shoe with soft FF BLAST cushioning and an engineered mesh upper.', 14999, 12, 4.33, 33, 'photo-1539185441755-769473a23570', 'Running', false),
    ('footwear', 'new-balance-530', '530 Heritage Runner', 'New Balance', 'A breathable mesh and synthetic runner with ABZORB cushioning for everyday wear.', 9999, 9, 4.34, 34, 'photo-1551107696-a4b0c5a0d9a2', 'Lifestyle', true),
    ('footwear', 'hoka-mach-6', 'Mach 6 Road Shoe', 'Hoka', 'A lightweight daily trainer with a responsive supercritical foam midsole and durable rubber zones.', 14499, 7, 4.35, 35, 'photo-1606107557195-0e29a4b5b4aa', 'Running', false),
    ('footwear', 'salomon-acs-pro', 'ACS Pro Advanced', 'Salomon', 'A technical trail shoe with a stabilising chassis, quicklace system and protective toe cap.', 19499, 11, 4.36, 36, 'photo-1584735175315-9d5df23860e6', 'Trail', true),
    ('footwear', 'reebok-club-c-revenge', 'Club C Revenge', 'Reebok', 'A soft leather court sneaker with perforated details and a vintage-inspired terry lining.', 7499, 14, 4.37, 37, 'photo-1605348532760-6753d2c43329', 'Court', false),
    ('footwear', 'veja-campo-leather', 'Campo Leather Trainer', 'Veja', 'A responsibly sourced leather court shoe with organic cotton lining and wild rubber soles.', 15999, 6, 4.38, 38, 'photo-1525966222134-fcfa99b8ae77', 'Lifestyle', false),
    ('footwear', 'clarks-wallabee-evo', 'Wallabee Evo Boot', 'Clarks', 'A moccasin-inspired suede boot set on a crepe-effect sole with a cushioned footbed.', 12999, 13, 4.39, 39, 'photo-1607522370275-f14206abe5d3', 'Casual', false),
    ('footwear', 'on-cloudsurfer-next', 'Cloudsurfer Next', 'On', 'A smooth-transition running shoe with CloudTec Phase cushioning and a breathable engineered upper.', 16999, 10, 4.40, 40, 'photo-1603487742131-4160ec999306', 'Running', false),

    ('beauty', 'aesop-resurrection-balm', 'Resurrection Aromatique Balm', 'Aesop', 'A botanical hand balm with mandarin rind, rosemary leaf and cedar atlas oils.', 2699, 8, 4.41, 41, 'photo-1556228852-80b6e5eeff06', 'Body care', true),
    ('beauty', 'byredo-blanche-edp', 'Blanche Eau de Parfum', 'Byredo', 'A clean floral fragrance layered with aldehydes, rose, sandalwood and soft musk.', 18999, 10, 4.42, 42, 'photo-1541643600914-78b084683601', 'Fragrance', true),
    ('beauty', 'forest-essentials-ubtan', 'Soundarya Radiance Ubtan', 'Forest Essentials', 'A finely milled face polish with saffron and aromatic herbs for a gentle weekly ritual.', 1795, 6, 4.43, 43, 'photo-1592945403244-b3fbafd7f539', 'Skincare', false),
    ('beauty', 'kama-ayurveda-bringadi-oil', 'Bringadi Intensive Hair Oil', 'Kama Ayurveda', 'A traditional botanical hair oil with bhringraj and amla for a nourishing scalp massage.', 1295, 11, 4.44, 44, 'photo-1620916566398-39f1143ab7be', 'Hair care', false),
    ('beauty', 'minimalist-ceramide-moisturizer', 'Ceramide Barrier Repair Cream', 'Minimalist', 'A fragrance-free moisturiser with ceramides and hyaluronic acid for everyday barrier care.', 699, 7, 4.45, 45, 'photo-1571781926291-c477ebfd024b', 'Skincare', true),
    ('beauty', 'plum-green-tea-cleanser', 'Green Tea Pore Cleansing Face Wash', 'Plum', 'A soap-free gel cleanser with green tea extract for a fresh, non-stripping daily cleanse.', 599, 9, 4.46, 46, 'photo-1522338242992-e1a54906a8da', 'Cleanse', false),
    ('beauty', 'dot-and-key-watermelon-sunscreen', 'Watermelon Cooling Sunscreen SPF 50', 'Dot & Key', 'A lightweight broad-spectrum sunscreen with a clear finish and a comfortable gel texture.', 645, 12, 4.47, 47, 'photo-1526045478516-99145907023c', 'Sun care', false),
    ('beauty', 'the-ordinary-niacinamide-serum', 'Niacinamide 10% + Zinc 1%', 'The Ordinary', 'A water-based serum designed to support a more even-looking complexion and balanced feel.', 899, 5, 4.48, 48, 'photo-1586495777744-4413f21062fa', 'Skincare', true),
    ('beauty', 'kiehls-ultra-facial-cream', 'Ultra Facial Cream', 'Kiehl''s', 'A lightweight daily face cream with glacial glycoprotein and squalane for lasting hydration.', 2899, 13, 4.49, 49, 'photo-1608248543803-ba4f8c70ae0b', 'Moisturise', false),
    ('beauty', 'loccitane-shea-hand-cream', 'Shea Butter Hand Cream', 'L''Occitane', 'A rich hand cream made with shea butter to soften and protect hands throughout the day.', 2190, 10, 4.50, 50, 'photo-1608571423902-eed4a5ad8108', 'Body care', false),

    ('home', 'hay-matinee-portable-lamp', 'Matinée Portable Table Lamp', 'HAY', 'A portable rechargeable table light with a pleated shade and warm dimmable glow.', 18490, 9, 4.51, 51, 'photo-1513506003901-1e6a229e2d15', 'Lighting', true),
    ('home', 'muuto-stacked-storage', 'Stacked Open Storage System', 'Muuto', 'A modular oak-veneer storage system that can be stacked or wall-mounted without visible brackets.', 29990, 11, 4.52, 52, 'photo-1567538096630-e0c55bd6374c', 'Furniture', true),
    ('home', 'vitra-toolbox-re-organizer', 'Toolbox RE Desk Organizer', 'Vitra', 'A portable organiser made from recycled plastic with a central handle and flexible compartments.', 6490, 7, 4.53, 53, 'photo-1506439773649-6e0eb8cfb237', 'Desk', false),
    ('home', 'ferm-living-ripple-carafe', 'Ripple Smoked Glass Carafe', 'Ferm Living', 'A mouth-blown glass carafe with a ribbed surface and matching tumbler for serving water.', 8490, 12, 4.54, 54, 'photo-1540574163026-643ea20ade25', 'Tableware', true),
    ('home', 'flos-bellhop-table-lamp', 'Bellhop Portable Table Lamp', 'Flos', 'A rechargeable portable lamp with a softly graduated dimmer and a compact polycarbonate shade.', 27990, 8, 4.55, 55, 'photo-1493663284031-b7e3aefcae8e', 'Lighting', false),
    ('home', 'artek-stool-60-natural', 'Stool 60 Natural Birch', 'Artek', 'A stackable three-leg stool in solid birch with the signature bent-laminate L-leg construction.', 32990, 6, 4.56, 56, 'photo-1524758631624-e2822e304c36', 'Seating', true),
    ('home', 'jaipur-rugs-dhurrie', 'Handwoven Cotton Dhurrie', 'Jaipur Rugs', 'A flat-woven cotton dhurrie with a restrained geometric motif, made by artisan weavers in India.', 12490, 14, 4.57, 57, 'photo-1538688525198-9b88f6f53126', 'Textiles', false),
    ('home', 'nicobar-sola-vase', 'Sola Stoneware Vase', 'Nicobar', 'A hand-finished stoneware vase with a softly tactile glaze, sized for a few seasonal stems.', 5490, 10, 4.58, 58, 'photo-1513519245088-0e12902e5a38', 'Decor', false),
    ('home', 'fabindia-kantha-throw', 'Hand-Quilted Kantha Throw', 'Fabindia', 'A lightweight hand-quilted cotton throw with kantha stitching and a reversible printed face.', 7490, 13, 4.59, 59, 'photo-1581539250439-c96689b516dd', 'Textiles', true),
    ('home', 'urban-ladder-aria-side-table', 'Aria Solid Wood Side Table', 'Urban Ladder', 'A compact bedside table in solid mango wood with a rounded edge and lower storage shelf.', 15990, 9, 4.60, 60, 'photo-1555041469-a586c61ea9bc', 'Furniture', false),

    ('accessories', 'bellroy-slim-sleeve', 'Slim Sleeve Leather Wallet', 'Bellroy', 'A slim vegetable-tanned leather wallet with quick-access card slots and a protected coin section.', 6999, 8, 4.61, 61, 'photo-1627123424574-724758594e93', 'Wallets', true),
    ('accessories', 'rayban-wayfarer-polarized', 'Original Wayfarer Polarized', 'Ray-Ban', 'A classic acetate frame with polarized lenses, integrated nose rests and a protective case.', 13999, 10, 4.62, 62, 'photo-1572635196237-14b3f281503f', 'Eyewear', true),
    ('accessories', 'titan-edge-ceramic', 'Edge Ceramic Quartz Watch', 'Titan', 'An ultra-slim ceramic watch with a sapphire crystal, clean dial and stainless-steel clasp.', 17999, 12, 4.63, 63, 'photo-1523275335684-37898b6baf30', 'Watches', false),
    ('accessories', 'mokobara-transit-backpack', 'Transit Laptop Backpack', 'Mokobara', 'A water-resistant commuter backpack with a padded 16-inch laptop sleeve and luggage pass-through.', 8999, 9, 4.64, 64, 'photo-1577803645773-f96470509666', 'Travel', true),
    ('accessories', 'dailyobjects-sling-pro', 'Sling Pro Crossbody Bag', 'DailyObjects', 'A compact crossbody sling in recycled fabric with a secure zip pocket and adjustable strap.', 3999, 7, 4.65, 65, 'photo-1590874103328-eac38a683ce7', 'Bags', false),
    ('accessories', 'montblanc-starwalker-ballpoint', 'StarWalker Resin Ballpoint', 'Montblanc', 'A balanced resin ballpoint pen with a polished metal clip and the signature floating emblem.', 35999, 6, 4.66, 66, 'photo-1553062407-98eeb64c6a62', 'Writing', true),
    ('accessories', 'casio-g-shock-gm2100', 'G-Shock Metal GM-2100', 'Casio', 'A shock-resistant analog-digital watch with a stainless-steel bezel and 200-metre water resistance.', 15995, 14, 4.67, 67, 'photo-1577563908411-5077b6dc7624', 'Watches', false),
    ('accessories', 'seiko-5-sports-field', '5 Sports Field Automatic', 'Seiko', 'An automatic field watch with a day-date display, luminous hands and a robust steel case.', 24999, 11, 4.68, 68, 'photo-1524592094714-0f0654e20314', 'Watches', false),
    ('accessories', 'fossil-harwell-crossbody', 'Harwell Leather Crossbody', 'Fossil', 'A compact pebbled-leather crossbody bag with an adjustable strap and secure turn-lock closure.', 10999, 13, 4.69, 69, 'photo-1556656793-08538906a9f8', 'Bags', true),
    ('accessories', 'samsonite-proxis-cabin', 'Proxis Cabin Spinner', 'Samsonite', 'A lightweight cabin spinner with a recycled lining, smooth double wheels and an integrated TSA lock.', 27999, 10, 4.70, 70, 'photo-1547949003-9792a18a2601', 'Travel', false),

    ('books', 'penguin-quiet-living', 'The Art of Quiet Living', 'Penguin Random House', 'An illustrated collection of essays on making space for attention, considered objects and slower days.', 579, 5, 4.71, 71, 'photo-1544947950-fa07a98d237f', 'Essays', true),
    ('books', 'harpercollins-design-everyday', 'Design for the Everyday', 'HarperCollins India', 'A practical exploration of the small design decisions that make tools and spaces easier to live with.', 749, 8, 4.72, 72, 'photo-1535905557558-afc4877a26fc', 'Design', true),
    ('books', 'bloomsbury-material-world', 'A Material World', 'Bloomsbury', 'A richly researched account of the materials, craft traditions and supply chains behind familiar objects.', 949, 10, 4.73, 73, 'photo-1512820790803-83ca734da794', 'Culture', false),
    ('books', 'simon-schuster-making-time', 'Making Time', 'Simon & Schuster', 'A thoughtful guide to protecting creative attention and building routines that leave room for curiosity.', 649, 6, 4.74, 74, 'photo-1589998059171-988d887df646', 'Creativity', false),
    ('books', 'rupa-indian-craft-atlas', 'The Indian Craft Atlas', 'Rupa Publications', 'A field guide to regional Indian crafts, with profiles of makers, materials and enduring techniques.', 999, 12, 4.75, 75, 'photo-1497633762265-9d179a990aa6', 'Craft', true),
    ('books', 'aleph-colour-and-form', 'Colour and Form', 'Aleph Book Company', 'An accessible visual history of colour in architecture, print, textiles and contemporary design.', 1199, 9, 4.76, 76, 'photo-1531901599143-df5010ab9438', 'Art', false),
    ('books', 'hachette-the-good-room', 'The Good Room', 'Hachette India', 'A room-by-room guide to lighting, proportion and choosing furnishings that age gracefully.', 799, 7, 4.77, 77, 'photo-1610882648335-ced8fc8fa6b6', 'Interiors', false),
    ('books', 'pan-macmillan-small-forests', 'Small Forests', 'Pan Macmillan', 'A photographic journey through urban gardens and the people restoring pockets of biodiversity.', 1099, 11, 4.78, 78, 'photo-1543002588-bfa74002ed7e', 'Nature', true),
    ('books', 'westland-the-long-view', 'The Long View', 'Westland Books', 'Profiles of independent makers who build durable businesses around repair, reuse and local knowledge.', 859, 13, 4.79, 79, 'photo-1474932430478-367dbb6832c1', 'Business', false),
    ('books', 'juggernaut-notes-on-making', 'Notes on Making', 'Juggernaut', 'Short interviews with Indian designers and craftspeople on process, patience and learning by hand.', 549, 4, 4.80, 80, 'photo-1532153975070-2e9ab71f1b14', 'Interviews', false),

    ('fitness', 'decathlon-trail-hydration-vest', 'Trail Hydration Vest 5L', 'Decathlon', 'A lightweight running vest with two soft-flask pockets, a secure phone pocket and reflective trim.', 3590, 10, 4.81, 81, 'photo-1571019613454-1cb2f99b2d8b', 'Running', true),
    ('fitness', 'cultsport-smart-jump-rope', 'Smart Weighted Jump Rope', 'Cultsport', 'A weighted skipping rope with sealed bearings, adjustable cable length and a textured handle.', 1590, 8, 4.82, 82, 'photo-1508685096489-7aacd43bd3b1', 'Cardio', true),
    ('fitness', 'boldfit-adjustable-dumbbell', 'Adjustable Dumbbell Pair', 'Boldfit', 'Space-saving adjustable dumbbells with a secure selector and a non-slip ergonomic grip.', 12590, 12, 4.83, 83, 'photo-1576678927484-cc907957088c', 'Strength', false),
    ('fitness', 'strauss-cork-yoga-blocks', 'Cork Yoga Block Set', 'Strauss', 'A pair of dense natural-cork blocks with rounded edges for stable support in floor practice.', 2590, 7, 4.84, 84, 'photo-1583454110551-21f2fa2afe61', 'Yoga', false),
    ('fitness', 'hrx-resistance-band-kit', 'Progressive Resistance Band Kit', 'HRX', 'Five colour-coded resistance bands with cushioned handles, ankle straps and a door anchor.', 1890, 9, 4.85, 85, 'photo-1518611012118-696072aa579a', 'Strength', true),
    ('fitness', 'protone-foam-roller', 'EVA Deep-Tissue Foam Roller', 'Protone', 'A firm textured roller for post-training mobility work, made from durable high-density EVA foam.', 1490, 6, 4.86, 86, 'photo-1592432678016-e910b452f9a2', 'Recovery', false),
    ('fitness', 'flexnest-folding-exercise-bike', 'Foldable Magnetic Exercise Bike', 'Flexnest', 'A compact indoor bike with magnetic resistance, a quiet belt drive and a fold-away frame.', 18590, 13, 4.87, 87, 'photo-1505693416388-ac5ce068fe85', 'Cardio', true),
    ('fitness', 'beatxp-pulse-massage-gun', 'Pulse Mini Massage Gun', 'BeatXP', 'A portable percussion massager with four interchangeable heads and three recovery settings.', 4590, 11, 4.88, 88, 'photo-1571902943202-507ec2618e8f', 'Recovery', false),
    ('fitness', 'sparnod-sprint-treadmill', 'Sprint Compact Treadmill', 'Sparnod', 'A foldable walking treadmill with remote speed control, a quiet motor and a low-profile deck.', 29590, 15, 4.89, 89, 'photo-1591291621164-2c6367723315', 'Cardio', false),
    ('fitness', 'lifelong-kettlebell-pair', 'Coated Cast-Iron Kettlebell Pair', 'Lifelong', 'A balanced cast-iron kettlebell pair with a protective coating and wide, comfortable handles.', 6590, 14, 4.90, 90, 'photo-1599447421416-3414500d18a5', 'Strength', false)
)
INSERT INTO public.products (
  category_id, slug, name, brand, description, price, compare_at_price,
  discount_pct, rating, review_count, stock, image_url, images, tag,
  currency, storefront_catalog, is_active, is_featured
)
SELECT
  c.id, p.slug, p.name, p.brand, p.description, p.price,
  round((p.price::numeric * 100) / (100 - p.discount_pct), 2),
  p.discount_pct, p.rating, 0, p.stock,
  'https://images.unsplash.com/' || p.image_id || '?auto=format&fit=crop&w=1200&q=85',
  jsonb_build_array('https://images.unsplash.com/' || p.image_id || '?auto=format&fit=crop&w=1200&q=85'),
  p.tag, 'INR', true, true, p.is_featured
FROM catalog p
JOIN public.categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  discount_pct = EXCLUDED.discount_pct,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  tag = EXCLUDED.tag,
  currency = EXCLUDED.currency,
  storefront_catalog = EXCLUDED.storefront_catalog,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  updated_at = now();

UPDATE public.categories c
SET image_url = (
  SELECT p.image_url
  FROM public.products p
  WHERE p.category_id = c.id AND p.is_active AND p.storefront_catalog
  ORDER BY p.slug
  LIMIT 1
);

CREATE OR REPLACE FUNCTION public.validate_cart_item_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  available_stock INT;
BEGIN
  SELECT p.stock INTO available_stock
  FROM public.products p
  WHERE p.id = NEW.product_id AND p.is_active AND p.storefront_catalog;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This product is no longer available';
  END IF;

  IF NEW.quantity < 1 OR NEW.quantity > available_stock THEN
    RAISE EXCEPTION 'Requested quantity exceeds available stock';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_cart_item_stock
BEFORE INSERT OR UPDATE OF product_id, quantity ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION public.validate_cart_item_stock();

REVOKE EXECUTE ON FUNCTION public.validate_cart_item_stock() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.add_to_cart(p_product_id UUID, p_quantity INT DEFAULT 1)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  product_stock INT;
  current_quantity INT;
  new_quantity INT;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RAISE EXCEPTION 'Quantity must be at least one';
  END IF;

  SELECT p.stock INTO product_stock
  FROM public.products p
  WHERE p.id = p_product_id AND p.is_active AND p.storefront_catalog
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This product is no longer available';
  END IF;

  SELECT ci.quantity INTO current_quantity
  FROM public.cart_items ci
  WHERE ci.user_id = current_user_id AND ci.product_id = p_product_id
  FOR UPDATE;

  new_quantity := COALESCE(current_quantity, 0) + p_quantity;
  IF new_quantity > product_stock THEN
    RAISE EXCEPTION 'Requested quantity exceeds available stock';
  END IF;

  INSERT INTO public.cart_items (user_id, product_id, quantity)
  VALUES (current_user_id, p_product_id, new_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();

  RETURN new_quantity;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_to_cart(UUID, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_to_cart(UUID, INT) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_pending_order(
  p_items JSONB,
  p_shipping_address JSONB,
  p_coupon_code TEXT DEFAULT NULL,
  p_request_id UUID DEFAULT NULL,
  p_clear_cart BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  item RECORD;
  product_row public.products%ROWTYPE;
  created_order public.orders%ROWTYPE;
  item_snapshots JSONB := '[]'::jsonb;
  item_count INT;
  unique_item_count INT;
  subtotal_amount NUMERIC(10, 2) := 0;
  discount_amount NUMERIC(10, 2) := 0;
  shipping_amount NUMERIC(10, 2);
  tax_amount NUMERIC(10, 2);
  total_amount NUMERIC(10, 2);
  coupon_row public.coupons%ROWTYPE;
  normalized_coupon TEXT;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;
  IF p_request_id IS NULL THEN
    RAISE EXCEPTION 'Checkout request id is required';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(current_user_id::text || ':' || p_request_id::text));
  SELECT o.* INTO created_order
  FROM public.orders o
  WHERE o.user_id = current_user_id AND o.checkout_request_id = p_request_id;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'id', created_order.id,
      'order_number', created_order.order_number,
      'status', created_order.status,
      'subtotal', created_order.subtotal,
      'discount', created_order.discount,
      'tax', created_order.tax,
      'shipping', created_order.shipping,
      'total', created_order.total,
      'currency', created_order.currency
    );
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Order items must be provided as an array';
  END IF;
  IF jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'An order must contain between 1 and 50 product lines';
  END IF;
  IF jsonb_typeof(p_shipping_address) IS DISTINCT FROM 'object'
     OR NULLIF(trim(p_shipping_address->>'full_name'), '') IS NULL
     OR NULLIF(trim(p_shipping_address->>'line1'), '') IS NULL
     OR NULLIF(trim(p_shipping_address->>'city'), '') IS NULL
     OR NULLIF(trim(p_shipping_address->>'postal_code'), '') IS NULL
     OR NULLIF(trim(p_shipping_address->>'country'), '') IS NULL THEN
    RAISE EXCEPTION 'Complete shipping details are required';
  END IF;

  SELECT count(*), count(DISTINCT value->>'product_id')
  INTO item_count, unique_item_count
  FROM jsonb_array_elements(p_items);
  IF item_count <> unique_item_count THEN
    RAISE EXCEPTION 'Duplicate product lines are not allowed';
  END IF;

  FOR item IN
    SELECT lines.product_id, lines.quantity
    FROM jsonb_to_recordset(p_items) AS lines(product_id UUID, quantity INT)
    ORDER BY lines.product_id
  LOOP
    IF item.product_id IS NULL OR item.quantity IS NULL OR item.quantity < 1 THEN
      RAISE EXCEPTION 'Every order line requires a product and a positive quantity';
    END IF;

    SELECT p.* INTO product_row
    FROM public.products p
    WHERE p.id = item.product_id AND p.is_active AND p.storefront_catalog
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A product in this order is no longer available';
    END IF;
    IF item.quantity > product_row.stock THEN
      RAISE EXCEPTION 'Requested quantity exceeds stock for %', product_row.name;
    END IF;

    UPDATE public.products
    SET stock = stock - item.quantity, updated_at = now()
    WHERE id = product_row.id;

    subtotal_amount := subtotal_amount + product_row.price * item.quantity;
    item_snapshots := item_snapshots || jsonb_build_array(jsonb_build_object(
      'product_id', product_row.id,
      'unit_price', product_row.price,
      'quantity', item.quantity,
      'line_total', product_row.price * item.quantity,
      'product_snapshot', jsonb_build_object(
        'name', product_row.name,
        'brand', product_row.brand,
        'image_url', product_row.image_url,
        'slug', product_row.slug
      )
    ));
  END LOOP;

  normalized_coupon := NULLIF(upper(trim(p_coupon_code)), '');
  IF normalized_coupon IS NOT NULL THEN
    SELECT c.* INTO coupon_row
    FROM public.coupons c
    WHERE c.code = normalized_coupon
      AND c.is_active
      AND (c.expires_at IS NULL OR c.expires_at > now());
    IF NOT FOUND THEN
      RAISE EXCEPTION 'This coupon is invalid or expired';
    END IF;
    IF subtotal_amount < coupon_row.min_subtotal THEN
      RAISE EXCEPTION 'This coupon requires a minimum subtotal of %', coupon_row.min_subtotal;
    END IF;
    IF coupon_row.discount_pct IS NOT NULL THEN
      IF coupon_row.discount_pct < 0 OR coupon_row.discount_pct > 100 THEN
        RAISE EXCEPTION 'This coupon has an invalid discount';
      END IF;
      discount_amount := least(subtotal_amount, round(subtotal_amount * coupon_row.discount_pct / 100, 2));
    ELSIF coupon_row.discount_amount IS NOT NULL THEN
      discount_amount := least(subtotal_amount, coupon_row.discount_amount);
    ELSE
      RAISE EXCEPTION 'This coupon has no valid discount';
    END IF;
  END IF;

  shipping_amount := CASE WHEN subtotal_amount - discount_amount >= 1999 THEN 0 ELSE 99 END;
  tax_amount := round((subtotal_amount - discount_amount) * 0.18, 2);
  total_amount := subtotal_amount - discount_amount + shipping_amount + tax_amount;

  INSERT INTO public.orders (
    user_id, status, subtotal, discount, tax, shipping, total, currency,
    coupon_code, shipping_address, checkout_request_id
  )
  VALUES (
    current_user_id, 'pending', subtotal_amount, discount_amount, tax_amount,
    shipping_amount, total_amount, 'INR', normalized_coupon, p_shipping_address,
    p_request_id
  )
  RETURNING * INTO created_order;

  INSERT INTO public.order_items (
    order_id, product_id, product_snapshot, unit_price, quantity, line_total
  )
  SELECT
    created_order.id, lines.product_id, lines.product_snapshot,
    lines.unit_price, lines.quantity, lines.line_total
  FROM jsonb_to_recordset(item_snapshots) AS lines(
    product_id UUID,
    unit_price NUMERIC(10, 2),
    quantity INT,
    line_total NUMERIC(10, 2),
    product_snapshot JSONB
  );

  IF p_clear_cart THEN
    DELETE FROM public.cart_items ci
    WHERE ci.user_id = current_user_id
      AND ci.product_id IN (
        SELECT lines.product_id
        FROM jsonb_to_recordset(p_items) AS lines(product_id UUID, quantity INT)
      );
  END IF;

  RETURN jsonb_build_object(
    'id', created_order.id,
    'order_number', created_order.order_number,
    'status', created_order.status,
    'subtotal', created_order.subtotal,
    'discount', created_order.discount,
    'tax', created_order.tax,
    'shipping', created_order.shipping,
    'total', created_order.total,
    'currency', created_order.currency
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_pending_order(JSONB, JSONB, TEXT, UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_pending_order(JSONB, JSONB, TEXT, UUID, BOOLEAN) TO authenticated;

DROP POLICY IF EXISTS "orders_owner_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_owner_update" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
DROP POLICY IF EXISTS "order_items_owner_insert" ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin_all" ON public.order_items;
CREATE POLICY "orders_admin_select" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "order_items_admin_select" ON public.order_items
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'admin')
  );
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active AND storefront_catalog);
