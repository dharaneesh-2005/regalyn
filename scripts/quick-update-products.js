import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

// Use the same DATABASE_URL that the server uses
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log("Using local connection...");
}

const sql = postgres(DATABASE_URL || 'postgresql://localhost:5432/mydb', { ssl: 'require' });

async function updateProducts() {
  try {
    console.log("Updating products to Regalyn watches...");
    
    // Update product 7 - Classic Automatic
    await sql`
      UPDATE products SET 
        name = 'Regalyn Classic Automatic',
        slug = 'regalyn-classic-automatic',
        description = 'The Regalyn Classic Automatic represents the pinnacle of Swiss watchmaking excellence. Featuring a self-winding movement, sapphire crystal, and premium stainless steel case, this timepiece embodies timeless elegance and precision craftsmanship.',
        short_description = 'Swiss automatic movement with 42-hour power reserve',
        price = '25000.00',
        compare_price = '28000.00',
        badge = 'Swiss Made',
        category = 'Automatic',
        image_url = 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        specifications = 'Movement: Swiss ETA 2824-2 Automatic | Case: 40mm Stainless Steel | Crystal: Sapphire with AR coating | Water Resistance: 100m | Power Reserve: 42 hours',
        features = 'Anti-magnetic resistance, Date display, Luminous hands and markers, Screw-down crown, Swiss leather strap',
        size_options = ARRAY['38mm', '40mm', '42mm'],
        size_prices = '{"38mm": "23000.00", "40mm": "25000.00", "42mm": "27000.00"}',
        rating = 4.8,
        review_count = 24,
        featured = true
      WHERE id = 7;
    `;

    // Update product 8 - Sport Chronograph  
    await sql`
      UPDATE products SET 
        name = 'Regalyn Sport Chronograph',
        slug = 'regalyn-sport-chronograph',
        description = 'Built for the modern adventurer, the Regalyn Sport Chronograph combines rugged durability with sophisticated styling. Water-resistant to 200m with a precise quartz movement and luminous hands for optimal visibility in any condition.',
        short_description = 'Precision chronograph with sports styling',
        price = '18000.00',
        compare_price = '22000.00',
        badge = 'Sport',
        category = 'Sport',
        image_url = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        specifications = 'Movement: Swiss Quartz Chronograph | Case: 42mm Titanium | Crystal: Sapphire | Water Resistance: 200m | Functions: Chronograph, Date',
        features = 'Chronograph function, Tachymeter scale, Luminous coating, Sport bracelet, Screw-down pushers',
        size_options = ARRAY['40mm', '42mm', '44mm'],
        size_prices = '{"40mm": "16000.00", "42mm": "18000.00", "44mm": "20000.00"}',
        rating = 4.6,
        review_count = 18,
        featured = true
      WHERE id = 8;
    `;

    // Update product 9 - Heritage Dress Watch
    await sql`
      UPDATE products SET 
        name = 'Regalyn Heritage Dress Watch',
        slug = 'regalyn-heritage-dress-watch',
        description = 'The Heritage Dress Watch pays homage to classical horology with its refined design and meticulous craftsmanship. Featuring a slim profile, genuine alligator leather strap, and elegant Roman numerals perfect for formal occasions.',
        short_description = 'Classic dress watch with heritage design',
        price = '32000.00',
        compare_price = '36000.00',
        badge = 'Heritage',
        category = 'Dress',
        image_url = 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        specifications = 'Movement: Swiss Manual Wind | Case: 38mm Rose Gold | Crystal: Sapphire | Water Resistance: 30m | Dial: Classic Roman Numerals',
        features = 'Hand-polished case, Alligator leather strap, Roman numerals, Small seconds subdial, Exhibition caseback',
        size_options = ARRAY['36mm', '38mm', '40mm'],
        size_prices = '{"36mm": "30000.00", "38mm": "32000.00", "40mm": "34000.00"}',
        rating = 4.9,
        review_count = 32,
        featured = true
      WHERE id = 9;
    `;

    // Update product 10 - Limited Edition
    await sql`
      UPDATE products SET 
        name = 'Regalyn Limited Edition Platinum',
        slug = 'regalyn-limited-edition-platinum',
        description = 'A masterpiece of limited production, this exclusive timepiece features premium platinum construction, hand-finished details, and a unique serial number. Only 500 pieces worldwide, making it a true collector investment.',
        short_description = 'Limited edition luxury timepiece',
        price = '85000.00',
        compare_price = '95000.00',
        badge = 'Limited',
        category = 'Limited Edition',
        image_url = 'https://images.unsplash.com/photo-1606859970980-4d9bc6ee8097?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        specifications = 'Movement: Swiss In-house Automatic | Case: 41mm Platinum | Crystal: Sapphire | Water Resistance: 50m | Limited: 500 pieces',
        features = 'Hand-engraved case, Platinum bracelet, Diamond hour markers, Individual serial number, Presentation box',
        size_options = ARRAY['41mm'],
        size_prices = '{"41mm": "85000.00"}',
        rating = 5.0,
        review_count = 8,
        featured = true
      WHERE id = 10;
    `;

    console.log("Successfully updated all products to premium Regalyn watches!");

  } catch (error) {
    console.error("Error updating products:", error);
  } finally {
    await sql.end();
  }
}

updateProducts();