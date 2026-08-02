
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Organisation
 * 
 */
export type Organisation = $Result.DefaultSelection<Prisma.$OrganisationPayload>
/**
 * Model OrganisationUnit
 * 
 */
export type OrganisationUnit = $Result.DefaultSelection<Prisma.$OrganisationUnitPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organisations
 * const organisations = await prisma.organisation.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organisations
   * const organisations = await prisma.organisation.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.organisation`: Exposes CRUD operations for the **Organisation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organisations
    * const organisations = await prisma.organisation.findMany()
    * ```
    */
  get organisation(): Prisma.OrganisationDelegate<ExtArgs>;

  /**
   * `prisma.organisationUnit`: Exposes CRUD operations for the **OrganisationUnit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrganisationUnits
    * const organisationUnits = await prisma.organisationUnit.findMany()
    * ```
    */
  get organisationUnit(): Prisma.OrganisationUnitDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Organisation: 'Organisation',
    OrganisationUnit: 'OrganisationUnit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "organisation" | "organisationUnit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Organisation: {
        payload: Prisma.$OrganisationPayload<ExtArgs>
        fields: Prisma.OrganisationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganisationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganisationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findFirst: {
            args: Prisma.OrganisationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganisationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findMany: {
            args: Prisma.OrganisationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          create: {
            args: Prisma.OrganisationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          createMany: {
            args: Prisma.OrganisationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganisationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          delete: {
            args: Prisma.OrganisationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          update: {
            args: Prisma.OrganisationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          deleteMany: {
            args: Prisma.OrganisationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganisationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrganisationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          aggregate: {
            args: Prisma.OrganisationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganisation>
          }
          groupBy: {
            args: Prisma.OrganisationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganisationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganisationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganisationCountAggregateOutputType> | number
          }
        }
      }
      OrganisationUnit: {
        payload: Prisma.$OrganisationUnitPayload<ExtArgs>
        fields: Prisma.OrganisationUnitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganisationUnitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganisationUnitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          findFirst: {
            args: Prisma.OrganisationUnitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganisationUnitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          findMany: {
            args: Prisma.OrganisationUnitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>[]
          }
          create: {
            args: Prisma.OrganisationUnitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          createMany: {
            args: Prisma.OrganisationUnitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganisationUnitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>[]
          }
          delete: {
            args: Prisma.OrganisationUnitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          update: {
            args: Prisma.OrganisationUnitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          deleteMany: {
            args: Prisma.OrganisationUnitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganisationUnitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrganisationUnitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationUnitPayload>
          }
          aggregate: {
            args: Prisma.OrganisationUnitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganisationUnit>
          }
          groupBy: {
            args: Prisma.OrganisationUnitGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganisationUnitGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganisationUnitCountArgs<ExtArgs>
            result: $Utils.Optional<OrganisationUnitCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganisationCountOutputType
   */

  export type OrganisationCountOutputType = {
    children: number
    units: number
  }

  export type OrganisationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | OrganisationCountOutputTypeCountChildrenArgs
    units?: boolean | OrganisationCountOutputTypeCountUnitsArgs
  }

  // Custom InputTypes
  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationCountOutputType
     */
    select?: OrganisationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationWhereInput
  }

  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeCountUnitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationUnitWhereInput
  }


  /**
   * Count Type OrganisationUnitCountOutputType
   */

  export type OrganisationUnitCountOutputType = {
    children: number
  }

  export type OrganisationUnitCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | OrganisationUnitCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * OrganisationUnitCountOutputType without action
   */
  export type OrganisationUnitCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnitCountOutputType
     */
    select?: OrganisationUnitCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganisationUnitCountOutputType without action
   */
  export type OrganisationUnitCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationUnitWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Organisation
   */

  export type AggregateOrganisation = {
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  export type OrganisationMinAggregateOutputType = {
    id: string | null
    parentId: string | null
    code: string | null
    name: string | null
    type: string | null
    regionId: string | null
    districtId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationMaxAggregateOutputType = {
    id: string | null
    parentId: string | null
    code: string | null
    name: string | null
    type: string | null
    regionId: string | null
    districtId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationCountAggregateOutputType = {
    id: number
    parentId: number
    code: number
    name: number
    type: number
    regionId: number
    districtId: number
    isActive: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganisationMinAggregateInputType = {
    id?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    regionId?: true
    districtId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationMaxAggregateInputType = {
    id?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    regionId?: true
    districtId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationCountAggregateInputType = {
    id?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    regionId?: true
    districtId?: true
    isActive?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganisationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisation to aggregate.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organisations
    **/
    _count?: true | OrganisationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganisationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganisationMaxAggregateInputType
  }

  export type GetOrganisationAggregateType<T extends OrganisationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganisation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganisation[P]>
      : GetScalarType<T[P], AggregateOrganisation[P]>
  }




  export type OrganisationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationWhereInput
    orderBy?: OrganisationOrderByWithAggregationInput | OrganisationOrderByWithAggregationInput[]
    by: OrganisationScalarFieldEnum[] | OrganisationScalarFieldEnum
    having?: OrganisationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganisationCountAggregateInputType | true
    _min?: OrganisationMinAggregateInputType
    _max?: OrganisationMaxAggregateInputType
  }

  export type OrganisationGroupByOutputType = {
    id: string
    parentId: string | null
    code: string
    name: string
    type: string
    regionId: string | null
    districtId: string | null
    isActive: boolean
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  type GetOrganisationGroupByPayload<T extends OrganisationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganisationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganisationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
        }
      >
    >


  export type OrganisationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    regionId?: boolean
    districtId?: boolean
    isActive?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Organisation$parentArgs<ExtArgs>
    children?: boolean | Organisation$childrenArgs<ExtArgs>
    units?: boolean | Organisation$unitsArgs<ExtArgs>
    _count?: boolean | OrganisationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    regionId?: boolean
    districtId?: boolean
    isActive?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Organisation$parentArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectScalar = {
    id?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    regionId?: boolean
    districtId?: boolean
    isActive?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganisationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Organisation$parentArgs<ExtArgs>
    children?: boolean | Organisation$childrenArgs<ExtArgs>
    units?: boolean | Organisation$unitsArgs<ExtArgs>
    _count?: boolean | OrganisationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganisationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Organisation$parentArgs<ExtArgs>
  }

  export type $OrganisationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organisation"
    objects: {
      parent: Prisma.$OrganisationPayload<ExtArgs> | null
      children: Prisma.$OrganisationPayload<ExtArgs>[]
      units: Prisma.$OrganisationUnitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      parentId: string | null
      code: string
      name: string
      type: string
      regionId: string | null
      districtId: string | null
      isActive: boolean
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organisation"]>
    composites: {}
  }

  type OrganisationGetPayload<S extends boolean | null | undefined | OrganisationDefaultArgs> = $Result.GetResult<Prisma.$OrganisationPayload, S>

  type OrganisationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrganisationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrganisationCountAggregateInputType | true
    }

  export interface OrganisationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organisation'], meta: { name: 'Organisation' } }
    /**
     * Find zero or one Organisation that matches the filter.
     * @param {OrganisationFindUniqueArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganisationFindUniqueArgs>(args: SelectSubset<T, OrganisationFindUniqueArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Organisation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrganisationFindUniqueOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganisationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganisationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Organisation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganisationFindFirstArgs>(args?: SelectSubset<T, OrganisationFindFirstArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Organisation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganisationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganisationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Organisations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organisations
     * const organisations = await prisma.organisation.findMany()
     * 
     * // Get first 10 Organisations
     * const organisations = await prisma.organisation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organisationWithIdOnly = await prisma.organisation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganisationFindManyArgs>(args?: SelectSubset<T, OrganisationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Organisation.
     * @param {OrganisationCreateArgs} args - Arguments to create a Organisation.
     * @example
     * // Create one Organisation
     * const Organisation = await prisma.organisation.create({
     *   data: {
     *     // ... data to create a Organisation
     *   }
     * })
     * 
     */
    create<T extends OrganisationCreateArgs>(args: SelectSubset<T, OrganisationCreateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Organisations.
     * @param {OrganisationCreateManyArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganisationCreateManyArgs>(args?: SelectSubset<T, OrganisationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organisations and returns the data saved in the database.
     * @param {OrganisationCreateManyAndReturnArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organisations and only return the `id`
     * const organisationWithIdOnly = await prisma.organisation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganisationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganisationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Organisation.
     * @param {OrganisationDeleteArgs} args - Arguments to delete one Organisation.
     * @example
     * // Delete one Organisation
     * const Organisation = await prisma.organisation.delete({
     *   where: {
     *     // ... filter to delete one Organisation
     *   }
     * })
     * 
     */
    delete<T extends OrganisationDeleteArgs>(args: SelectSubset<T, OrganisationDeleteArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Organisation.
     * @param {OrganisationUpdateArgs} args - Arguments to update one Organisation.
     * @example
     * // Update one Organisation
     * const organisation = await prisma.organisation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganisationUpdateArgs>(args: SelectSubset<T, OrganisationUpdateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Organisations.
     * @param {OrganisationDeleteManyArgs} args - Arguments to filter Organisations to delete.
     * @example
     * // Delete a few Organisations
     * const { count } = await prisma.organisation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganisationDeleteManyArgs>(args?: SelectSubset<T, OrganisationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organisations
     * const organisation = await prisma.organisation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganisationUpdateManyArgs>(args: SelectSubset<T, OrganisationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organisation.
     * @param {OrganisationUpsertArgs} args - Arguments to update or create a Organisation.
     * @example
     * // Update or create a Organisation
     * const organisation = await prisma.organisation.upsert({
     *   create: {
     *     // ... data to create a Organisation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organisation we want to update
     *   }
     * })
     */
    upsert<T extends OrganisationUpsertArgs>(args: SelectSubset<T, OrganisationUpsertArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationCountArgs} args - Arguments to filter Organisations to count.
     * @example
     * // Count the number of Organisations
     * const count = await prisma.organisation.count({
     *   where: {
     *     // ... the filter for the Organisations we want to count
     *   }
     * })
    **/
    count<T extends OrganisationCountArgs>(
      args?: Subset<T, OrganisationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganisationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganisationAggregateArgs>(args: Subset<T, OrganisationAggregateArgs>): Prisma.PrismaPromise<GetOrganisationAggregateType<T>>

    /**
     * Group by Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganisationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganisationGroupByArgs['orderBy'] }
        : { orderBy?: OrganisationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganisationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganisationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organisation model
   */
  readonly fields: OrganisationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organisation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganisationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Organisation$parentArgs<ExtArgs> = {}>(args?: Subset<T, Organisation$parentArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends Organisation$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Organisation$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findMany"> | Null>
    units<T extends Organisation$unitsArgs<ExtArgs> = {}>(args?: Subset<T, Organisation$unitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organisation model
   */ 
  interface OrganisationFieldRefs {
    readonly id: FieldRef<"Organisation", 'String'>
    readonly parentId: FieldRef<"Organisation", 'String'>
    readonly code: FieldRef<"Organisation", 'String'>
    readonly name: FieldRef<"Organisation", 'String'>
    readonly type: FieldRef<"Organisation", 'String'>
    readonly regionId: FieldRef<"Organisation", 'String'>
    readonly districtId: FieldRef<"Organisation", 'String'>
    readonly isActive: FieldRef<"Organisation", 'Boolean'>
    readonly metadata: FieldRef<"Organisation", 'Json'>
    readonly createdAt: FieldRef<"Organisation", 'DateTime'>
    readonly updatedAt: FieldRef<"Organisation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organisation findUnique
   */
  export type OrganisationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findUniqueOrThrow
   */
  export type OrganisationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findFirst
   */
  export type OrganisationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findFirstOrThrow
   */
  export type OrganisationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findMany
   */
  export type OrganisationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisations to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation create
   */
  export type OrganisationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organisation.
     */
    data: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
  }

  /**
   * Organisation createMany
   */
  export type OrganisationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organisation createManyAndReturn
   */
  export type OrganisationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Organisation update
   */
  export type OrganisationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organisation.
     */
    data: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
    /**
     * Choose, which Organisation to update.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation updateMany
   */
  export type OrganisationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organisations.
     */
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyInput>
    /**
     * Filter which Organisations to update
     */
    where?: OrganisationWhereInput
  }

  /**
   * Organisation upsert
   */
  export type OrganisationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organisation to update in case it exists.
     */
    where: OrganisationWhereUniqueInput
    /**
     * In case the Organisation found by the `where` argument doesn't exist, create a new Organisation with this data.
     */
    create: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
    /**
     * In case the Organisation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
  }

  /**
   * Organisation delete
   */
  export type OrganisationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter which Organisation to delete.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation deleteMany
   */
  export type OrganisationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisations to delete
     */
    where?: OrganisationWhereInput
  }

  /**
   * Organisation.parent
   */
  export type Organisation$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    where?: OrganisationWhereInput
  }

  /**
   * Organisation.children
   */
  export type Organisation$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    where?: OrganisationWhereInput
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    cursor?: OrganisationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation.units
   */
  export type Organisation$unitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    where?: OrganisationUnitWhereInput
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    cursor?: OrganisationUnitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganisationUnitScalarFieldEnum | OrganisationUnitScalarFieldEnum[]
  }

  /**
   * Organisation without action
   */
  export type OrganisationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
  }


  /**
   * Model OrganisationUnit
   */

  export type AggregateOrganisationUnit = {
    _count: OrganisationUnitCountAggregateOutputType | null
    _min: OrganisationUnitMinAggregateOutputType | null
    _max: OrganisationUnitMaxAggregateOutputType | null
  }

  export type OrganisationUnitMinAggregateOutputType = {
    id: string | null
    organisationId: string | null
    parentId: string | null
    code: string | null
    name: string | null
    type: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationUnitMaxAggregateOutputType = {
    id: string | null
    organisationId: string | null
    parentId: string | null
    code: string | null
    name: string | null
    type: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationUnitCountAggregateOutputType = {
    id: number
    organisationId: number
    parentId: number
    code: number
    name: number
    type: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganisationUnitMinAggregateInputType = {
    id?: true
    organisationId?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationUnitMaxAggregateInputType = {
    id?: true
    organisationId?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationUnitCountAggregateInputType = {
    id?: true
    organisationId?: true
    parentId?: true
    code?: true
    name?: true
    type?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganisationUnitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganisationUnit to aggregate.
     */
    where?: OrganisationUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganisationUnits to fetch.
     */
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganisationUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganisationUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganisationUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrganisationUnits
    **/
    _count?: true | OrganisationUnitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganisationUnitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganisationUnitMaxAggregateInputType
  }

  export type GetOrganisationUnitAggregateType<T extends OrganisationUnitAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganisationUnit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganisationUnit[P]>
      : GetScalarType<T[P], AggregateOrganisationUnit[P]>
  }




  export type OrganisationUnitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationUnitWhereInput
    orderBy?: OrganisationUnitOrderByWithAggregationInput | OrganisationUnitOrderByWithAggregationInput[]
    by: OrganisationUnitScalarFieldEnum[] | OrganisationUnitScalarFieldEnum
    having?: OrganisationUnitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganisationUnitCountAggregateInputType | true
    _min?: OrganisationUnitMinAggregateInputType
    _max?: OrganisationUnitMaxAggregateInputType
  }

  export type OrganisationUnitGroupByOutputType = {
    id: string
    organisationId: string
    parentId: string | null
    code: string
    name: string
    type: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: OrganisationUnitCountAggregateOutputType | null
    _min: OrganisationUnitMinAggregateOutputType | null
    _max: OrganisationUnitMaxAggregateOutputType | null
  }

  type GetOrganisationUnitGroupByPayload<T extends OrganisationUnitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganisationUnitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganisationUnitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganisationUnitGroupByOutputType[P]>
            : GetScalarType<T[P], OrganisationUnitGroupByOutputType[P]>
        }
      >
    >


  export type OrganisationUnitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organisationId?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    parent?: boolean | OrganisationUnit$parentArgs<ExtArgs>
    children?: boolean | OrganisationUnit$childrenArgs<ExtArgs>
    _count?: boolean | OrganisationUnitCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisationUnit"]>

  export type OrganisationUnitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organisationId?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    parent?: boolean | OrganisationUnit$parentArgs<ExtArgs>
  }, ExtArgs["result"]["organisationUnit"]>

  export type OrganisationUnitSelectScalar = {
    id?: boolean
    organisationId?: boolean
    parentId?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganisationUnitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    parent?: boolean | OrganisationUnit$parentArgs<ExtArgs>
    children?: boolean | OrganisationUnit$childrenArgs<ExtArgs>
    _count?: boolean | OrganisationUnitCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganisationUnitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    parent?: boolean | OrganisationUnit$parentArgs<ExtArgs>
  }

  export type $OrganisationUnitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrganisationUnit"
    objects: {
      organisation: Prisma.$OrganisationPayload<ExtArgs>
      parent: Prisma.$OrganisationUnitPayload<ExtArgs> | null
      children: Prisma.$OrganisationUnitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organisationId: string
      parentId: string | null
      code: string
      name: string
      type: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organisationUnit"]>
    composites: {}
  }

  type OrganisationUnitGetPayload<S extends boolean | null | undefined | OrganisationUnitDefaultArgs> = $Result.GetResult<Prisma.$OrganisationUnitPayload, S>

  type OrganisationUnitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrganisationUnitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrganisationUnitCountAggregateInputType | true
    }

  export interface OrganisationUnitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrganisationUnit'], meta: { name: 'OrganisationUnit' } }
    /**
     * Find zero or one OrganisationUnit that matches the filter.
     * @param {OrganisationUnitFindUniqueArgs} args - Arguments to find a OrganisationUnit
     * @example
     * // Get one OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganisationUnitFindUniqueArgs>(args: SelectSubset<T, OrganisationUnitFindUniqueArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrganisationUnit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrganisationUnitFindUniqueOrThrowArgs} args - Arguments to find a OrganisationUnit
     * @example
     * // Get one OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganisationUnitFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganisationUnitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrganisationUnit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitFindFirstArgs} args - Arguments to find a OrganisationUnit
     * @example
     * // Get one OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganisationUnitFindFirstArgs>(args?: SelectSubset<T, OrganisationUnitFindFirstArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrganisationUnit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitFindFirstOrThrowArgs} args - Arguments to find a OrganisationUnit
     * @example
     * // Get one OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganisationUnitFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganisationUnitFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrganisationUnits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrganisationUnits
     * const organisationUnits = await prisma.organisationUnit.findMany()
     * 
     * // Get first 10 OrganisationUnits
     * const organisationUnits = await prisma.organisationUnit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organisationUnitWithIdOnly = await prisma.organisationUnit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganisationUnitFindManyArgs>(args?: SelectSubset<T, OrganisationUnitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrganisationUnit.
     * @param {OrganisationUnitCreateArgs} args - Arguments to create a OrganisationUnit.
     * @example
     * // Create one OrganisationUnit
     * const OrganisationUnit = await prisma.organisationUnit.create({
     *   data: {
     *     // ... data to create a OrganisationUnit
     *   }
     * })
     * 
     */
    create<T extends OrganisationUnitCreateArgs>(args: SelectSubset<T, OrganisationUnitCreateArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrganisationUnits.
     * @param {OrganisationUnitCreateManyArgs} args - Arguments to create many OrganisationUnits.
     * @example
     * // Create many OrganisationUnits
     * const organisationUnit = await prisma.organisationUnit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganisationUnitCreateManyArgs>(args?: SelectSubset<T, OrganisationUnitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrganisationUnits and returns the data saved in the database.
     * @param {OrganisationUnitCreateManyAndReturnArgs} args - Arguments to create many OrganisationUnits.
     * @example
     * // Create many OrganisationUnits
     * const organisationUnit = await prisma.organisationUnit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrganisationUnits and only return the `id`
     * const organisationUnitWithIdOnly = await prisma.organisationUnit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganisationUnitCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganisationUnitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OrganisationUnit.
     * @param {OrganisationUnitDeleteArgs} args - Arguments to delete one OrganisationUnit.
     * @example
     * // Delete one OrganisationUnit
     * const OrganisationUnit = await prisma.organisationUnit.delete({
     *   where: {
     *     // ... filter to delete one OrganisationUnit
     *   }
     * })
     * 
     */
    delete<T extends OrganisationUnitDeleteArgs>(args: SelectSubset<T, OrganisationUnitDeleteArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrganisationUnit.
     * @param {OrganisationUnitUpdateArgs} args - Arguments to update one OrganisationUnit.
     * @example
     * // Update one OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganisationUnitUpdateArgs>(args: SelectSubset<T, OrganisationUnitUpdateArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrganisationUnits.
     * @param {OrganisationUnitDeleteManyArgs} args - Arguments to filter OrganisationUnits to delete.
     * @example
     * // Delete a few OrganisationUnits
     * const { count } = await prisma.organisationUnit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganisationUnitDeleteManyArgs>(args?: SelectSubset<T, OrganisationUnitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrganisationUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrganisationUnits
     * const organisationUnit = await prisma.organisationUnit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganisationUnitUpdateManyArgs>(args: SelectSubset<T, OrganisationUnitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrganisationUnit.
     * @param {OrganisationUnitUpsertArgs} args - Arguments to update or create a OrganisationUnit.
     * @example
     * // Update or create a OrganisationUnit
     * const organisationUnit = await prisma.organisationUnit.upsert({
     *   create: {
     *     // ... data to create a OrganisationUnit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrganisationUnit we want to update
     *   }
     * })
     */
    upsert<T extends OrganisationUnitUpsertArgs>(args: SelectSubset<T, OrganisationUnitUpsertArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrganisationUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitCountArgs} args - Arguments to filter OrganisationUnits to count.
     * @example
     * // Count the number of OrganisationUnits
     * const count = await prisma.organisationUnit.count({
     *   where: {
     *     // ... the filter for the OrganisationUnits we want to count
     *   }
     * })
    **/
    count<T extends OrganisationUnitCountArgs>(
      args?: Subset<T, OrganisationUnitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganisationUnitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrganisationUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganisationUnitAggregateArgs>(args: Subset<T, OrganisationUnitAggregateArgs>): Prisma.PrismaPromise<GetOrganisationUnitAggregateType<T>>

    /**
     * Group by OrganisationUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUnitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganisationUnitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganisationUnitGroupByArgs['orderBy'] }
        : { orderBy?: OrganisationUnitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganisationUnitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganisationUnitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrganisationUnit model
   */
  readonly fields: OrganisationUnitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrganisationUnit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganisationUnitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organisation<T extends OrganisationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganisationDefaultArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    parent<T extends OrganisationUnit$parentArgs<ExtArgs> = {}>(args?: Subset<T, OrganisationUnit$parentArgs<ExtArgs>>): Prisma__OrganisationUnitClient<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends OrganisationUnit$childrenArgs<ExtArgs> = {}>(args?: Subset<T, OrganisationUnit$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationUnitPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrganisationUnit model
   */ 
  interface OrganisationUnitFieldRefs {
    readonly id: FieldRef<"OrganisationUnit", 'String'>
    readonly organisationId: FieldRef<"OrganisationUnit", 'String'>
    readonly parentId: FieldRef<"OrganisationUnit", 'String'>
    readonly code: FieldRef<"OrganisationUnit", 'String'>
    readonly name: FieldRef<"OrganisationUnit", 'String'>
    readonly type: FieldRef<"OrganisationUnit", 'String'>
    readonly isActive: FieldRef<"OrganisationUnit", 'Boolean'>
    readonly createdAt: FieldRef<"OrganisationUnit", 'DateTime'>
    readonly updatedAt: FieldRef<"OrganisationUnit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrganisationUnit findUnique
   */
  export type OrganisationUnitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter, which OrganisationUnit to fetch.
     */
    where: OrganisationUnitWhereUniqueInput
  }

  /**
   * OrganisationUnit findUniqueOrThrow
   */
  export type OrganisationUnitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter, which OrganisationUnit to fetch.
     */
    where: OrganisationUnitWhereUniqueInput
  }

  /**
   * OrganisationUnit findFirst
   */
  export type OrganisationUnitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter, which OrganisationUnit to fetch.
     */
    where?: OrganisationUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganisationUnits to fetch.
     */
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganisationUnits.
     */
    cursor?: OrganisationUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganisationUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganisationUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganisationUnits.
     */
    distinct?: OrganisationUnitScalarFieldEnum | OrganisationUnitScalarFieldEnum[]
  }

  /**
   * OrganisationUnit findFirstOrThrow
   */
  export type OrganisationUnitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter, which OrganisationUnit to fetch.
     */
    where?: OrganisationUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganisationUnits to fetch.
     */
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganisationUnits.
     */
    cursor?: OrganisationUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganisationUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganisationUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganisationUnits.
     */
    distinct?: OrganisationUnitScalarFieldEnum | OrganisationUnitScalarFieldEnum[]
  }

  /**
   * OrganisationUnit findMany
   */
  export type OrganisationUnitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter, which OrganisationUnits to fetch.
     */
    where?: OrganisationUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganisationUnits to fetch.
     */
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrganisationUnits.
     */
    cursor?: OrganisationUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganisationUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganisationUnits.
     */
    skip?: number
    distinct?: OrganisationUnitScalarFieldEnum | OrganisationUnitScalarFieldEnum[]
  }

  /**
   * OrganisationUnit create
   */
  export type OrganisationUnitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * The data needed to create a OrganisationUnit.
     */
    data: XOR<OrganisationUnitCreateInput, OrganisationUnitUncheckedCreateInput>
  }

  /**
   * OrganisationUnit createMany
   */
  export type OrganisationUnitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrganisationUnits.
     */
    data: OrganisationUnitCreateManyInput | OrganisationUnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrganisationUnit createManyAndReturn
   */
  export type OrganisationUnitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OrganisationUnits.
     */
    data: OrganisationUnitCreateManyInput | OrganisationUnitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrganisationUnit update
   */
  export type OrganisationUnitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * The data needed to update a OrganisationUnit.
     */
    data: XOR<OrganisationUnitUpdateInput, OrganisationUnitUncheckedUpdateInput>
    /**
     * Choose, which OrganisationUnit to update.
     */
    where: OrganisationUnitWhereUniqueInput
  }

  /**
   * OrganisationUnit updateMany
   */
  export type OrganisationUnitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrganisationUnits.
     */
    data: XOR<OrganisationUnitUpdateManyMutationInput, OrganisationUnitUncheckedUpdateManyInput>
    /**
     * Filter which OrganisationUnits to update
     */
    where?: OrganisationUnitWhereInput
  }

  /**
   * OrganisationUnit upsert
   */
  export type OrganisationUnitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * The filter to search for the OrganisationUnit to update in case it exists.
     */
    where: OrganisationUnitWhereUniqueInput
    /**
     * In case the OrganisationUnit found by the `where` argument doesn't exist, create a new OrganisationUnit with this data.
     */
    create: XOR<OrganisationUnitCreateInput, OrganisationUnitUncheckedCreateInput>
    /**
     * In case the OrganisationUnit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganisationUnitUpdateInput, OrganisationUnitUncheckedUpdateInput>
  }

  /**
   * OrganisationUnit delete
   */
  export type OrganisationUnitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    /**
     * Filter which OrganisationUnit to delete.
     */
    where: OrganisationUnitWhereUniqueInput
  }

  /**
   * OrganisationUnit deleteMany
   */
  export type OrganisationUnitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganisationUnits to delete
     */
    where?: OrganisationUnitWhereInput
  }

  /**
   * OrganisationUnit.parent
   */
  export type OrganisationUnit$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    where?: OrganisationUnitWhereInput
  }

  /**
   * OrganisationUnit.children
   */
  export type OrganisationUnit$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
    where?: OrganisationUnitWhereInput
    orderBy?: OrganisationUnitOrderByWithRelationInput | OrganisationUnitOrderByWithRelationInput[]
    cursor?: OrganisationUnitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganisationUnitScalarFieldEnum | OrganisationUnitScalarFieldEnum[]
  }

  /**
   * OrganisationUnit without action
   */
  export type OrganisationUnitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationUnit
     */
    select?: OrganisationUnitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationUnitInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganisationScalarFieldEnum: {
    id: 'id',
    parentId: 'parentId',
    code: 'code',
    name: 'name',
    type: 'type',
    regionId: 'regionId',
    districtId: 'districtId',
    isActive: 'isActive',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganisationScalarFieldEnum = (typeof OrganisationScalarFieldEnum)[keyof typeof OrganisationScalarFieldEnum]


  export const OrganisationUnitScalarFieldEnum: {
    id: 'id',
    organisationId: 'organisationId',
    parentId: 'parentId',
    code: 'code',
    name: 'name',
    type: 'type',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganisationUnitScalarFieldEnum = (typeof OrganisationUnitScalarFieldEnum)[keyof typeof OrganisationUnitScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type OrganisationWhereInput = {
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    id?: StringFilter<"Organisation"> | string
    parentId?: StringNullableFilter<"Organisation"> | string | null
    code?: StringFilter<"Organisation"> | string
    name?: StringFilter<"Organisation"> | string
    type?: StringFilter<"Organisation"> | string
    regionId?: StringNullableFilter<"Organisation"> | string | null
    districtId?: StringNullableFilter<"Organisation"> | string | null
    isActive?: BoolFilter<"Organisation"> | boolean
    metadata?: JsonFilter<"Organisation">
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    parent?: XOR<OrganisationNullableRelationFilter, OrganisationWhereInput> | null
    children?: OrganisationListRelationFilter
    units?: OrganisationUnitListRelationFilter
  }

  export type OrganisationOrderByWithRelationInput = {
    id?: SortOrder
    parentId?: SortOrderInput | SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parent?: OrganisationOrderByWithRelationInput
    children?: OrganisationOrderByRelationAggregateInput
    units?: OrganisationUnitOrderByRelationAggregateInput
  }

  export type OrganisationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    parentId?: StringNullableFilter<"Organisation"> | string | null
    name?: StringFilter<"Organisation"> | string
    type?: StringFilter<"Organisation"> | string
    regionId?: StringNullableFilter<"Organisation"> | string | null
    districtId?: StringNullableFilter<"Organisation"> | string | null
    isActive?: BoolFilter<"Organisation"> | boolean
    metadata?: JsonFilter<"Organisation">
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    parent?: XOR<OrganisationNullableRelationFilter, OrganisationWhereInput> | null
    children?: OrganisationListRelationFilter
    units?: OrganisationUnitListRelationFilter
  }, "id" | "code">

  export type OrganisationOrderByWithAggregationInput = {
    id?: SortOrder
    parentId?: SortOrderInput | SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganisationCountOrderByAggregateInput
    _max?: OrganisationMaxOrderByAggregateInput
    _min?: OrganisationMinOrderByAggregateInput
  }

  export type OrganisationScalarWhereWithAggregatesInput = {
    AND?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    OR?: OrganisationScalarWhereWithAggregatesInput[]
    NOT?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organisation"> | string
    parentId?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    code?: StringWithAggregatesFilter<"Organisation"> | string
    name?: StringWithAggregatesFilter<"Organisation"> | string
    type?: StringWithAggregatesFilter<"Organisation"> | string
    regionId?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    districtId?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    isActive?: BoolWithAggregatesFilter<"Organisation"> | boolean
    metadata?: JsonWithAggregatesFilter<"Organisation">
    createdAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
  }

  export type OrganisationUnitWhereInput = {
    AND?: OrganisationUnitWhereInput | OrganisationUnitWhereInput[]
    OR?: OrganisationUnitWhereInput[]
    NOT?: OrganisationUnitWhereInput | OrganisationUnitWhereInput[]
    id?: StringFilter<"OrganisationUnit"> | string
    organisationId?: StringFilter<"OrganisationUnit"> | string
    parentId?: StringNullableFilter<"OrganisationUnit"> | string | null
    code?: StringFilter<"OrganisationUnit"> | string
    name?: StringFilter<"OrganisationUnit"> | string
    type?: StringNullableFilter<"OrganisationUnit"> | string | null
    isActive?: BoolFilter<"OrganisationUnit"> | boolean
    createdAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
    updatedAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
    organisation?: XOR<OrganisationRelationFilter, OrganisationWhereInput>
    parent?: XOR<OrganisationUnitNullableRelationFilter, OrganisationUnitWhereInput> | null
    children?: OrganisationUnitListRelationFilter
  }

  export type OrganisationUnitOrderByWithRelationInput = {
    id?: SortOrder
    organisationId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisation?: OrganisationOrderByWithRelationInput
    parent?: OrganisationUnitOrderByWithRelationInput
    children?: OrganisationUnitOrderByRelationAggregateInput
  }

  export type OrganisationUnitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    organisationId_code?: OrganisationUnitOrganisationIdCodeCompoundUniqueInput
    AND?: OrganisationUnitWhereInput | OrganisationUnitWhereInput[]
    OR?: OrganisationUnitWhereInput[]
    NOT?: OrganisationUnitWhereInput | OrganisationUnitWhereInput[]
    organisationId?: StringFilter<"OrganisationUnit"> | string
    parentId?: StringNullableFilter<"OrganisationUnit"> | string | null
    code?: StringFilter<"OrganisationUnit"> | string
    name?: StringFilter<"OrganisationUnit"> | string
    type?: StringNullableFilter<"OrganisationUnit"> | string | null
    isActive?: BoolFilter<"OrganisationUnit"> | boolean
    createdAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
    updatedAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
    organisation?: XOR<OrganisationRelationFilter, OrganisationWhereInput>
    parent?: XOR<OrganisationUnitNullableRelationFilter, OrganisationUnitWhereInput> | null
    children?: OrganisationUnitListRelationFilter
  }, "id" | "organisationId_code">

  export type OrganisationUnitOrderByWithAggregationInput = {
    id?: SortOrder
    organisationId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganisationUnitCountOrderByAggregateInput
    _max?: OrganisationUnitMaxOrderByAggregateInput
    _min?: OrganisationUnitMinOrderByAggregateInput
  }

  export type OrganisationUnitScalarWhereWithAggregatesInput = {
    AND?: OrganisationUnitScalarWhereWithAggregatesInput | OrganisationUnitScalarWhereWithAggregatesInput[]
    OR?: OrganisationUnitScalarWhereWithAggregatesInput[]
    NOT?: OrganisationUnitScalarWhereWithAggregatesInput | OrganisationUnitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrganisationUnit"> | string
    organisationId?: StringWithAggregatesFilter<"OrganisationUnit"> | string
    parentId?: StringNullableWithAggregatesFilter<"OrganisationUnit"> | string | null
    code?: StringWithAggregatesFilter<"OrganisationUnit"> | string
    name?: StringWithAggregatesFilter<"OrganisationUnit"> | string
    type?: StringNullableWithAggregatesFilter<"OrganisationUnit"> | string | null
    isActive?: BoolWithAggregatesFilter<"OrganisationUnit"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OrganisationUnit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrganisationUnit"> | Date | string
  }

  export type OrganisationCreateInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: OrganisationCreateNestedOneWithoutChildrenInput
    children?: OrganisationCreateNestedManyWithoutParentInput
    units?: OrganisationUnitCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUncheckedCreateNestedManyWithoutParentInput
    units?: OrganisationUnitUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: OrganisationUpdateOneWithoutChildrenNestedInput
    children?: OrganisationUpdateManyWithoutParentNestedInput
    units?: OrganisationUnitUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUncheckedUpdateManyWithoutParentNestedInput
    units?: OrganisationUnitUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationCreateManyInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUnitCreateInput = {
    id?: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation: OrganisationCreateNestedOneWithoutUnitsInput
    parent?: OrganisationUnitCreateNestedOneWithoutChildrenInput
    children?: OrganisationUnitCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitUncheckedCreateInput = {
    id?: string
    organisationId: string
    parentId?: string | null
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUnitUncheckedCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneRequiredWithoutUnitsNestedInput
    parent?: OrganisationUnitUpdateOneWithoutChildrenNestedInput
    children?: OrganisationUnitUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organisationId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUnitUncheckedUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitCreateManyInput = {
    id?: string
    organisationId: string
    parentId?: string | null
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUnitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUnitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organisationId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrganisationNullableRelationFilter = {
    is?: OrganisationWhereInput | null
    isNot?: OrganisationWhereInput | null
  }

  export type OrganisationListRelationFilter = {
    every?: OrganisationWhereInput
    some?: OrganisationWhereInput
    none?: OrganisationWhereInput
  }

  export type OrganisationUnitListRelationFilter = {
    every?: OrganisationUnitWhereInput
    some?: OrganisationUnitWhereInput
    none?: OrganisationUnitWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrganisationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganisationUnitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganisationCountOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    isActive?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMaxOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMinOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OrganisationRelationFilter = {
    is?: OrganisationWhereInput
    isNot?: OrganisationWhereInput
  }

  export type OrganisationUnitNullableRelationFilter = {
    is?: OrganisationUnitWhereInput | null
    isNot?: OrganisationUnitWhereInput | null
  }

  export type OrganisationUnitOrganisationIdCodeCompoundUniqueInput = {
    organisationId: string
    code: string
  }

  export type OrganisationUnitCountOrderByAggregateInput = {
    id?: SortOrder
    organisationId?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationUnitMaxOrderByAggregateInput = {
    id?: SortOrder
    organisationId?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationUnitMinOrderByAggregateInput = {
    id?: SortOrder
    organisationId?: SortOrder
    parentId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationCreateNestedOneWithoutChildrenInput = {
    create?: XOR<OrganisationCreateWithoutChildrenInput, OrganisationUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutChildrenInput
    connect?: OrganisationWhereUniqueInput
  }

  export type OrganisationCreateNestedManyWithoutParentInput = {
    create?: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput> | OrganisationCreateWithoutParentInput[] | OrganisationUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationCreateOrConnectWithoutParentInput | OrganisationCreateOrConnectWithoutParentInput[]
    createMany?: OrganisationCreateManyParentInputEnvelope
    connect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
  }

  export type OrganisationUnitCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput> | OrganisationUnitCreateWithoutOrganisationInput[] | OrganisationUnitUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutOrganisationInput | OrganisationUnitCreateOrConnectWithoutOrganisationInput[]
    createMany?: OrganisationUnitCreateManyOrganisationInputEnvelope
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
  }

  export type OrganisationUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput> | OrganisationCreateWithoutParentInput[] | OrganisationUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationCreateOrConnectWithoutParentInput | OrganisationCreateOrConnectWithoutParentInput[]
    createMany?: OrganisationCreateManyParentInputEnvelope
    connect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
  }

  export type OrganisationUnitUncheckedCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput> | OrganisationUnitCreateWithoutOrganisationInput[] | OrganisationUnitUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutOrganisationInput | OrganisationUnitCreateOrConnectWithoutOrganisationInput[]
    createMany?: OrganisationUnitCreateManyOrganisationInputEnvelope
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrganisationUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<OrganisationCreateWithoutChildrenInput, OrganisationUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutChildrenInput
    upsert?: OrganisationUpsertWithoutChildrenInput
    disconnect?: OrganisationWhereInput | boolean
    delete?: OrganisationWhereInput | boolean
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutChildrenInput, OrganisationUpdateWithoutChildrenInput>, OrganisationUncheckedUpdateWithoutChildrenInput>
  }

  export type OrganisationUpdateManyWithoutParentNestedInput = {
    create?: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput> | OrganisationCreateWithoutParentInput[] | OrganisationUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationCreateOrConnectWithoutParentInput | OrganisationCreateOrConnectWithoutParentInput[]
    upsert?: OrganisationUpsertWithWhereUniqueWithoutParentInput | OrganisationUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: OrganisationCreateManyParentInputEnvelope
    set?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    disconnect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    delete?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    connect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    update?: OrganisationUpdateWithWhereUniqueWithoutParentInput | OrganisationUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: OrganisationUpdateManyWithWhereWithoutParentInput | OrganisationUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: OrganisationScalarWhereInput | OrganisationScalarWhereInput[]
  }

  export type OrganisationUnitUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput> | OrganisationUnitCreateWithoutOrganisationInput[] | OrganisationUnitUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutOrganisationInput | OrganisationUnitCreateOrConnectWithoutOrganisationInput[]
    upsert?: OrganisationUnitUpsertWithWhereUniqueWithoutOrganisationInput | OrganisationUnitUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: OrganisationUnitCreateManyOrganisationInputEnvelope
    set?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    disconnect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    delete?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    update?: OrganisationUnitUpdateWithWhereUniqueWithoutOrganisationInput | OrganisationUnitUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: OrganisationUnitUpdateManyWithWhereWithoutOrganisationInput | OrganisationUnitUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
  }

  export type OrganisationUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput> | OrganisationCreateWithoutParentInput[] | OrganisationUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationCreateOrConnectWithoutParentInput | OrganisationCreateOrConnectWithoutParentInput[]
    upsert?: OrganisationUpsertWithWhereUniqueWithoutParentInput | OrganisationUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: OrganisationCreateManyParentInputEnvelope
    set?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    disconnect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    delete?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    connect?: OrganisationWhereUniqueInput | OrganisationWhereUniqueInput[]
    update?: OrganisationUpdateWithWhereUniqueWithoutParentInput | OrganisationUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: OrganisationUpdateManyWithWhereWithoutParentInput | OrganisationUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: OrganisationScalarWhereInput | OrganisationScalarWhereInput[]
  }

  export type OrganisationUnitUncheckedUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput> | OrganisationUnitCreateWithoutOrganisationInput[] | OrganisationUnitUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutOrganisationInput | OrganisationUnitCreateOrConnectWithoutOrganisationInput[]
    upsert?: OrganisationUnitUpsertWithWhereUniqueWithoutOrganisationInput | OrganisationUnitUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: OrganisationUnitCreateManyOrganisationInputEnvelope
    set?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    disconnect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    delete?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    update?: OrganisationUnitUpdateWithWhereUniqueWithoutOrganisationInput | OrganisationUnitUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: OrganisationUnitUpdateManyWithWhereWithoutOrganisationInput | OrganisationUnitUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
  }

  export type OrganisationCreateNestedOneWithoutUnitsInput = {
    create?: XOR<OrganisationCreateWithoutUnitsInput, OrganisationUncheckedCreateWithoutUnitsInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutUnitsInput
    connect?: OrganisationWhereUniqueInput
  }

  export type OrganisationUnitCreateNestedOneWithoutChildrenInput = {
    create?: XOR<OrganisationUnitCreateWithoutChildrenInput, OrganisationUnitUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutChildrenInput
    connect?: OrganisationUnitWhereUniqueInput
  }

  export type OrganisationUnitCreateNestedManyWithoutParentInput = {
    create?: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput> | OrganisationUnitCreateWithoutParentInput[] | OrganisationUnitUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutParentInput | OrganisationUnitCreateOrConnectWithoutParentInput[]
    createMany?: OrganisationUnitCreateManyParentInputEnvelope
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
  }

  export type OrganisationUnitUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput> | OrganisationUnitCreateWithoutParentInput[] | OrganisationUnitUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutParentInput | OrganisationUnitCreateOrConnectWithoutParentInput[]
    createMany?: OrganisationUnitCreateManyParentInputEnvelope
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
  }

  export type OrganisationUpdateOneRequiredWithoutUnitsNestedInput = {
    create?: XOR<OrganisationCreateWithoutUnitsInput, OrganisationUncheckedCreateWithoutUnitsInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutUnitsInput
    upsert?: OrganisationUpsertWithoutUnitsInput
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutUnitsInput, OrganisationUpdateWithoutUnitsInput>, OrganisationUncheckedUpdateWithoutUnitsInput>
  }

  export type OrganisationUnitUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<OrganisationUnitCreateWithoutChildrenInput, OrganisationUnitUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutChildrenInput
    upsert?: OrganisationUnitUpsertWithoutChildrenInput
    disconnect?: OrganisationUnitWhereInput | boolean
    delete?: OrganisationUnitWhereInput | boolean
    connect?: OrganisationUnitWhereUniqueInput
    update?: XOR<XOR<OrganisationUnitUpdateToOneWithWhereWithoutChildrenInput, OrganisationUnitUpdateWithoutChildrenInput>, OrganisationUnitUncheckedUpdateWithoutChildrenInput>
  }

  export type OrganisationUnitUpdateManyWithoutParentNestedInput = {
    create?: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput> | OrganisationUnitCreateWithoutParentInput[] | OrganisationUnitUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutParentInput | OrganisationUnitCreateOrConnectWithoutParentInput[]
    upsert?: OrganisationUnitUpsertWithWhereUniqueWithoutParentInput | OrganisationUnitUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: OrganisationUnitCreateManyParentInputEnvelope
    set?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    disconnect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    delete?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    update?: OrganisationUnitUpdateWithWhereUniqueWithoutParentInput | OrganisationUnitUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: OrganisationUnitUpdateManyWithWhereWithoutParentInput | OrganisationUnitUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
  }

  export type OrganisationUnitUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput> | OrganisationUnitCreateWithoutParentInput[] | OrganisationUnitUncheckedCreateWithoutParentInput[]
    connectOrCreate?: OrganisationUnitCreateOrConnectWithoutParentInput | OrganisationUnitCreateOrConnectWithoutParentInput[]
    upsert?: OrganisationUnitUpsertWithWhereUniqueWithoutParentInput | OrganisationUnitUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: OrganisationUnitCreateManyParentInputEnvelope
    set?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    disconnect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    delete?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    connect?: OrganisationUnitWhereUniqueInput | OrganisationUnitWhereUniqueInput[]
    update?: OrganisationUnitUpdateWithWhereUniqueWithoutParentInput | OrganisationUnitUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: OrganisationUnitUpdateManyWithWhereWithoutParentInput | OrganisationUnitUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OrganisationCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: OrganisationCreateNestedOneWithoutChildrenInput
    units?: OrganisationUnitCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateWithoutChildrenInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    units?: OrganisationUnitUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationCreateOrConnectWithoutChildrenInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutChildrenInput, OrganisationUncheckedCreateWithoutChildrenInput>
  }

  export type OrganisationCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationCreateNestedManyWithoutParentInput
    units?: OrganisationUnitCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUncheckedCreateNestedManyWithoutParentInput
    units?: OrganisationUnitUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationCreateOrConnectWithoutParentInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput>
  }

  export type OrganisationCreateManyParentInputEnvelope = {
    data: OrganisationCreateManyParentInput | OrganisationCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type OrganisationUnitCreateWithoutOrganisationInput = {
    id?: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: OrganisationUnitCreateNestedOneWithoutChildrenInput
    children?: OrganisationUnitCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitUncheckedCreateWithoutOrganisationInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUnitUncheckedCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitCreateOrConnectWithoutOrganisationInput = {
    where: OrganisationUnitWhereUniqueInput
    create: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput>
  }

  export type OrganisationUnitCreateManyOrganisationInputEnvelope = {
    data: OrganisationUnitCreateManyOrganisationInput | OrganisationUnitCreateManyOrganisationInput[]
    skipDuplicates?: boolean
  }

  export type OrganisationUpsertWithoutChildrenInput = {
    update: XOR<OrganisationUpdateWithoutChildrenInput, OrganisationUncheckedUpdateWithoutChildrenInput>
    create: XOR<OrganisationCreateWithoutChildrenInput, OrganisationUncheckedCreateWithoutChildrenInput>
    where?: OrganisationWhereInput
  }

  export type OrganisationUpdateToOneWithWhereWithoutChildrenInput = {
    where?: OrganisationWhereInput
    data: XOR<OrganisationUpdateWithoutChildrenInput, OrganisationUncheckedUpdateWithoutChildrenInput>
  }

  export type OrganisationUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: OrganisationUpdateOneWithoutChildrenNestedInput
    units?: OrganisationUnitUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    units?: OrganisationUnitUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUpsertWithWhereUniqueWithoutParentInput = {
    where: OrganisationWhereUniqueInput
    update: XOR<OrganisationUpdateWithoutParentInput, OrganisationUncheckedUpdateWithoutParentInput>
    create: XOR<OrganisationCreateWithoutParentInput, OrganisationUncheckedCreateWithoutParentInput>
  }

  export type OrganisationUpdateWithWhereUniqueWithoutParentInput = {
    where: OrganisationWhereUniqueInput
    data: XOR<OrganisationUpdateWithoutParentInput, OrganisationUncheckedUpdateWithoutParentInput>
  }

  export type OrganisationUpdateManyWithWhereWithoutParentInput = {
    where: OrganisationScalarWhereInput
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyWithoutParentInput>
  }

  export type OrganisationScalarWhereInput = {
    AND?: OrganisationScalarWhereInput | OrganisationScalarWhereInput[]
    OR?: OrganisationScalarWhereInput[]
    NOT?: OrganisationScalarWhereInput | OrganisationScalarWhereInput[]
    id?: StringFilter<"Organisation"> | string
    parentId?: StringNullableFilter<"Organisation"> | string | null
    code?: StringFilter<"Organisation"> | string
    name?: StringFilter<"Organisation"> | string
    type?: StringFilter<"Organisation"> | string
    regionId?: StringNullableFilter<"Organisation"> | string | null
    districtId?: StringNullableFilter<"Organisation"> | string | null
    isActive?: BoolFilter<"Organisation"> | boolean
    metadata?: JsonFilter<"Organisation">
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
  }

  export type OrganisationUnitUpsertWithWhereUniqueWithoutOrganisationInput = {
    where: OrganisationUnitWhereUniqueInput
    update: XOR<OrganisationUnitUpdateWithoutOrganisationInput, OrganisationUnitUncheckedUpdateWithoutOrganisationInput>
    create: XOR<OrganisationUnitCreateWithoutOrganisationInput, OrganisationUnitUncheckedCreateWithoutOrganisationInput>
  }

  export type OrganisationUnitUpdateWithWhereUniqueWithoutOrganisationInput = {
    where: OrganisationUnitWhereUniqueInput
    data: XOR<OrganisationUnitUpdateWithoutOrganisationInput, OrganisationUnitUncheckedUpdateWithoutOrganisationInput>
  }

  export type OrganisationUnitUpdateManyWithWhereWithoutOrganisationInput = {
    where: OrganisationUnitScalarWhereInput
    data: XOR<OrganisationUnitUpdateManyMutationInput, OrganisationUnitUncheckedUpdateManyWithoutOrganisationInput>
  }

  export type OrganisationUnitScalarWhereInput = {
    AND?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
    OR?: OrganisationUnitScalarWhereInput[]
    NOT?: OrganisationUnitScalarWhereInput | OrganisationUnitScalarWhereInput[]
    id?: StringFilter<"OrganisationUnit"> | string
    organisationId?: StringFilter<"OrganisationUnit"> | string
    parentId?: StringNullableFilter<"OrganisationUnit"> | string | null
    code?: StringFilter<"OrganisationUnit"> | string
    name?: StringFilter<"OrganisationUnit"> | string
    type?: StringNullableFilter<"OrganisationUnit"> | string | null
    isActive?: BoolFilter<"OrganisationUnit"> | boolean
    createdAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
    updatedAt?: DateTimeFilter<"OrganisationUnit"> | Date | string
  }

  export type OrganisationCreateWithoutUnitsInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: OrganisationCreateNestedOneWithoutChildrenInput
    children?: OrganisationCreateNestedManyWithoutParentInput
  }

  export type OrganisationUncheckedCreateWithoutUnitsInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUncheckedCreateNestedManyWithoutParentInput
  }

  export type OrganisationCreateOrConnectWithoutUnitsInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutUnitsInput, OrganisationUncheckedCreateWithoutUnitsInput>
  }

  export type OrganisationUnitCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation: OrganisationCreateNestedOneWithoutUnitsInput
    parent?: OrganisationUnitCreateNestedOneWithoutChildrenInput
  }

  export type OrganisationUnitUncheckedCreateWithoutChildrenInput = {
    id?: string
    organisationId: string
    parentId?: string | null
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUnitCreateOrConnectWithoutChildrenInput = {
    where: OrganisationUnitWhereUniqueInput
    create: XOR<OrganisationUnitCreateWithoutChildrenInput, OrganisationUnitUncheckedCreateWithoutChildrenInput>
  }

  export type OrganisationUnitCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation: OrganisationCreateNestedOneWithoutUnitsInput
    children?: OrganisationUnitCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitUncheckedCreateWithoutParentInput = {
    id?: string
    organisationId: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: OrganisationUnitUncheckedCreateNestedManyWithoutParentInput
  }

  export type OrganisationUnitCreateOrConnectWithoutParentInput = {
    where: OrganisationUnitWhereUniqueInput
    create: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput>
  }

  export type OrganisationUnitCreateManyParentInputEnvelope = {
    data: OrganisationUnitCreateManyParentInput | OrganisationUnitCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type OrganisationUpsertWithoutUnitsInput = {
    update: XOR<OrganisationUpdateWithoutUnitsInput, OrganisationUncheckedUpdateWithoutUnitsInput>
    create: XOR<OrganisationCreateWithoutUnitsInput, OrganisationUncheckedCreateWithoutUnitsInput>
    where?: OrganisationWhereInput
  }

  export type OrganisationUpdateToOneWithWhereWithoutUnitsInput = {
    where?: OrganisationWhereInput
    data: XOR<OrganisationUpdateWithoutUnitsInput, OrganisationUncheckedUpdateWithoutUnitsInput>
  }

  export type OrganisationUpdateWithoutUnitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: OrganisationUpdateOneWithoutChildrenNestedInput
    children?: OrganisationUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUncheckedUpdateWithoutUnitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUncheckedUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUpsertWithoutChildrenInput = {
    update: XOR<OrganisationUnitUpdateWithoutChildrenInput, OrganisationUnitUncheckedUpdateWithoutChildrenInput>
    create: XOR<OrganisationUnitCreateWithoutChildrenInput, OrganisationUnitUncheckedCreateWithoutChildrenInput>
    where?: OrganisationUnitWhereInput
  }

  export type OrganisationUnitUpdateToOneWithWhereWithoutChildrenInput = {
    where?: OrganisationUnitWhereInput
    data: XOR<OrganisationUnitUpdateWithoutChildrenInput, OrganisationUnitUncheckedUpdateWithoutChildrenInput>
  }

  export type OrganisationUnitUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneRequiredWithoutUnitsNestedInput
    parent?: OrganisationUnitUpdateOneWithoutChildrenNestedInput
  }

  export type OrganisationUnitUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    organisationId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUnitUpsertWithWhereUniqueWithoutParentInput = {
    where: OrganisationUnitWhereUniqueInput
    update: XOR<OrganisationUnitUpdateWithoutParentInput, OrganisationUnitUncheckedUpdateWithoutParentInput>
    create: XOR<OrganisationUnitCreateWithoutParentInput, OrganisationUnitUncheckedCreateWithoutParentInput>
  }

  export type OrganisationUnitUpdateWithWhereUniqueWithoutParentInput = {
    where: OrganisationUnitWhereUniqueInput
    data: XOR<OrganisationUnitUpdateWithoutParentInput, OrganisationUnitUncheckedUpdateWithoutParentInput>
  }

  export type OrganisationUnitUpdateManyWithWhereWithoutParentInput = {
    where: OrganisationUnitScalarWhereInput
    data: XOR<OrganisationUnitUpdateManyMutationInput, OrganisationUnitUncheckedUpdateManyWithoutParentInput>
  }

  export type OrganisationCreateManyParentInput = {
    id?: string
    code: string
    name: string
    type: string
    regionId?: string | null
    districtId?: string | null
    isActive?: boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUnitCreateManyOrganisationInput = {
    id?: string
    parentId?: string | null
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUpdateManyWithoutParentNestedInput
    units?: OrganisationUnitUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUncheckedUpdateManyWithoutParentNestedInput
    units?: OrganisationUnitUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUnitUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: OrganisationUnitUpdateOneWithoutChildrenNestedInput
    children?: OrganisationUnitUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUncheckedUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUnitUncheckedUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUncheckedUpdateManyWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUnitCreateManyParentInput = {
    id?: string
    organisationId: string
    code: string
    name: string
    type?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUnitUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneRequiredWithoutUnitsNestedInput
    children?: OrganisationUnitUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    organisationId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: OrganisationUnitUncheckedUpdateManyWithoutParentNestedInput
  }

  export type OrganisationUnitUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    organisationId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use OrganisationCountOutputTypeDefaultArgs instead
     */
    export type OrganisationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganisationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrganisationUnitCountOutputTypeDefaultArgs instead
     */
    export type OrganisationUnitCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganisationUnitCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrganisationDefaultArgs instead
     */
    export type OrganisationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganisationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrganisationUnitDefaultArgs instead
     */
    export type OrganisationUnitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganisationUnitDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}