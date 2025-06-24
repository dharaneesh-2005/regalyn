import { PostgreSQLStorage } from '../server/postgresql';

async function convertProductsToWatches() {
  const storage = new PostgreSQLStorage(process.env.DATABASE_URL!);
  
  // Get all products
  const products = await storage.getProducts();
  console.log('Current products:', products.length);
  
  // Convert each product to a watch
  for (const product of products) {
    let newName = '';
    let newDescription = '';
    let newPrice = 0;
    let newCategory = '';
    let newSlug = '';
    
    // Convert based on existing product
    if (product.name.includes('Little Millet')) {
      newName = 'Regalyn Classic Elegance';
      newDescription = 'Swiss-made luxury timepiece featuring a classic design with gold-plated stainless steel case, sapphire crystal glass, and automatic movement. Perfect for formal occasions and business meetings.';
      newPrice = 89999; // ₹89,999 (was $120 converted to INR)
      newCategory = 'Classic Collection';
      newSlug = 'regalyn-classic-elegance';
    } else if (product.name.includes('Foxtail')) {
      newName = 'Regalyn Sport Chronograph';
      newDescription = 'Professional sport chronograph with titanium case, water resistance up to 300m, and precision quartz movement. Built for active lifestyles and outdoor adventures.';
      newPrice = 124999; // ₹124,999
      newCategory = 'Sport Collection';
      newSlug = 'regalyn-sport-chronograph';
    } else if (product.name.includes('Barnyard')) {
      newName = 'Regalyn Royal Heritage';
      newDescription = 'Limited edition luxury watch with 18k gold case, diamond-set bezel, and hand-crafted leather strap. A statement piece for discerning collectors.';
      newPrice = 299999; // ₹299,999
      newCategory = 'Limited Edition';
      newSlug = 'regalyn-royal-heritage';
    } else {
      newName = 'Regalyn Modern Precision';
      newDescription = 'Contemporary design meets Swiss precision. Features ceramic bezel, automatic movement, and scratch-resistant sapphire crystal. Perfect for modern professionals.';
      newPrice = 149999; // ₹149,999
      newCategory = 'Classic Collection';
      newSlug = 'regalyn-modern-precision';
    }
    
    // Parse existing weight prices and convert to watch variants
    let newWeightPrices = '{}';
    try {
      const watchVariants = {
        'Steel': { price: newPrice.toString(), comparePrice: Math.round(newPrice * 1.2).toString() },
        'Gold': { price: Math.round(newPrice * 1.5).toString(), comparePrice: Math.round(newPrice * 1.8).toString() }
      };
      newWeightPrices = JSON.stringify(watchVariants);
    } catch (e) {
      console.log('Error creating watch variants for product', product.id);
    }
    
    // Update the product
    await storage.updateProduct(product.id, {
      name: newName,
      description: newDescription,
      price: newPrice,
      category: newCategory,
      slug: newSlug,
      weightPrices: newWeightPrices,
      featured: true
    });
    
    console.log(`Updated product ${product.id}: ${newName}`);
  }
  
  console.log('All products converted to watches with INR pricing');
  process.exit(0);
}

convertProductsToWatches().catch(console.error);