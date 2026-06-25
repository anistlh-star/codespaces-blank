// ecommerce/backend/seedCategories.js
import mongoose from "mongoose";
import Category from "./models/Category.js"; 
import dotenv from "dotenv";

dotenv.config();

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Category Seeding...");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Existing categories cleared.");

    const categories = [
      {
        name: "Smartphones",
        description: "Latest smartphones from top global brands with cutting-edge mobile processors and camera systems.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: true,
      },
      {
        name: "Mobile Accessories",
        description: "Premium fast chargers, durable protective cases, screen guards, and high-speed multi-port docks.",
        image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: false,
      },
      {
        name: "Consoles",
        description: "Next-generation gaming hardware platforms, home entertainment systems, and special edition bundles.",
        image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: true,
      },
      {
        name: "Video Games",
        description: "Bestselling physical and digital action, sports, RPG, and strategy software titles across major platforms.",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: true,
      },
      {
        name: "Watches",
        description: "Advanced luxury and sports smartwatches featuring standalone cell connectivity and bio-metric metrics tracking.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: false,
      },
      {
        name: "Headphones",
        description: "Studio-grade over-ear audio gear and true wireless earbuds with high-fidelity active hybrid noise isolation.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        featured: true,
      },
    ];

    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();