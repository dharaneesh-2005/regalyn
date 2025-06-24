import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

// Load environment variables from .env file
dotenv.config();

async function migrateToWatches() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }
  
  console.log(`Connecting to database...`);
  const client = postgres(DATABASE_URL, { 
    ssl: 'require',
    max: 1
  });
  
  const db = drizzle(client);
  
  try {
    console.log("Adding watch-specific columns to products table...");
    
    // Add new watch-specific columns
    await db.execute(sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS specifications TEXT,
      ADD COLUMN IF NOT EXISTS features TEXT,
      ADD COLUMN IF NOT EXISTS size_options TEXT[],
      ADD COLUMN IF NOT EXISTS size_prices TEXT;
    `);
    
    console.log("Updating existing products to be watch-focused...");
    
    // Update existing products to be watches
    await db.execute(sql`
      UPDATE products SET 
        name = CASE 
          WHEN id = 7 THEN 'Regalyn Classic Automatic'
          WHEN id = 8 THEN 'Regalyn Sport Chronograph'
          WHEN id = 9 THEN 'Regalyn Heritage Dress Watch'
          WHEN id = 10 THEN 'Regalyn Limited Edition'
          ELSE name
        END,
        slug = CASE 
          WHEN id = 7 THEN 'regalyn-classic-automatic'
          WHEN id = 8 THEN 'regalyn-sport-chronograph'
          WHEN id = 9 THEN 'regalyn-heritage-dress-watch'
          WHEN id = 10 THEN 'regalyn-limited-edition'
          ELSE slug
        END,
        description = CASE 
          WHEN id = 7 THEN 'The Regalyn Classic Automatic represents the pinnacle of Swiss watchmaking excellence. Featuring a self-winding movement, sapphire crystal, and premium stainless steel case, this timepiece embodies timeless elegance and precision.'
          WHEN id = 8 THEN 'Built for the modern adventurer, the Regalyn Sport Chronograph combines rugged durability with sophisticated styling. Water-resistant to 200m with a precise quartz movement and luminous hands for optimal visibility.'
          WHEN id = 9 THEN 'The Heritage Dress Watch pays homage to classical horology with its refined design and meticulous craftsmanship. Featuring a slim profile, leather strap, and elegant Roman numerals for formal occasions.'
          WHEN id = 10 THEN 'A masterpiece of limited production, this exclusive timepiece features premium materials, hand-finished details, and a unique serial number. Only 500 pieces worldwide, making it a true collector''s item.'
          ELSE description
        END,
        short_description = CASE 
          WHEN id = 7 THEN 'Swiss automatic movement with 42-hour power reserve'
          WHEN id = 8 THEN 'Precision chronograph with sports styling'
          WHEN id = 9 THEN 'Classic dress watch with heritage design'
          WHEN id = 10 THEN 'Limited edition luxury timepiece'
          ELSE short_description
        END,
        category = CASE 
          WHEN id = 7 THEN 'Automatic'
          WHEN id = 8 THEN 'Sport'
          WHEN id = 9 THEN 'Dress'
          WHEN id = 10 THEN 'Limited Edition'
          ELSE 'Classic'
        END,
        price = CASE 
          WHEN id = 7 THEN '25000.00'
          WHEN id = 8 THEN '18000.00'
          WHEN id = 9 THEN '32000.00'
          WHEN id = 10 THEN '85000.00'
          ELSE price
        END,
        specifications = CASE 
          WHEN id = 7 THEN 'Movement: Swiss ETA 2824-2 Automatic | Case: 40mm Stainless Steel | Crystal: Sapphire with AR coating | Water Resistance: 100m | Power Reserve: 42 hours'
          WHEN id = 8 THEN 'Movement: Swiss Quartz Chronograph | Case: 42mm Titanium | Crystal: Sapphire | Water Resistance: 200m | Functions: Chronograph, Date'
          WHEN id = 9 THEN 'Movement: Swiss Manual Wind | Case: 38mm Rose Gold | Crystal: Sapphire | Water Resistance: 30m | Dial: Classic Roman Numerals'
          WHEN id = 10 THEN 'Movement: Swiss In-house Automatic | Case: 41mm Platinum | Crystal: Sapphire | Water Resistance: 50m | Limited: 500 pieces'
          ELSE specifications
        END,
        features = CASE 
          WHEN id = 7 THEN 'Anti-magnetic resistance, Date display, Luminous hands and markers, Screw-down crown, Swiss leather strap'
          WHEN id = 8 THEN 'Chronograph function, Tachymeter scale, Luminous coating, Sport bracelet, Screw-down pushers'
          WHEN id = 9 THEN 'Hand-polished case, Alligator leather strap, Roman numerals, Small seconds subdial, Exhibition caseback'
          WHEN id = 10 THEN 'Hand-engraved case, Platinum bracelet, Diamond hour markers, Individual serial number, Presentation box'
          ELSE features
        END,
        size_options = CASE 
          WHEN id = 7 THEN ARRAY['38mm', '40mm', '42mm']
          WHEN id = 8 THEN ARRAY['40mm', '42mm', '44mm']
          WHEN id = 9 THEN ARRAY['36mm', '38mm', '40mm']
          WHEN id = 10 THEN ARRAY['41mm']
          ELSE ARRAY['40mm', '42mm']
        END,
        size_prices = CASE 
          WHEN id = 7 THEN '{"38mm": "23000.00", "40mm": "25000.00", "42mm": "27000.00"}'
          WHEN id = 8 THEN '{"40mm": "16000.00", "42mm": "18000.00", "44mm": "20000.00"}'
          WHEN id = 9 THEN '{"36mm": "30000.00", "38mm": "32000.00", "40mm": "34000.00"}'
          WHEN id = 10 THEN '{"41mm": "85000.00"}'
          ELSE '{"40mm": "15000.00", "42mm": "17000.00"}'
        END
      WHERE id IN (7, 8, 9, 10);
    `);
    
    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await client.end();
  }
}

migrateToWatches();