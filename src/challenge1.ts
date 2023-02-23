import { z } from 'zod';
import { ObjectId } from 'mongodb';

const checker = z
  .instanceof(ObjectId)
  .or(z.string())
  .refine((value) => {
    try {
      const returnValue = !value ? undefined : new ObjectId(value);

      return {
        _id: returnValue,
      };
    } catch (error) {
      return false;
    }
  })
  .transform((value) => {
    const returnValue = !value ? undefined : new ObjectId(value);

    return {
      _id: returnValue,
    };
  });

type correctType = z.infer<typeof checker>;
type correctInputType = z.input<typeof checker>;
type correctOutputType = z.output<typeof checker>;
// all 3 of them should emit:
// {
// ...<other arbitrary attributes>...
// _id?: ObjectId | undefined;
// }

//both invocations should not fail
const actualNodeDataFromString = checker.parse({
  _id: 'random hex string here',
});
const actualNodeDataFromchecker = checker.parse({
  _id: ObjectId.createFromHexString('hex string here'),
});

//both invocations should return something that emits
// {
// ...
// _id?: ObjectId | undefined;
// }
