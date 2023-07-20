import { Document } from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './entities/user.entity';

export type UserDocument = Document & User;

export const UserSchema = SchemaFactory.createForClass(User);
