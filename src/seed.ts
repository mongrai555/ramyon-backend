import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RestaurantsService } from './restaurants/restaurants.service';
import { AuthService } from './auth/auth.service';
import { TablesService } from './tables/tables.service';
import { CategoriesService } from './categories/categories.service';
import { MenuItemsService } from './menu-items/menu-items.service';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Seeding database...');

  try {
    const connection = app.get<Connection>(getConnectionToken());

    // Clear existing database collections
    console.log('Clearing existing collections...');
    const collections = connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    const restaurantsService = app.get(RestaurantsService);
    const authService = app.get(AuthService);
    const tablesService = app.get(TablesService);
    const categoriesService = app.get(CategoriesService);
    const menuItemsService = app.get(MenuItemsService);

    // 1. Create a Restaurant
    console.log('Creating restaurant profile...');
    const restaurant = await restaurantsService.create({
      name: 'Tasty QR Bistro',
      description: 'Gourmet foods and refreshing drinks right at your table.',
      address: '123 Food Street, Bangkok',
      contactNumber: '02-123-4567',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    });
    const restaurantId = restaurant._id.toString();
    console.log(`Restaurant created: ${restaurant.name} (${restaurantId})`);

    // 2. Create Admin and Staff users
    console.log('Creating users...');
    const admin = await authService.register('admin', 'admin123', 'admin', restaurantId);
    const staff = await authService.register('staff', 'staff123', 'staff', restaurantId);
    console.log(`Admin created: ${admin.username} (password: admin123)`);
    console.log(`Staff created: ${staff.username} (password: staff123)`);

    // 3. Create Tables
    console.log('Creating tables...');
    const table1 = await tablesService.create({ number: 'Table 1', restaurantId });
    const table2 = await tablesService.create({ number: 'Table 2', restaurantId });
    const table3 = await tablesService.create({ number: 'Table 3', restaurantId });
    console.log(`Tables created: T1 (${table1._id}), T2 (${table2._id}), T3 (${table3._id})`);

    // 4. Create Categories
    console.log('Creating categories...');
    const catMains = await categoriesService.create({
      name: 'Main Course',
      description: 'Filling and delicious entrees',
      restaurantId,
      order: 1,
    });
    const catAppetizers = await categoriesService.create({
      name: 'Appetizers',
      description: 'Finger foods to start your meal',
      restaurantId,
      order: 2,
    });
    const catDrinks = await categoriesService.create({
      name: 'Drinks',
      description: 'Hot and cold beverages',
      restaurantId,
      order: 3,
    });

    // 5. Create Menu Items
    console.log('Creating menu items...');
    // Mains
    await menuItemsService.create({
      name: 'Basil Pork Rice (Pad Kra Prow)',
      description: 'Classic Thai spicy stir-fried basil with minced pork, served with jasmine rice and a fried egg.',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1562607378-2721867e370a?w=500',
      isAvailable: true,
      categoryId: catMains._id.toString(),
      restaurantId,
    });
    await menuItemsService.create({
      name: 'Pad Thai Shrimp',
      description: 'Stir-fried rice noodles with fresh shrimp, tofu, egg, bean sprouts, and peanuts in sweet tamarind sauce.',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?w=500',
      isAvailable: true,
      categoryId: catMains._id.toString(),
      restaurantId,
    });

    // Appetizers
    await menuItemsService.create({
      name: 'Crispy Spring Rolls',
      description: 'Vegetarian spring rolls fried until golden brown, served with sweet chili dipping sauce.',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
      isAvailable: true,
      categoryId: catAppetizers._id.toString(),
      restaurantId,
    });

    // Drinks
    await menuItemsService.create({
      name: 'Thai Iced Tea',
      description: 'Sweet, creamy, and refreshing Thai tea brewed with black tea and sweetened condensed milk.',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
      isAvailable: true,
      categoryId: catDrinks._id.toString(),
      restaurantId,
    });
    await menuItemsService.create({
      name: 'Coconut Water',
      description: 'Fresh young coconut juice served chilled.',
      price: 70,
      imageUrl: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500',
      isAvailable: true,
      categoryId: catDrinks._id.toString(),
      restaurantId,
    });

    console.log('Database seeded successfully! 🎉');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
