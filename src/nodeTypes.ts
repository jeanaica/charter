import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ComponentNodeDataType = z.object({
  _id: z.instanceof(ObjectId),
});

export const SubsystemNodeDataType = z.object({
  _id: z.instanceof(ObjectId),
});
