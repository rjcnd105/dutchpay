import * as S from '@fp-ts/schema';
import * as E from '@fp-ts/core/Either';
import * as AST from '@fp-ts/schema/AST';
import type * as PR from '@fp-ts/schema/ParseResult';
import * as O from '@fp-ts/core/Option';
import * as ID from '@fp-ts/core/Identity';
import { compose, flow, pipe } from '@fp-ts/core/Function';
import {
  CustomId,
  DescriptionId,
  DocumentationId,
  ExamplesId,
  IdentifierId,
  JSONSchemaId,
  MessageId,
  TitleId,
} from '@fp-ts/schema/annotation/AST';
import type { LazyArg } from '@fp-ts/core/src/Function';
import type { NonEmptyReadonlyArray } from '@fp-ts/core/ReadonlyArray';
import { composeR } from '~/utils/fpUtils';

export interface ErrorData<T extends string> {
  message: string;
  code: T;
}

export const SchemaErrorId = '@fp-ts/schema/annotation/SchemaError' as const;

export const schemaError =
  <T extends string>(errorData: ErrorData<T>) =>
  <A>(self: S.Schema<A>): S.Schema<A> =>
    S.make(AST.setAnnotation(self.ast, SchemaErrorId, errorData));

const unknownError: ErrorData<'unknown'> = {
  code: 'unknown',
  message: '알 수 없는 에러가 발생했습니다.',
};

type GetAnnotation<T> = (annotated: AST.Annotated) => O.Option<T>;
const getError = AST.getAnnotation<ErrorData<string>>(SchemaErrorId);
const getMessage = AST.getAnnotation<LazyArg<string>>(MessageId);
const getTitle = AST.getAnnotation(TitleId);
const getIdentifier = AST.getAnnotation(IdentifierId);
const getDescription = AST.getAnnotation(DescriptionId);
const getJSONSchema = AST.getAnnotation(JSONSchemaId);
const getExamples = AST.getAnnotation(ExamplesId);
const getDocumentation = AST.getAnnotation(DocumentationId);
const getCustom = AST.getAnnotation(CustomId);

const getExpected = (ast: AST.Annotated) =>
  pipe(
    getIdentifier(ast),
    O.catchAll(() => getTitle(ast)),
    O.catchAll(() => getDescription(ast)),
  );

const getAnnotationX =
  <A>(getter: GetAnnotation<A>) =>
  (e: PR.ParseError): O.Option<A> => {
    switch (e._tag) {
      case 'Missing':
      case 'Index':
      case 'Unexpected':
        return O.none();
      case 'Key':
      case 'UnionMember': {
        for (const error of e.errors) {
          if (error._tag !== 'Type') continue;

          const annotation = getter(error.expected);
          if (O.isSome(annotation)) return annotation;
        }
        return O.none();
      }
      case 'Type': {
        return getter(e.expected);
      }
    }
  };

// 첫 번째 Annotation을 가져옴
export const getFirstAnnotationX = flow(
  getAnnotationX,
  composeR((errors: NonEmptyReadonlyArray<PR.ParseError>) => errors[0]),
);

const f = (a: 1) => (b: 2) => (c: 3) => 4 as const;

const df = flow(f, compose(compose(x => `${x * 2}`)));
df(1)(2)(3); /*?*/

// Right인 경우는 Schema에설정해 놓은 에러, Left인 경우는 defaultError로 구분할 수 있다.
export const firstErrorWithDefault = (defaultError: ErrorData<string>) =>
  flow(getFirstAnnotationX(getError), ID.map(E.fromOption(() => defaultError)));

// 위의 Right, Left 케이스를 하나로 합친다.
export const getFirstErrorWithDefault = flow(
  firstErrorWithDefault,
  compose(E.merge),
);

