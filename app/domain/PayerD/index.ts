import * as S from '@fp-ts/schema';
import { commonNameSchema } from '~/module/schema/datas';

export namespace PayerD {
  export const nameSchema = commonNameSchema({ max: 6 });

  export const nameDecode = S.decode(nameSchema);
}
