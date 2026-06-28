
-- Revoke broad execute on internal helpers; trigger functions don't need public EXECUTE.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_product_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- ============ SEED CATEGORIES ============
INSERT INTO public.categories (slug, name, tagline, description, image_url, accent_color, sort_order) VALUES
('electronics','Electronics','Computing, audio, and spatial — at the bleeding edge.','From the first Vision Pro Studio to the quietest noise-cancelling we''ve ever stocked.','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80','#8ab4ff',1),
('fashion','Fashion','Cut, cloth, and considered tailoring.','Investment pieces from houses who still own their factories.','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80','#c08aff',2),
('footwear','Footwear','Performance and craft, in one shelf.','Carbon-plated racers next to hand-welted leathers.','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80','#ff7a59',3),
('beauty','Beauty','Skincare, fragrance, ritual.','Clean formulations, refillable vessels, honest provenance.','https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80','#ffb6c1',4),
('home','Home & Living','Architecture, miniaturised.','Lighting, ceramics, and small furniture from independents worldwide.','https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80','#e8c07a',5),
('accessories','Accessories','The small things you carry every day.','Wallets, eyewear, watches, travel.','https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80','#6d6cff',6),
('books','Books','Long reads, deep stacks.','Hardbacks, monographs, and the occasional zine.','https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80','#90b890',7),
('fitness','Fitness','Tools that disappear in your hand.','Equipment for people who train every day.','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80','#90e0c0',8);

