import { Args, ID, Mutation, Query } from '@nestjs/graphql';
import { Cart } from './cart.schema';
import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CartHandler implements OnApplicationBootstrap {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}
  public onApplicationBootstrap() {}

  @Query(() => [Cart])
  public async cartList(): Promise<Cart[]> {
    console.log(`calling cartList`);

    return this.cartModel.find().exec();
  }

  @Query(() => Cart, { nullable: true })
  public async cartById(
    @Args('identifier', { type: () => ID }) identifier: string,
  ): Promise<Cart> {
    console.log(`calling cartById`, { identifier });

    return this.cartModel.findOne({ identifier: identifier }).exec();
  }

  @Mutation(() => Cart)
  public async cartCreat(
    @Args('identifier', { type: () => ID }) identifier: string,
    @Args('collectionName') collectionName: string,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('image_url') image_url: string,
  ) {
    console.log(`calling cartCreate`, {
      identifier,
      collectionName,
      name,
      description,
      image_url,
    });

    const newCart = new this.cartModel({
      identifier,
      collectionName,
      name,
      description,
      image_url,
    });

    try {
      return await newCart.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error code (e.g., trying to save a non-unique `identifier`)
        throw new BadRequestException(
          'A cart with the given identifier already exists.',
        );
      } else if (error.name === 'ValidationError') {
        // Other Mongoose validation error(s)
        const messages = Object.values(error.errors).map(
          (val: any) => val?.message,
        );
        throw new BadRequestException(
          `Validation failed: ${messages.join(', ')}`,
        );
      } else {
        // Generic error fallback
        throw new BadRequestException(
          'Failed to create cart due to an unexpected error.',
        );
      }
    }
  }

  @Mutation(() => Boolean)
  public async cartRemoveById(
    @Args('identifier', { type: () => ID }) identifier: string,
  ): Promise<boolean> {
    console.log(`remove cartById`, { identifier });

    const result = await this.cartModel
      .deleteOne({ identifier: identifier })
      .exec();
    return result.deletedCount > 0;
  }

  @Mutation(() => Boolean)
  public async cartClear() {
    console.log(`calling cartClear`);

    await this.cartModel.deleteMany({}).exec();
    return true;
  }
}
