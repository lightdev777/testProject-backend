import { Module } from '@nestjs/common';
import { CartHandler } from './cart.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  providers: [CartHandler],
})
export class CartModule {}
