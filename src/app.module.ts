import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TablesModule } from './tables/tables.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { BillsModule } from './bills/bills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // .env.production wins when NODE_ENV=production, .env is the fallback
      // for local work and for hosts that inject real environment variables.
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error(
            'MONGODB_URI is not set. Copy .env.example to .env and fill it in.',
          );
        }
        return {
          uri,
          // Atlas can be a few hundred ms away; fail loudly instead of hanging
          serverSelectionTimeoutMS: 10000,
          retryWrites: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    TablesModule,
    CategoriesModule,
    MenuItemsModule,
    OrdersModule,
    BillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