-- ============ SEED PRODUCTS ============
WITH c AS (SELECT id, slug FROM public.categories)
INSERT INTO public.products (slug, name, brand, category_id, description, price, compare_at_price, discount_pct, image_url, stock, tag, is_featured)
SELECT v.slug, v.name, v.brand, c.id, v.descr, v.price, v.cmp, v.disc, v.img, v.stock, v.tag, v.feat
FROM c
JOIN (VALUES
-- ELECTRONICS (12)
('electronics','apple-vision-pro','Apple Vision Pro','Apple','Spatial computing headset with dual 4K micro-OLED.',3499.00,3699.00,5,'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80',12,'Spatial',true),
('electronics','sony-wh1000xm6','WH-1000XM6','Sony','Industry-leading noise cancelling over-ear headphones.',449.00,499.00,10,'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',40,'Audio',true),
('electronics','macbook-pro-16-m5','MacBook Pro 16 M5','Apple','M5 Max chip, 36GB unified memory, Liquid Retina XDR.',2999.00,NULL,0,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',18,'Pro',true),
('electronics','samsung-s26-ultra','Galaxy S26 Ultra','Samsung','200MP camera, Snapdragon 8 Gen 5, S-Pen.',1299.00,1399.00,7,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',25,'Flagship',false),
('electronics','logitech-mx-master-4s','MX Master 4S','Logitech','Precision mouse with MagSpeed scrolling.',129.00,NULL,0,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',80,'Precision',false),
('electronics','sonos-era-300','Sonos Era 300','Sonos','Spatial audio smart speaker.',449.00,NULL,0,'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',30,'Audio',false),
('electronics','dell-xps-14-oled','XPS 14 OLED','Dell','3.2K OLED touch, Core Ultra 9.',1899.00,2099.00,9,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',15,'Laptop',false),
('electronics','jbl-charge-6','Charge 6 Speaker','JBL','Portable waterproof Bluetooth speaker.',199.00,229.00,13,'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',60,'Portable',false),
('electronics','bose-qc-ultra-earbuds','QC Ultra Earbuds','Bose','Immersive audio, world-class ANC.',299.00,NULL,0,'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80',55,'Earbuds',false),
('electronics','canon-eos-r5-mkii','EOS R5 Mk II','Canon','45MP stacked sensor, 8K RAW video.',4299.00,NULL,0,'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80',8,'Camera',true),
('electronics','samsung-odyssey-g9','Odyssey OLED G9','Samsung','49" dual-QHD curved gaming display.',1599.00,1799.00,11,'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80',10,'Display',false),
('electronics','ipad-pro-m4','iPad Pro M4 13"','Apple','Ultra Retina XDR tandem OLED.',1299.00,NULL,0,'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80',22,'Tablet',false),
-- FASHION (12)
('fashion','aime-wool-topcoat','Wool Topcoat','Aimé Leon Dore','Italian wool, half-canvas construction.',895.00,NULL,0,'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',14,'Outerwear',true),
('fashion','acne-denim-1996','Denim 1996','Acne Studios','Rigid Japanese selvedge denim.',320.00,NULL,0,'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',45,'Denim',false),
('fashion','stussy-8ball-knit','8 Ball Knit','Stüssy','Heavyweight cotton intarsia knit.',180.00,NULL,0,'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',32,'Knitwear',false),
('fashion','carhartt-detroit','Detroit Jacket','Carhartt WIP','12oz cotton canvas, blanket-lined.',249.00,NULL,0,'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',40,'Workwear',false),
('fashion','apc-petit-standard','Petit New Standard','A.P.C.','Raw selvedge denim, slim taper.',225.00,NULL,0,'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80',28,'Denim',false),
('fashion','our-legacy-box-shirt','Box Shirt','Our Legacy','Oversized cotton poplin shirt.',290.00,NULL,0,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',22,'Shirt',false),
('fashion','lemaire-twisted-pant','Twisted Pant','Lemaire','Soft draped wool blend.',520.00,NULL,0,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',18,'Trouser',true),
('fashion','loro-cashmere-crew','Cashmere Crew','Loro Piana','Baby cashmere crewneck.',1490.00,NULL,0,'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=900&q=80',10,'Knitwear',false),
('fashion','sunspel-riviera-tee','Riviera Tee','Sunspel','Long-staple cotton tee.',95.00,NULL,0,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',120,'Tee',false),
('fashion','patagonia-r1-air','R1 Air Hoody','Patagonia','Recycled merino blend grid fleece.',179.00,NULL,0,'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80',38,'Fleece',false),
('fashion','drakes-linen-camp','Linen Camp Shirt','Drake''s','Irish linen open-collar shirt.',265.00,NULL,0,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',26,'Shirt',false),
('fashion','norse-aros-chino','Aros Chino','Norse Projects','Slim stretch cotton chino.',180.00,200.00,10,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',34,'Trouser',false),
-- FOOTWEAR (12)
('footwear','nike-alphafly-3','Alphafly 3','Nike','Carbon-plated marathon racer.',285.00,NULL,0,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',24,'Running',true),
('footwear','adidas-samba-og','Samba OG','Adidas','Black leather with gum sole.',100.00,NULL,0,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',80,'Lifestyle',true),
('footwear','puma-speedcat','Speedcat OG','Puma','Low-profile suede racing shoe.',100.00,NULL,0,'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',55,'Lifestyle',false),
('footwear','newbalance-1906r','1906R','New Balance','Abzorb cushioning, mesh upper.',150.00,NULL,0,'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80',60,'Lifestyle',false),
('footwear','asics-kayano-31','Gel-Kayano 31','Asics','Stability daily trainer.',165.00,NULL,0,'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80',45,'Running',false),
('footwear','hoka-clifton-10','Clifton 10','Hoka','Plush max-cushion road shoe.',150.00,NULL,0,'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',50,'Running',false),
('footwear','on-cloudmonster-2','Cloudmonster 2','On','Maximalist CloudTec® cushioning.',180.00,NULL,0,'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=900&q=80',40,'Running',false),
('footwear','salomon-xt-6','XT-6','Salomon','Technical trail-running cult classic.',200.00,220.00,9,'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',35,'Trail',true),
('footwear','vans-old-skool','Old Skool 36','Vans','Heritage canvas-suede skate shoe.',75.00,NULL,0,'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',120,'Skate',false),
('footwear','converse-chuck-70-hi','Chuck 70 Hi','Converse','Premium-canvas high-top.',85.00,NULL,0,'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=900&q=80',90,'Lifestyle',false),
('footwear','birkenstock-boston','Boston Suede','Birkenstock','Cork-latex footbed clog.',160.00,NULL,0,'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80',70,'Comfort',false),
('footwear','cp-achilles-low','Achilles Low','Common Projects','Italian leather minimalist sneaker.',445.00,NULL,0,'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',20,'Premium',false),
-- BEAUTY (12)
('beauty','aesop-resurrection-hand','Resurrection Hand Wash','Aesop','Mandarin, rosemary, cedar.',45.00,NULL,0,'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=900&q=80',100,'Cleanse',false),
('beauty','le-labo-santal-33','Santal 33 EDP 50ml','Le Labo','Iconic woody amber fragrance.',225.00,NULL,0,'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',45,'Fragrance',true),
('beauty','byredo-mojave-ghost','Mojave Ghost 100ml','Byredo','Powdery, ambrette-led fragrance.',265.00,NULL,0,'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',30,'Fragrance',false),
('beauty','la-mer-creme','Crème de la Mer 60ml','La Mer','Miracle Broth™ moisturiser.',390.00,NULL,0,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',25,'Skincare',true),
('beauty','sunday-riley-good-genes','Good Genes Lactic Acid','Sunday Riley','Smooths, brightens, plumps.',122.00,NULL,0,'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',60,'Skincare',false),
('beauty','drunk-elephant-cpolypeptide','C-Firma Day Serum','Drunk Elephant','Vitamin C-ferulic antioxidant complex.',80.00,NULL,0,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',75,'Skincare',false),
('beauty','dyson-airwrap','Airwrap Multi-styler','Dyson','Coanda-effect styling for all hair types.',599.00,NULL,0,'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=80',20,'Hair',true),
('beauty','olaplex-no3','No.3 Hair Perfector','Olaplex','At-home bond builder treatment.',30.00,NULL,0,'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80',150,'Hair',false),
('beauty','charlotte-tilbury-pillow-talk','Pillow Talk Lipstick','Charlotte Tilbury','Cult nude-pink matte revolution.',38.00,NULL,0,'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',200,'Makeup',false),
('beauty','rare-beauty-blush','Soft Pinch Liquid Blush','Rare Beauty','Buildable, weightless colour.',23.00,NULL,0,'https://images.unsplash.com/photo-1631214540242-3cd62fe22d2c?auto=format&fit=crop&w=900&q=80',180,'Makeup',false),
('beauty','glossier-balm-dotcom','Balm Dotcom','Glossier','Multi-purpose skin salve.',16.00,NULL,0,'https://images.unsplash.com/photo-1599733589046-8a8c41b22d22?auto=format&fit=crop&w=900&q=80',300,'Lip',false),
('beauty','diptyque-baies-candle','Baies Candle 190g','Diptyque','Blackcurrant and Bulgarian rose.',76.00,NULL,0,'https://images.unsplash.com/photo-1602874801006-4d8d6c75e9a5?auto=format&fit=crop&w=900&q=80',55,'Candle',false),
-- HOME (12)
('home','hay-pao-lamp','Pao Steel Lamp','HAY','Powder-coated steel portable lamp.',279.00,NULL,0,'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',24,'Lighting',true),
('home','muuto-fiber-chair','Fiber Chair','Muuto','Wood-fibre composite shell.',495.00,NULL,0,'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',16,'Seating',false),
('home','vitra-eames-lcw','Eames LCW','Vitra','Moulded plywood lounge chair.',1290.00,NULL,0,'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',8,'Seating',true),
('home','menu-jwda-lamp','JWDA Portable Lamp','Audo','Travertine cordless lamp.',329.00,NULL,0,'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80',18,'Lighting',false),
('home','gubi-bestlite-bl5','Bestlite BL5','Gubi','Iconic wall-mount task lamp.',649.00,NULL,0,'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',12,'Lighting',false),
('home','flos-ic-t1','IC Lights T1','Flos','Blown-glass globe table lamp.',595.00,NULL,0,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',14,'Lighting',false),
('home','artek-stool-60','Stool 60','Artek','Alvar Aalto, three solid birch legs.',285.00,NULL,0,'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80',30,'Seating',false),
('home','tradition-flowerpot-vp9','Flowerpot VP9','&Tradition','Rechargeable portable lamp.',290.00,NULL,0,'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',26,'Lighting',false),
('home','carl-hansen-ch24','CH24 Wishbone','Carl Hansen & Søn','Hans Wegner classic, oak + paper cord.',995.00,NULL,0,'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',10,'Seating',true),
('home','fritz-hansen-series-7','Series 7 Chair','Fritz Hansen','Arne Jacobsen moulded plywood.',795.00,NULL,0,'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=900&q=80',15,'Seating',false),
('home','string-pocket-shelf','Pocket Shelf','String Furniture','Wall-mounted modular shelving.',195.00,NULL,0,'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',40,'Storage',false),
('home','marimekko-unikko-throw','Unikko Throw','Marimekko','Cotton-wool poppy print throw.',225.00,NULL,0,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',32,'Textile',false),
-- ACCESSORIES (12)
('accessories','bellroy-note-sleeve','Note Sleeve Wallet','Bellroy','Slim leather bifold.',89.00,NULL,0,'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',80,'Wallet',false),
('accessories','persol-714-folding','714 Folding Sunglasses','Persol','Steve McQueen''s folding shades.',430.00,NULL,0,'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',22,'Eyewear',true),
('accessories','tudor-black-bay-58','Black Bay 58','Tudor','39mm in-house dive watch.',3950.00,NULL,0,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',6,'Watch',true),
('accessories','rayban-meta-wayfarer','Meta Wayfarer','Ray-Ban','Smart glasses with built-in cameras.',329.00,NULL,0,'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80',40,'Eyewear',false),
('accessories','oakley-sutro-lite','Sutro Lite','Oakley','Cycling shield sunglasses.',191.00,NULL,0,'https://images.unsplash.com/photo-1556306510-31ca0fbf0f0c?auto=format&fit=crop&w=900&q=80',55,'Eyewear',false),
('accessories','tumi-alpha-backpack','Alpha Backpack','Tumi','Ballistic nylon laptop backpack.',595.00,NULL,0,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',28,'Bag',false),
('accessories','away-carryon-aluminum','Carry-On Aluminum','Away','Anodised aluminum hardshell.',595.00,NULL,0,'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80',20,'Travel',true),
('accessories','montblanc-149','Meisterstück 149','Montblanc','Iconic fountain pen, 14k nib.',945.00,NULL,0,'https://images.unsplash.com/photo-1583485088034-697b5bc36b92?auto=format&fit=crop&w=900&q=80',15,'Pen',false),
('accessories','mujjo-leather-wallet-case','Leather Wallet Case','Mujjo','Vegetable-tanned leather iPhone case.',79.00,NULL,0,'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80',65,'Case',false),
('accessories','filson-original-briefcase','Original Briefcase','Filson','Twill + bridle leather.',525.00,NULL,0,'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',18,'Bag',false),
('accessories','apple-watch-ultra-3','Watch Ultra 3','Apple','49mm titanium, precision dual-frequency GPS.',799.00,NULL,0,'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',35,'Watch',false),
('accessories','rimowa-essential-cabin','Essential Cabin','Rimowa','Polycarbonate signature grooved shell.',775.00,NULL,0,'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=80',24,'Travel',false),
-- BOOKS (12)
('books','atomic-habits','Atomic Habits','James Clear','Tiny changes, remarkable results.',18.00,27.00,33,'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',200,'Bestseller',true),
('books','the-creative-act','The Creative Act','Rick Rubin','A way of being.',22.00,30.00,27,'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=900&q=80',150,'Essay',true),
('books','sapiens','Sapiens','Yuval Noah Harari','A brief history of humankind.',16.00,22.00,27,'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',180,'History',false),
('books','thinking-fast-slow','Thinking, Fast and Slow','Daniel Kahneman','Two systems that drive the way we think.',17.00,NULL,0,'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=900&q=80',140,'Psychology',false),
('books','show-your-work','Show Your Work!','Austin Kleon','10 ways to share your creativity.',12.00,NULL,0,'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',110,'Creativity',false),
('books','dune','Dune','Frank Herbert','The desert planet of Arrakis.',14.00,NULL,0,'https://images.unsplash.com/photo-1531901599143-df5010ab9438?auto=format&fit=crop&w=900&q=80',95,'Fiction',true),
('books','project-hail-mary','Project Hail Mary','Andy Weir','A lone astronaut. An impossible mission.',16.00,NULL,0,'https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?auto=format&fit=crop&w=900&q=80',120,'Sci-Fi',false),
('books','klara-and-the-sun','Klara and the Sun','Kazuo Ishiguro','From the Nobel laureate.',15.00,NULL,0,'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80',88,'Fiction',false),
('books','tomorrow-x3','Tomorrow, and Tomorrow, and Tomorrow','Gabrielle Zevin','Love, friendship, and video games.',17.00,NULL,0,'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=900&q=80',105,'Fiction',false),
('books','the-design-of-everyday','The Design of Everyday Things','Don Norman','Foundational text on design thinking.',19.00,NULL,0,'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=900&q=80',75,'Design',true),
('books','the-pragmatic-programmer','The Pragmatic Programmer','Hunt & Thomas','From journeyman to master, 20th-anniv ed.',35.00,NULL,0,'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80',65,'Tech',false),
('books','steal-like-an-artist','Steal Like an Artist','Austin Kleon','10 things nobody told you about being creative.',11.00,NULL,0,'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',130,'Creativity',false),
-- FITNESS (12)
('fitness','hyperice-hypervolt-3','Hypervolt 3','Hyperice','Quiet percussive massage device.',329.00,NULL,0,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',40,'Recovery',true),
('fitness','garmin-fenix-8-pro','Fenix 8 Pro','Garmin','Multisport AMOLED training watch.',999.00,NULL,0,'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',22,'Wearable',true),
('fitness','whoop-50','5.0 Strap','Whoop','Continuous recovery + strain tracking.',239.00,NULL,0,'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80',60,'Wearable',false),
('fitness','rogue-ohio-bar','Ohio Bar','Rogue Fitness','190k psi steel barbell.',315.00,NULL,0,'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',25,'Strength',false),
('fitness','theragun-pro-plus','Theragun Pro Plus','Therabody','Pro-grade therapy device.',599.00,NULL,0,'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',18,'Recovery',false),
('fitness','lululemon-align-mat','Align Mat 5mm','Lululemon','Natural rubber yoga mat.',98.00,NULL,0,'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80',80,'Yoga',false),
('fitness','eight-sleep-pod-4','Pod 4 Ultra','Eight Sleep','Active grid + base cooling/heating.',2495.00,NULL,0,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',10,'Sleep',true),
('fitness','concept2-rowerg','RowErg PM5','Concept2','Air-resistance gold-standard rower.',1090.00,NULL,0,'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80',12,'Cardio',false),
('fitness','peloton-bike-plus','Bike+ 2025','Peloton','Auto-resistance + rotating HD touchscreen.',2495.00,NULL,0,'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=900&q=80',14,'Cardio',false),
('fitness','manduka-pro-black','Pro Black Mat 6mm','Manduka','Lifetime-guarantee dense yoga mat.',138.00,NULL,0,'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=80',65,'Yoga',false),
('fitness','bowflex-1090','SelectTech 1090','Bowflex','10–90 lb adjustable dumbbells.',849.00,NULL,0,'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',16,'Strength',false),
('fitness','garmin-hrm-pro','HRM-Pro Plus','Garmin','Premium chest heart-rate strap.',129.99,NULL,0,'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=900&q=80',50,'Wearable',false)
) AS v(cat_slug, slug, name, brand, descr, price, cmp, disc, img, stock, tag, feat)
ON c.slug = v.cat_slug;

-- ============ SEED COUPONS ============
INSERT INTO public.coupons (code, description, discount_pct, min_subtotal) VALUES
('WELCOME10','10% off your first order',10,0),
('AETHER20','20% off orders over $200',20,200),
('FREESHIP','Free shipping on any order',NULL,0);
