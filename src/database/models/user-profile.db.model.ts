import { Document, model, Model, Schema } from 'mongoose';

import { UserProfile } from '../../../shared/models';

export interface IUserProfileDbModel extends UserProfile, Document {}

export const UserProfileSchema = new Schema({
  email: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  roles: [String],
});

UserProfileSchema.methods.toJSON = function() {
  const instance = (this as IUserProfileDbModel).toObject();
  delete instance.password; // Remove the password field
  return instance;
};

export const UserProfileDbModel: Model<IUserProfileDbModel> = model<
  IUserProfileDbModel
>('user', UserProfileSchema);
