import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Cart extends Document {
  @Field()
  @Prop({ required: true, unique: true })
  identifier: string;

  @Field()
  @Prop()
  collectionName: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  image_url: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