// ParseResult가 성공시 값 리턴, 실패시 getFirstErrorWithDefault 로 에러를 처리해서 가져온다
export const resultWithDefaultError = flow(
  getFirstErrorWithDefault,
  errorFn =>
    <A>(r: PR.ParseResult<A>) =>
      pipe(r, E.mapLeft(errorFn)),
);

// ParseResult로 에러 여부 판별. none인 경우 에러가 없음을 의미한다.
export const result2ErrorWithDefault = flow(
  getFirstErrorWithDefault,
  f =>
    <A>(r: PR.ParseResult<A>) =>
      pipe(E.getLeft(r), O.map(f)),
);

// 첫번째 Annotation의 메세지를 가져옴
export const getFirstMessage = getFirstAnnotationX(getMessage);

export const getPE2Message = (defaultMessage: LazyArg<string>) =>
  flow(
    getFirstMessage,
    E.fromOption(() => defaultMessage),
  );

export const getPE2MessageOrElse = flow(getPE2Message, f => flow(f, E.merge));

export const getPRFirstErrorMessageOrElse = flow(
  getPE2MessageOrElse,
  f =>
    <A>(r: PR.ParseResult<A>) =>
      pipe(E.getLeft(r), O.map(f)),
);

export const nameSchema = pipe(
  S.string,
  S.minLength(1),
  schemaError({
    code: '최소글자수미만',
    message: '한글자 이상 입력해줘',
  }),
  S.maxLength(8),
  schemaError({
    code: '최대글자수초과',
    message: '8글자 이하로 입력해줘',
  }),
  S.filter(s => !/[^\w\s]/.test(s)),
  schemaError({
    code: '특수문자불가',
    message: '특수문자는 사용할 수 없어',
  }),
);

export const amountSchema = pipe(
  S.string,
  S.transform(S.number, Number.parseInt, String.toString),
  S.filter(n => !Number.isNaN(n)),
  schemaError({
    code: '올바른형태아님',
    message: '숫자만 입력해줘',
  }),
  S.greaterThan(0),
  schemaError({
    message: '0원 넘게 입력해줘',
    code: '최소금액미만',
  }),
  S.lessThan(100000000),
  schemaError({
    message: '1억원 미만으로 입력해줘',
    code: '최대금액초과',
  }),
);

export const payerSchema = pipe(
  S.array(S.string),
  S.filter(v => v.length <= 10),
  schemaError({
    code: '최대인원초과',
    message: '최대 10명까지만 있을 수 있어',
  }),
  S.filter(v => v.length > 0),
  schemaError({
    code: '최소인원미만',
    message: '최소 1명은 있어야 해',
  }),
);

const amountFail1 = S.decode(amountSchema)('123456789');
result2ErrorWithDefault(unknownError)(amountFail1); /*?*/

const amountFail2 = S.decode(amountSchema)('천만원');
result2ErrorWithDefault(unknownError)(amountFail2); /*?*/

const amountFail3 = S.decode(amountSchema)('0');
result2ErrorWithDefault(unknownError)(amountFail3); /*?*/

const amountSuccess = S.decode(amountSchema)('12345678');
const amountSuccessCase =
  resultWithDefaultError(unknownError)(amountSuccess); /*?*/

const nameFail1 = S.decode(nameSchema)('123456789');
const nameFailCase = result2ErrorWithDefault(unknownError)(nameFail1); /*?*/

const nameFail2 = S.decode(nameSchema)('');
result2ErrorWithDefault(unknownError)(nameFail2); /*?*/

const nameFail3 = S.decode(nameSchema)('hihi!');
result2ErrorWithDefault(unknownError)(nameFail3); /*?*/

const nameSuccess = S.decode(nameSchema)('42');
const nameSuccessCase =
  result2ErrorWithDefault(unknownError)(nameSuccess); /*?*/

O.isSome(nameFailCase); /*?*/
O.isNone(nameSuccessCase); /*?*/

if (E.isRight(amountSuccessCase)) amountSuccessCase.right; /*?*/ // 12345678
