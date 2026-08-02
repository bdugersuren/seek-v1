
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
 * Model PaymentOrder
 * 
 */
export type PaymentOrder = $Result.DefaultSelection<Prisma.$PaymentOrderPayload>
/**
 * Model PaymentTransaction
 * 
 */
export type PaymentTransaction = $Result.DefaultSelection<Prisma.$PaymentTransactionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PaymentOrders
 * const paymentOrders = await prisma.paymentOrder.findMany()
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
   * // Fetch zero or more PaymentOrders
   * const paymentOrders = await prisma.paymentOrder.findMany()
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
   * `prisma.paymentOrder`: Exposes CRUD operations for the **PaymentOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentOrders
    * const paymentOrders = await prisma.paymentOrder.findMany()
    * ```
    */
  get paymentOrder(): Prisma.PaymentOrderDelegate<ExtArgs>;

  /**
   * `prisma.paymentTransaction`: Exposes CRUD operations for the **PaymentTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentTransactions
    * const paymentTransactions = await prisma.paymentTransaction.findMany()
    * ```
    */
  get paymentTransaction(): Prisma.PaymentTransactionDelegate<ExtArgs>;
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
    PaymentOrder: 'PaymentOrder',
    PaymentTransaction: 'PaymentTransaction'
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
      modelProps: "paymentOrder" | "paymentTransaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PaymentOrder: {
        payload: Prisma.$PaymentOrderPayload<ExtArgs>
        fields: Prisma.PaymentOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          findFirst: {
            args: Prisma.PaymentOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          findMany: {
            args: Prisma.PaymentOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>[]
          }
          create: {
            args: Prisma.PaymentOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          createMany: {
            args: Prisma.PaymentOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>[]
          }
          delete: {
            args: Prisma.PaymentOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          update: {
            args: Prisma.PaymentOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          deleteMany: {
            args: Prisma.PaymentOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          aggregate: {
            args: Prisma.PaymentOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentOrder>
          }
          groupBy: {
            args: Prisma.PaymentOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentOrderCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentOrderCountAggregateOutputType> | number
          }
        }
      }
      PaymentTransaction: {
        payload: Prisma.$PaymentTransactionPayload<ExtArgs>
        fields: Prisma.PaymentTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          findFirst: {
            args: Prisma.PaymentTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          findMany: {
            args: Prisma.PaymentTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>[]
          }
          create: {
            args: Prisma.PaymentTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          createMany: {
            args: Prisma.PaymentTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>[]
          }
          delete: {
            args: Prisma.PaymentTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          update: {
            args: Prisma.PaymentTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          deleteMany: {
            args: Prisma.PaymentTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTransactionPayload>
          }
          aggregate: {
            args: Prisma.PaymentTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentTransaction>
          }
          groupBy: {
            args: Prisma.PaymentTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentTransactionCountAggregateOutputType> | number
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
   * Count Type PaymentOrderCountOutputType
   */

  export type PaymentOrderCountOutputType = {
    transactions: number
  }

  export type PaymentOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | PaymentOrderCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * PaymentOrderCountOutputType without action
   */
  export type PaymentOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrderCountOutputType
     */
    select?: PaymentOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaymentOrderCountOutputType without action
   */
  export type PaymentOrderCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentTransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PaymentOrder
   */

  export type AggregatePaymentOrder = {
    _count: PaymentOrderCountAggregateOutputType | null
    _avg: PaymentOrderAvgAggregateOutputType | null
    _sum: PaymentOrderSumAggregateOutputType | null
    _min: PaymentOrderMinAggregateOutputType | null
    _max: PaymentOrderMaxAggregateOutputType | null
  }

  export type PaymentOrderAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentOrderSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentOrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    scheduleId: string | null
    assignmentId: string | null
    amount: Decimal | null
    currencyCode: string | null
    status: string | null
    provider: string | null
    providerRef: string | null
    idempotencyKey: string | null
    paidAt: Date | null
    refundedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentOrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    scheduleId: string | null
    assignmentId: string | null
    amount: Decimal | null
    currencyCode: string | null
    status: string | null
    provider: string | null
    providerRef: string | null
    idempotencyKey: string | null
    paidAt: Date | null
    refundedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentOrderCountAggregateOutputType = {
    id: number
    userId: number
    scheduleId: number
    assignmentId: number
    amount: number
    currencyCode: number
    status: number
    provider: number
    providerRef: number
    idempotencyKey: number
    paidAt: number
    refundedAt: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentOrderAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentOrderSumAggregateInputType = {
    amount?: true
  }

  export type PaymentOrderMinAggregateInputType = {
    id?: true
    userId?: true
    scheduleId?: true
    assignmentId?: true
    amount?: true
    currencyCode?: true
    status?: true
    provider?: true
    providerRef?: true
    idempotencyKey?: true
    paidAt?: true
    refundedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentOrderMaxAggregateInputType = {
    id?: true
    userId?: true
    scheduleId?: true
    assignmentId?: true
    amount?: true
    currencyCode?: true
    status?: true
    provider?: true
    providerRef?: true
    idempotencyKey?: true
    paidAt?: true
    refundedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentOrderCountAggregateInputType = {
    id?: true
    userId?: true
    scheduleId?: true
    assignmentId?: true
    amount?: true
    currencyCode?: true
    status?: true
    provider?: true
    providerRef?: true
    idempotencyKey?: true
    paidAt?: true
    refundedAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOrder to aggregate.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentOrders
    **/
    _count?: true | PaymentOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentOrderMaxAggregateInputType
  }

  export type GetPaymentOrderAggregateType<T extends PaymentOrderAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentOrder[P]>
      : GetScalarType<T[P], AggregatePaymentOrder[P]>
  }




  export type PaymentOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentOrderWhereInput
    orderBy?: PaymentOrderOrderByWithAggregationInput | PaymentOrderOrderByWithAggregationInput[]
    by: PaymentOrderScalarFieldEnum[] | PaymentOrderScalarFieldEnum
    having?: PaymentOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentOrderCountAggregateInputType | true
    _avg?: PaymentOrderAvgAggregateInputType
    _sum?: PaymentOrderSumAggregateInputType
    _min?: PaymentOrderMinAggregateInputType
    _max?: PaymentOrderMaxAggregateInputType
  }

  export type PaymentOrderGroupByOutputType = {
    id: string
    userId: string
    scheduleId: string | null
    assignmentId: string | null
    amount: Decimal
    currencyCode: string
    status: string
    provider: string | null
    providerRef: string | null
    idempotencyKey: string | null
    paidAt: Date | null
    refundedAt: Date | null
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PaymentOrderCountAggregateOutputType | null
    _avg: PaymentOrderAvgAggregateOutputType | null
    _sum: PaymentOrderSumAggregateOutputType | null
    _min: PaymentOrderMinAggregateOutputType | null
    _max: PaymentOrderMaxAggregateOutputType | null
  }

  type GetPaymentOrderGroupByPayload<T extends PaymentOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentOrderGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentOrderGroupByOutputType[P]>
        }
      >
    >


  export type PaymentOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    scheduleId?: boolean
    assignmentId?: boolean
    amount?: boolean
    currencyCode?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    idempotencyKey?: boolean
    paidAt?: boolean
    refundedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactions?: boolean | PaymentOrder$transactionsArgs<ExtArgs>
    _count?: boolean | PaymentOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentOrder"]>

  export type PaymentOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    scheduleId?: boolean
    assignmentId?: boolean
    amount?: boolean
    currencyCode?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    idempotencyKey?: boolean
    paidAt?: boolean
    refundedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["paymentOrder"]>

  export type PaymentOrderSelectScalar = {
    id?: boolean
    userId?: boolean
    scheduleId?: boolean
    assignmentId?: boolean
    amount?: boolean
    currencyCode?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    idempotencyKey?: boolean
    paidAt?: boolean
    refundedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | PaymentOrder$transactionsArgs<ExtArgs>
    _count?: boolean | PaymentOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaymentOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PaymentOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentOrder"
    objects: {
      transactions: Prisma.$PaymentTransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      scheduleId: string | null
      assignmentId: string | null
      amount: Prisma.Decimal
      currencyCode: string
      status: string
      provider: string | null
      providerRef: string | null
      idempotencyKey: string | null
      paidAt: Date | null
      refundedAt: Date | null
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["paymentOrder"]>
    composites: {}
  }

  type PaymentOrderGetPayload<S extends boolean | null | undefined | PaymentOrderDefaultArgs> = $Result.GetResult<Prisma.$PaymentOrderPayload, S>

  type PaymentOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentOrderCountAggregateInputType | true
    }

  export interface PaymentOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentOrder'], meta: { name: 'PaymentOrder' } }
    /**
     * Find zero or one PaymentOrder that matches the filter.
     * @param {PaymentOrderFindUniqueArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentOrderFindUniqueArgs>(args: SelectSubset<T, PaymentOrderFindUniqueArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentOrderFindUniqueOrThrowArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindFirstArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentOrderFindFirstArgs>(args?: SelectSubset<T, PaymentOrderFindFirstArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindFirstOrThrowArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentOrders
     * const paymentOrders = await prisma.paymentOrder.findMany()
     * 
     * // Get first 10 PaymentOrders
     * const paymentOrders = await prisma.paymentOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentOrderWithIdOnly = await prisma.paymentOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentOrderFindManyArgs>(args?: SelectSubset<T, PaymentOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentOrder.
     * @param {PaymentOrderCreateArgs} args - Arguments to create a PaymentOrder.
     * @example
     * // Create one PaymentOrder
     * const PaymentOrder = await prisma.paymentOrder.create({
     *   data: {
     *     // ... data to create a PaymentOrder
     *   }
     * })
     * 
     */
    create<T extends PaymentOrderCreateArgs>(args: SelectSubset<T, PaymentOrderCreateArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentOrders.
     * @param {PaymentOrderCreateManyArgs} args - Arguments to create many PaymentOrders.
     * @example
     * // Create many PaymentOrders
     * const paymentOrder = await prisma.paymentOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentOrderCreateManyArgs>(args?: SelectSubset<T, PaymentOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentOrders and returns the data saved in the database.
     * @param {PaymentOrderCreateManyAndReturnArgs} args - Arguments to create many PaymentOrders.
     * @example
     * // Create many PaymentOrders
     * const paymentOrder = await prisma.paymentOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentOrders and only return the `id`
     * const paymentOrderWithIdOnly = await prisma.paymentOrder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentOrder.
     * @param {PaymentOrderDeleteArgs} args - Arguments to delete one PaymentOrder.
     * @example
     * // Delete one PaymentOrder
     * const PaymentOrder = await prisma.paymentOrder.delete({
     *   where: {
     *     // ... filter to delete one PaymentOrder
     *   }
     * })
     * 
     */
    delete<T extends PaymentOrderDeleteArgs>(args: SelectSubset<T, PaymentOrderDeleteArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentOrder.
     * @param {PaymentOrderUpdateArgs} args - Arguments to update one PaymentOrder.
     * @example
     * // Update one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentOrderUpdateArgs>(args: SelectSubset<T, PaymentOrderUpdateArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentOrders.
     * @param {PaymentOrderDeleteManyArgs} args - Arguments to filter PaymentOrders to delete.
     * @example
     * // Delete a few PaymentOrders
     * const { count } = await prisma.paymentOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentOrderDeleteManyArgs>(args?: SelectSubset<T, PaymentOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentOrders
     * const paymentOrder = await prisma.paymentOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentOrderUpdateManyArgs>(args: SelectSubset<T, PaymentOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentOrder.
     * @param {PaymentOrderUpsertArgs} args - Arguments to update or create a PaymentOrder.
     * @example
     * // Update or create a PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.upsert({
     *   create: {
     *     // ... data to create a PaymentOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentOrder we want to update
     *   }
     * })
     */
    upsert<T extends PaymentOrderUpsertArgs>(args: SelectSubset<T, PaymentOrderUpsertArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderCountArgs} args - Arguments to filter PaymentOrders to count.
     * @example
     * // Count the number of PaymentOrders
     * const count = await prisma.paymentOrder.count({
     *   where: {
     *     // ... the filter for the PaymentOrders we want to count
     *   }
     * })
    **/
    count<T extends PaymentOrderCountArgs>(
      args?: Subset<T, PaymentOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentOrderAggregateArgs>(args: Subset<T, PaymentOrderAggregateArgs>): Prisma.PrismaPromise<GetPaymentOrderAggregateType<T>>

    /**
     * Group by PaymentOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderGroupByArgs} args - Group by arguments.
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
      T extends PaymentOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentOrderGroupByArgs['orderBy'] }
        : { orderBy?: PaymentOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentOrder model
   */
  readonly fields: PaymentOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends PaymentOrder$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, PaymentOrder$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the PaymentOrder model
   */ 
  interface PaymentOrderFieldRefs {
    readonly id: FieldRef<"PaymentOrder", 'String'>
    readonly userId: FieldRef<"PaymentOrder", 'String'>
    readonly scheduleId: FieldRef<"PaymentOrder", 'String'>
    readonly assignmentId: FieldRef<"PaymentOrder", 'String'>
    readonly amount: FieldRef<"PaymentOrder", 'Decimal'>
    readonly currencyCode: FieldRef<"PaymentOrder", 'String'>
    readonly status: FieldRef<"PaymentOrder", 'String'>
    readonly provider: FieldRef<"PaymentOrder", 'String'>
    readonly providerRef: FieldRef<"PaymentOrder", 'String'>
    readonly idempotencyKey: FieldRef<"PaymentOrder", 'String'>
    readonly paidAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly refundedAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly metadata: FieldRef<"PaymentOrder", 'Json'>
    readonly createdAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"PaymentOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentOrder findUnique
   */
  export type PaymentOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where: PaymentOrderWhereUniqueInput
  }

  /**
   * PaymentOrder findUniqueOrThrow
   */
  export type PaymentOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where: PaymentOrderWhereUniqueInput
  }

  /**
   * PaymentOrder findFirst
   */
  export type PaymentOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOrders.
     */
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }

  /**
   * PaymentOrder findFirstOrThrow
   */
  export type PaymentOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOrders.
     */
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }

  /**
   * PaymentOrder findMany
   */
  export type PaymentOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrders to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }

  /**
   * PaymentOrder create
   */
  export type PaymentOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentOrder.
     */
    data: XOR<PaymentOrderCreateInput, PaymentOrderUncheckedCreateInput>
  }

  /**
   * PaymentOrder createMany
   */
  export type PaymentOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentOrders.
     */
    data: PaymentOrderCreateManyInput | PaymentOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentOrder createManyAndReturn
   */
  export type PaymentOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentOrders.
     */
    data: PaymentOrderCreateManyInput | PaymentOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentOrder update
   */
  export type PaymentOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentOrder.
     */
    data: XOR<PaymentOrderUpdateInput, PaymentOrderUncheckedUpdateInput>
    /**
     * Choose, which PaymentOrder to update.
     */
    where: PaymentOrderWhereUniqueInput
  }

  /**
   * PaymentOrder updateMany
   */
  export type PaymentOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentOrders.
     */
    data: XOR<PaymentOrderUpdateManyMutationInput, PaymentOrderUncheckedUpdateManyInput>
    /**
     * Filter which PaymentOrders to update
     */
    where?: PaymentOrderWhereInput
  }

  /**
   * PaymentOrder upsert
   */
  export type PaymentOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentOrder to update in case it exists.
     */
    where: PaymentOrderWhereUniqueInput
    /**
     * In case the PaymentOrder found by the `where` argument doesn't exist, create a new PaymentOrder with this data.
     */
    create: XOR<PaymentOrderCreateInput, PaymentOrderUncheckedCreateInput>
    /**
     * In case the PaymentOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentOrderUpdateInput, PaymentOrderUncheckedUpdateInput>
  }

  /**
   * PaymentOrder delete
   */
  export type PaymentOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter which PaymentOrder to delete.
     */
    where: PaymentOrderWhereUniqueInput
  }

  /**
   * PaymentOrder deleteMany
   */
  export type PaymentOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOrders to delete
     */
    where?: PaymentOrderWhereInput
  }

  /**
   * PaymentOrder.transactions
   */
  export type PaymentOrder$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    where?: PaymentTransactionWhereInput
    orderBy?: PaymentTransactionOrderByWithRelationInput | PaymentTransactionOrderByWithRelationInput[]
    cursor?: PaymentTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentTransactionScalarFieldEnum | PaymentTransactionScalarFieldEnum[]
  }

  /**
   * PaymentOrder without action
   */
  export type PaymentOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentOrderInclude<ExtArgs> | null
  }


  /**
   * Model PaymentTransaction
   */

  export type AggregatePaymentTransaction = {
    _count: PaymentTransactionCountAggregateOutputType | null
    _avg: PaymentTransactionAvgAggregateOutputType | null
    _sum: PaymentTransactionSumAggregateOutputType | null
    _min: PaymentTransactionMinAggregateOutputType | null
    _max: PaymentTransactionMaxAggregateOutputType | null
  }

  export type PaymentTransactionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentTransactionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentTransactionMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    provider: string | null
    providerRef: string | null
    type: string | null
    status: string | null
    amount: Decimal | null
    createdAt: Date | null
  }

  export type PaymentTransactionMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    provider: string | null
    providerRef: string | null
    type: string | null
    status: string | null
    amount: Decimal | null
    createdAt: Date | null
  }

  export type PaymentTransactionCountAggregateOutputType = {
    id: number
    orderId: number
    provider: number
    providerRef: number
    type: number
    status: number
    amount: number
    payload: number
    createdAt: number
    _all: number
  }


  export type PaymentTransactionAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentTransactionSumAggregateInputType = {
    amount?: true
  }

  export type PaymentTransactionMinAggregateInputType = {
    id?: true
    orderId?: true
    provider?: true
    providerRef?: true
    type?: true
    status?: true
    amount?: true
    createdAt?: true
  }

  export type PaymentTransactionMaxAggregateInputType = {
    id?: true
    orderId?: true
    provider?: true
    providerRef?: true
    type?: true
    status?: true
    amount?: true
    createdAt?: true
  }

  export type PaymentTransactionCountAggregateInputType = {
    id?: true
    orderId?: true
    provider?: true
    providerRef?: true
    type?: true
    status?: true
    amount?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentTransaction to aggregate.
     */
    where?: PaymentTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTransactions to fetch.
     */
    orderBy?: PaymentTransactionOrderByWithRelationInput | PaymentTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentTransactions
    **/
    _count?: true | PaymentTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentTransactionMaxAggregateInputType
  }

  export type GetPaymentTransactionAggregateType<T extends PaymentTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentTransaction[P]>
      : GetScalarType<T[P], AggregatePaymentTransaction[P]>
  }




  export type PaymentTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentTransactionWhereInput
    orderBy?: PaymentTransactionOrderByWithAggregationInput | PaymentTransactionOrderByWithAggregationInput[]
    by: PaymentTransactionScalarFieldEnum[] | PaymentTransactionScalarFieldEnum
    having?: PaymentTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentTransactionCountAggregateInputType | true
    _avg?: PaymentTransactionAvgAggregateInputType
    _sum?: PaymentTransactionSumAggregateInputType
    _min?: PaymentTransactionMinAggregateInputType
    _max?: PaymentTransactionMaxAggregateInputType
  }

  export type PaymentTransactionGroupByOutputType = {
    id: string
    orderId: string
    provider: string
    providerRef: string | null
    type: string
    status: string
    amount: Decimal
    payload: JsonValue
    createdAt: Date
    _count: PaymentTransactionCountAggregateOutputType | null
    _avg: PaymentTransactionAvgAggregateOutputType | null
    _sum: PaymentTransactionSumAggregateOutputType | null
    _min: PaymentTransactionMinAggregateOutputType | null
    _max: PaymentTransactionMaxAggregateOutputType | null
  }

  type GetPaymentTransactionGroupByPayload<T extends PaymentTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentTransactionGroupByOutputType[P]>
        }
      >
    >


  export type PaymentTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    provider?: boolean
    providerRef?: boolean
    type?: boolean
    status?: boolean
    amount?: boolean
    payload?: boolean
    createdAt?: boolean
    order?: boolean | PaymentOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentTransaction"]>

  export type PaymentTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    provider?: boolean
    providerRef?: boolean
    type?: boolean
    status?: boolean
    amount?: boolean
    payload?: boolean
    createdAt?: boolean
    order?: boolean | PaymentOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentTransaction"]>

  export type PaymentTransactionSelectScalar = {
    id?: boolean
    orderId?: boolean
    provider?: boolean
    providerRef?: boolean
    type?: boolean
    status?: boolean
    amount?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type PaymentTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | PaymentOrderDefaultArgs<ExtArgs>
  }
  export type PaymentTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | PaymentOrderDefaultArgs<ExtArgs>
  }

  export type $PaymentTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentTransaction"
    objects: {
      order: Prisma.$PaymentOrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      provider: string
      providerRef: string | null
      type: string
      status: string
      amount: Prisma.Decimal
      payload: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["paymentTransaction"]>
    composites: {}
  }

  type PaymentTransactionGetPayload<S extends boolean | null | undefined | PaymentTransactionDefaultArgs> = $Result.GetResult<Prisma.$PaymentTransactionPayload, S>

  type PaymentTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentTransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentTransactionCountAggregateInputType | true
    }

  export interface PaymentTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentTransaction'], meta: { name: 'PaymentTransaction' } }
    /**
     * Find zero or one PaymentTransaction that matches the filter.
     * @param {PaymentTransactionFindUniqueArgs} args - Arguments to find a PaymentTransaction
     * @example
     * // Get one PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentTransactionFindUniqueArgs>(args: SelectSubset<T, PaymentTransactionFindUniqueArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentTransaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentTransactionFindUniqueOrThrowArgs} args - Arguments to find a PaymentTransaction
     * @example
     * // Get one PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionFindFirstArgs} args - Arguments to find a PaymentTransaction
     * @example
     * // Get one PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentTransactionFindFirstArgs>(args?: SelectSubset<T, PaymentTransactionFindFirstArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionFindFirstOrThrowArgs} args - Arguments to find a PaymentTransaction
     * @example
     * // Get one PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentTransactions
     * const paymentTransactions = await prisma.paymentTransaction.findMany()
     * 
     * // Get first 10 PaymentTransactions
     * const paymentTransactions = await prisma.paymentTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentTransactionWithIdOnly = await prisma.paymentTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentTransactionFindManyArgs>(args?: SelectSubset<T, PaymentTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentTransaction.
     * @param {PaymentTransactionCreateArgs} args - Arguments to create a PaymentTransaction.
     * @example
     * // Create one PaymentTransaction
     * const PaymentTransaction = await prisma.paymentTransaction.create({
     *   data: {
     *     // ... data to create a PaymentTransaction
     *   }
     * })
     * 
     */
    create<T extends PaymentTransactionCreateArgs>(args: SelectSubset<T, PaymentTransactionCreateArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentTransactions.
     * @param {PaymentTransactionCreateManyArgs} args - Arguments to create many PaymentTransactions.
     * @example
     * // Create many PaymentTransactions
     * const paymentTransaction = await prisma.paymentTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentTransactionCreateManyArgs>(args?: SelectSubset<T, PaymentTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentTransactions and returns the data saved in the database.
     * @param {PaymentTransactionCreateManyAndReturnArgs} args - Arguments to create many PaymentTransactions.
     * @example
     * // Create many PaymentTransactions
     * const paymentTransaction = await prisma.paymentTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentTransactions and only return the `id`
     * const paymentTransactionWithIdOnly = await prisma.paymentTransaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentTransaction.
     * @param {PaymentTransactionDeleteArgs} args - Arguments to delete one PaymentTransaction.
     * @example
     * // Delete one PaymentTransaction
     * const PaymentTransaction = await prisma.paymentTransaction.delete({
     *   where: {
     *     // ... filter to delete one PaymentTransaction
     *   }
     * })
     * 
     */
    delete<T extends PaymentTransactionDeleteArgs>(args: SelectSubset<T, PaymentTransactionDeleteArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentTransaction.
     * @param {PaymentTransactionUpdateArgs} args - Arguments to update one PaymentTransaction.
     * @example
     * // Update one PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentTransactionUpdateArgs>(args: SelectSubset<T, PaymentTransactionUpdateArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentTransactions.
     * @param {PaymentTransactionDeleteManyArgs} args - Arguments to filter PaymentTransactions to delete.
     * @example
     * // Delete a few PaymentTransactions
     * const { count } = await prisma.paymentTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentTransactionDeleteManyArgs>(args?: SelectSubset<T, PaymentTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentTransactions
     * const paymentTransaction = await prisma.paymentTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentTransactionUpdateManyArgs>(args: SelectSubset<T, PaymentTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentTransaction.
     * @param {PaymentTransactionUpsertArgs} args - Arguments to update or create a PaymentTransaction.
     * @example
     * // Update or create a PaymentTransaction
     * const paymentTransaction = await prisma.paymentTransaction.upsert({
     *   create: {
     *     // ... data to create a PaymentTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentTransaction we want to update
     *   }
     * })
     */
    upsert<T extends PaymentTransactionUpsertArgs>(args: SelectSubset<T, PaymentTransactionUpsertArgs<ExtArgs>>): Prisma__PaymentTransactionClient<$Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionCountArgs} args - Arguments to filter PaymentTransactions to count.
     * @example
     * // Count the number of PaymentTransactions
     * const count = await prisma.paymentTransaction.count({
     *   where: {
     *     // ... the filter for the PaymentTransactions we want to count
     *   }
     * })
    **/
    count<T extends PaymentTransactionCountArgs>(
      args?: Subset<T, PaymentTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentTransactionAggregateArgs>(args: Subset<T, PaymentTransactionAggregateArgs>): Prisma.PrismaPromise<GetPaymentTransactionAggregateType<T>>

    /**
     * Group by PaymentTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTransactionGroupByArgs} args - Group by arguments.
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
      T extends PaymentTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentTransactionGroupByArgs['orderBy'] }
        : { orderBy?: PaymentTransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentTransaction model
   */
  readonly fields: PaymentTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends PaymentOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentOrderDefaultArgs<ExtArgs>>): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PaymentTransaction model
   */ 
  interface PaymentTransactionFieldRefs {
    readonly id: FieldRef<"PaymentTransaction", 'String'>
    readonly orderId: FieldRef<"PaymentTransaction", 'String'>
    readonly provider: FieldRef<"PaymentTransaction", 'String'>
    readonly providerRef: FieldRef<"PaymentTransaction", 'String'>
    readonly type: FieldRef<"PaymentTransaction", 'String'>
    readonly status: FieldRef<"PaymentTransaction", 'String'>
    readonly amount: FieldRef<"PaymentTransaction", 'Decimal'>
    readonly payload: FieldRef<"PaymentTransaction", 'Json'>
    readonly createdAt: FieldRef<"PaymentTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentTransaction findUnique
   */
  export type PaymentTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTransaction to fetch.
     */
    where: PaymentTransactionWhereUniqueInput
  }

  /**
   * PaymentTransaction findUniqueOrThrow
   */
  export type PaymentTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTransaction to fetch.
     */
    where: PaymentTransactionWhereUniqueInput
  }

  /**
   * PaymentTransaction findFirst
   */
  export type PaymentTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTransaction to fetch.
     */
    where?: PaymentTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTransactions to fetch.
     */
    orderBy?: PaymentTransactionOrderByWithRelationInput | PaymentTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentTransactions.
     */
    cursor?: PaymentTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentTransactions.
     */
    distinct?: PaymentTransactionScalarFieldEnum | PaymentTransactionScalarFieldEnum[]
  }

  /**
   * PaymentTransaction findFirstOrThrow
   */
  export type PaymentTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTransaction to fetch.
     */
    where?: PaymentTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTransactions to fetch.
     */
    orderBy?: PaymentTransactionOrderByWithRelationInput | PaymentTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentTransactions.
     */
    cursor?: PaymentTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentTransactions.
     */
    distinct?: PaymentTransactionScalarFieldEnum | PaymentTransactionScalarFieldEnum[]
  }

  /**
   * PaymentTransaction findMany
   */
  export type PaymentTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTransactions to fetch.
     */
    where?: PaymentTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTransactions to fetch.
     */
    orderBy?: PaymentTransactionOrderByWithRelationInput | PaymentTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentTransactions.
     */
    cursor?: PaymentTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTransactions.
     */
    skip?: number
    distinct?: PaymentTransactionScalarFieldEnum | PaymentTransactionScalarFieldEnum[]
  }

  /**
   * PaymentTransaction create
   */
  export type PaymentTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentTransaction.
     */
    data: XOR<PaymentTransactionCreateInput, PaymentTransactionUncheckedCreateInput>
  }

  /**
   * PaymentTransaction createMany
   */
  export type PaymentTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentTransactions.
     */
    data: PaymentTransactionCreateManyInput | PaymentTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentTransaction createManyAndReturn
   */
  export type PaymentTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentTransactions.
     */
    data: PaymentTransactionCreateManyInput | PaymentTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentTransaction update
   */
  export type PaymentTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentTransaction.
     */
    data: XOR<PaymentTransactionUpdateInput, PaymentTransactionUncheckedUpdateInput>
    /**
     * Choose, which PaymentTransaction to update.
     */
    where: PaymentTransactionWhereUniqueInput
  }

  /**
   * PaymentTransaction updateMany
   */
  export type PaymentTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentTransactions.
     */
    data: XOR<PaymentTransactionUpdateManyMutationInput, PaymentTransactionUncheckedUpdateManyInput>
    /**
     * Filter which PaymentTransactions to update
     */
    where?: PaymentTransactionWhereInput
  }

  /**
   * PaymentTransaction upsert
   */
  export type PaymentTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentTransaction to update in case it exists.
     */
    where: PaymentTransactionWhereUniqueInput
    /**
     * In case the PaymentTransaction found by the `where` argument doesn't exist, create a new PaymentTransaction with this data.
     */
    create: XOR<PaymentTransactionCreateInput, PaymentTransactionUncheckedCreateInput>
    /**
     * In case the PaymentTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentTransactionUpdateInput, PaymentTransactionUncheckedUpdateInput>
  }

  /**
   * PaymentTransaction delete
   */
  export type PaymentTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
    /**
     * Filter which PaymentTransaction to delete.
     */
    where: PaymentTransactionWhereUniqueInput
  }

  /**
   * PaymentTransaction deleteMany
   */
  export type PaymentTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentTransactions to delete
     */
    where?: PaymentTransactionWhereInput
  }

  /**
   * PaymentTransaction without action
   */
  export type PaymentTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentTransaction
     */
    select?: PaymentTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTransactionInclude<ExtArgs> | null
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


  export const PaymentOrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    scheduleId: 'scheduleId',
    assignmentId: 'assignmentId',
    amount: 'amount',
    currencyCode: 'currencyCode',
    status: 'status',
    provider: 'provider',
    providerRef: 'providerRef',
    idempotencyKey: 'idempotencyKey',
    paidAt: 'paidAt',
    refundedAt: 'refundedAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentOrderScalarFieldEnum = (typeof PaymentOrderScalarFieldEnum)[keyof typeof PaymentOrderScalarFieldEnum]


  export const PaymentTransactionScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    provider: 'provider',
    providerRef: 'providerRef',
    type: 'type',
    status: 'status',
    amount: 'amount',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type PaymentTransactionScalarFieldEnum = (typeof PaymentTransactionScalarFieldEnum)[keyof typeof PaymentTransactionScalarFieldEnum]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


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


  export type PaymentOrderWhereInput = {
    AND?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    OR?: PaymentOrderWhereInput[]
    NOT?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    id?: StringFilter<"PaymentOrder"> | string
    userId?: StringFilter<"PaymentOrder"> | string
    scheduleId?: StringNullableFilter<"PaymentOrder"> | string | null
    assignmentId?: StringNullableFilter<"PaymentOrder"> | string | null
    amount?: DecimalFilter<"PaymentOrder"> | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFilter<"PaymentOrder"> | string
    status?: StringFilter<"PaymentOrder"> | string
    provider?: StringNullableFilter<"PaymentOrder"> | string | null
    providerRef?: StringNullableFilter<"PaymentOrder"> | string | null
    idempotencyKey?: StringNullableFilter<"PaymentOrder"> | string | null
    paidAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    refundedAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    metadata?: JsonFilter<"PaymentOrder">
    createdAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    transactions?: PaymentTransactionListRelationFilter
  }

  export type PaymentOrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrderInput | SortOrder
    assignmentId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currencyCode?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerRef?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    refundedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactions?: PaymentTransactionOrderByRelationAggregateInput
  }

  export type PaymentOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_idempotencyKey?: PaymentOrderUserIdIdempotencyKeyCompoundUniqueInput
    AND?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    OR?: PaymentOrderWhereInput[]
    NOT?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    userId?: StringFilter<"PaymentOrder"> | string
    scheduleId?: StringNullableFilter<"PaymentOrder"> | string | null
    assignmentId?: StringNullableFilter<"PaymentOrder"> | string | null
    amount?: DecimalFilter<"PaymentOrder"> | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFilter<"PaymentOrder"> | string
    status?: StringFilter<"PaymentOrder"> | string
    provider?: StringNullableFilter<"PaymentOrder"> | string | null
    providerRef?: StringNullableFilter<"PaymentOrder"> | string | null
    idempotencyKey?: StringNullableFilter<"PaymentOrder"> | string | null
    paidAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    refundedAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    metadata?: JsonFilter<"PaymentOrder">
    createdAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    transactions?: PaymentTransactionListRelationFilter
  }, "id" | "userId_idempotencyKey">

  export type PaymentOrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrderInput | SortOrder
    assignmentId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currencyCode?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerRef?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    refundedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentOrderCountOrderByAggregateInput
    _avg?: PaymentOrderAvgOrderByAggregateInput
    _max?: PaymentOrderMaxOrderByAggregateInput
    _min?: PaymentOrderMinOrderByAggregateInput
    _sum?: PaymentOrderSumOrderByAggregateInput
  }

  export type PaymentOrderScalarWhereWithAggregatesInput = {
    AND?: PaymentOrderScalarWhereWithAggregatesInput | PaymentOrderScalarWhereWithAggregatesInput[]
    OR?: PaymentOrderScalarWhereWithAggregatesInput[]
    NOT?: PaymentOrderScalarWhereWithAggregatesInput | PaymentOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentOrder"> | string
    userId?: StringWithAggregatesFilter<"PaymentOrder"> | string
    scheduleId?: StringNullableWithAggregatesFilter<"PaymentOrder"> | string | null
    assignmentId?: StringNullableWithAggregatesFilter<"PaymentOrder"> | string | null
    amount?: DecimalWithAggregatesFilter<"PaymentOrder"> | Decimal | DecimalJsLike | number | string
    currencyCode?: StringWithAggregatesFilter<"PaymentOrder"> | string
    status?: StringWithAggregatesFilter<"PaymentOrder"> | string
    provider?: StringNullableWithAggregatesFilter<"PaymentOrder"> | string | null
    providerRef?: StringNullableWithAggregatesFilter<"PaymentOrder"> | string | null
    idempotencyKey?: StringNullableWithAggregatesFilter<"PaymentOrder"> | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"PaymentOrder"> | Date | string | null
    refundedAt?: DateTimeNullableWithAggregatesFilter<"PaymentOrder"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"PaymentOrder">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentOrder"> | Date | string
  }

  export type PaymentTransactionWhereInput = {
    AND?: PaymentTransactionWhereInput | PaymentTransactionWhereInput[]
    OR?: PaymentTransactionWhereInput[]
    NOT?: PaymentTransactionWhereInput | PaymentTransactionWhereInput[]
    id?: StringFilter<"PaymentTransaction"> | string
    orderId?: StringFilter<"PaymentTransaction"> | string
    provider?: StringFilter<"PaymentTransaction"> | string
    providerRef?: StringNullableFilter<"PaymentTransaction"> | string | null
    type?: StringFilter<"PaymentTransaction"> | string
    status?: StringFilter<"PaymentTransaction"> | string
    amount?: DecimalFilter<"PaymentTransaction"> | Decimal | DecimalJsLike | number | string
    payload?: JsonFilter<"PaymentTransaction">
    createdAt?: DateTimeFilter<"PaymentTransaction"> | Date | string
    order?: XOR<PaymentOrderRelationFilter, PaymentOrderWhereInput>
  }

  export type PaymentTransactionOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    order?: PaymentOrderOrderByWithRelationInput
  }

  export type PaymentTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentTransactionWhereInput | PaymentTransactionWhereInput[]
    OR?: PaymentTransactionWhereInput[]
    NOT?: PaymentTransactionWhereInput | PaymentTransactionWhereInput[]
    orderId?: StringFilter<"PaymentTransaction"> | string
    provider?: StringFilter<"PaymentTransaction"> | string
    providerRef?: StringNullableFilter<"PaymentTransaction"> | string | null
    type?: StringFilter<"PaymentTransaction"> | string
    status?: StringFilter<"PaymentTransaction"> | string
    amount?: DecimalFilter<"PaymentTransaction"> | Decimal | DecimalJsLike | number | string
    payload?: JsonFilter<"PaymentTransaction">
    createdAt?: DateTimeFilter<"PaymentTransaction"> | Date | string
    order?: XOR<PaymentOrderRelationFilter, PaymentOrderWhereInput>
  }, "id">

  export type PaymentTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentTransactionCountOrderByAggregateInput
    _avg?: PaymentTransactionAvgOrderByAggregateInput
    _max?: PaymentTransactionMaxOrderByAggregateInput
    _min?: PaymentTransactionMinOrderByAggregateInput
    _sum?: PaymentTransactionSumOrderByAggregateInput
  }

  export type PaymentTransactionScalarWhereWithAggregatesInput = {
    AND?: PaymentTransactionScalarWhereWithAggregatesInput | PaymentTransactionScalarWhereWithAggregatesInput[]
    OR?: PaymentTransactionScalarWhereWithAggregatesInput[]
    NOT?: PaymentTransactionScalarWhereWithAggregatesInput | PaymentTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentTransaction"> | string
    orderId?: StringWithAggregatesFilter<"PaymentTransaction"> | string
    provider?: StringWithAggregatesFilter<"PaymentTransaction"> | string
    providerRef?: StringNullableWithAggregatesFilter<"PaymentTransaction"> | string | null
    type?: StringWithAggregatesFilter<"PaymentTransaction"> | string
    status?: StringWithAggregatesFilter<"PaymentTransaction"> | string
    amount?: DecimalWithAggregatesFilter<"PaymentTransaction"> | Decimal | DecimalJsLike | number | string
    payload?: JsonWithAggregatesFilter<"PaymentTransaction">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentTransaction"> | Date | string
  }

  export type PaymentOrderCreateInput = {
    id?: string
    userId: string
    scheduleId?: string | null
    assignmentId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currencyCode: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    idempotencyKey?: string | null
    paidAt?: Date | string | null
    refundedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: PaymentTransactionCreateNestedManyWithoutOrderInput
  }

  export type PaymentOrderUncheckedCreateInput = {
    id?: string
    userId: string
    scheduleId?: string | null
    assignmentId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currencyCode: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    idempotencyKey?: string | null
    paidAt?: Date | string | null
    refundedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: PaymentTransactionUncheckedCreateNestedManyWithoutOrderInput
  }

  export type PaymentOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: PaymentTransactionUpdateManyWithoutOrderNestedInput
  }

  export type PaymentOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: PaymentTransactionUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type PaymentOrderCreateManyInput = {
    id?: string
    userId: string
    scheduleId?: string | null
    assignmentId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currencyCode: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    idempotencyKey?: string | null
    paidAt?: Date | string | null
    refundedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionCreateInput = {
    id?: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    order: PaymentOrderCreateNestedOneWithoutTransactionsInput
  }

  export type PaymentTransactionUncheckedCreateInput = {
    id?: string
    orderId: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: PaymentOrderUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type PaymentTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionCreateManyInput = {
    id?: string
    orderId: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
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

  export type PaymentTransactionListRelationFilter = {
    every?: PaymentTransactionWhereInput
    some?: PaymentTransactionWhereInput
    none?: PaymentTransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderUserIdIdempotencyKeyCompoundUniqueInput = {
    userId: string
    idempotencyKey: string
  }

  export type PaymentOrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    assignmentId?: SortOrder
    amount?: SortOrder
    currencyCode?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    idempotencyKey?: SortOrder
    paidAt?: SortOrder
    refundedAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    assignmentId?: SortOrder
    amount?: SortOrder
    currencyCode?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    idempotencyKey?: SortOrder
    paidAt?: SortOrder
    refundedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    assignmentId?: SortOrder
    amount?: SortOrder
    currencyCode?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    idempotencyKey?: SortOrder
    paidAt?: SortOrder
    refundedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderSumOrderByAggregateInput = {
    amount?: SortOrder
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

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type PaymentOrderRelationFilter = {
    is?: PaymentOrderWhereInput
    isNot?: PaymentOrderWhereInput
  }

  export type PaymentTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentTransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentTransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentTransactionCreateNestedManyWithoutOrderInput = {
    create?: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput> | PaymentTransactionCreateWithoutOrderInput[] | PaymentTransactionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentTransactionCreateOrConnectWithoutOrderInput | PaymentTransactionCreateOrConnectWithoutOrderInput[]
    createMany?: PaymentTransactionCreateManyOrderInputEnvelope
    connect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
  }

  export type PaymentTransactionUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput> | PaymentTransactionCreateWithoutOrderInput[] | PaymentTransactionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentTransactionCreateOrConnectWithoutOrderInput | PaymentTransactionCreateOrConnectWithoutOrderInput[]
    createMany?: PaymentTransactionCreateManyOrderInputEnvelope
    connect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentTransactionUpdateManyWithoutOrderNestedInput = {
    create?: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput> | PaymentTransactionCreateWithoutOrderInput[] | PaymentTransactionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentTransactionCreateOrConnectWithoutOrderInput | PaymentTransactionCreateOrConnectWithoutOrderInput[]
    upsert?: PaymentTransactionUpsertWithWhereUniqueWithoutOrderInput | PaymentTransactionUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: PaymentTransactionCreateManyOrderInputEnvelope
    set?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    disconnect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    delete?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    connect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    update?: PaymentTransactionUpdateWithWhereUniqueWithoutOrderInput | PaymentTransactionUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: PaymentTransactionUpdateManyWithWhereWithoutOrderInput | PaymentTransactionUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: PaymentTransactionScalarWhereInput | PaymentTransactionScalarWhereInput[]
  }

  export type PaymentTransactionUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput> | PaymentTransactionCreateWithoutOrderInput[] | PaymentTransactionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentTransactionCreateOrConnectWithoutOrderInput | PaymentTransactionCreateOrConnectWithoutOrderInput[]
    upsert?: PaymentTransactionUpsertWithWhereUniqueWithoutOrderInput | PaymentTransactionUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: PaymentTransactionCreateManyOrderInputEnvelope
    set?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    disconnect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    delete?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    connect?: PaymentTransactionWhereUniqueInput | PaymentTransactionWhereUniqueInput[]
    update?: PaymentTransactionUpdateWithWhereUniqueWithoutOrderInput | PaymentTransactionUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: PaymentTransactionUpdateManyWithWhereWithoutOrderInput | PaymentTransactionUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: PaymentTransactionScalarWhereInput | PaymentTransactionScalarWhereInput[]
  }

  export type PaymentOrderCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<PaymentOrderCreateWithoutTransactionsInput, PaymentOrderUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutTransactionsInput
    connect?: PaymentOrderWhereUniqueInput
  }

  export type PaymentOrderUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<PaymentOrderCreateWithoutTransactionsInput, PaymentOrderUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutTransactionsInput
    upsert?: PaymentOrderUpsertWithoutTransactionsInput
    connect?: PaymentOrderWhereUniqueInput
    update?: XOR<XOR<PaymentOrderUpdateToOneWithWhereWithoutTransactionsInput, PaymentOrderUpdateWithoutTransactionsInput>, PaymentOrderUncheckedUpdateWithoutTransactionsInput>
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

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
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

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type PaymentTransactionCreateWithoutOrderInput = {
    id?: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentTransactionUncheckedCreateWithoutOrderInput = {
    id?: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentTransactionCreateOrConnectWithoutOrderInput = {
    where: PaymentTransactionWhereUniqueInput
    create: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput>
  }

  export type PaymentTransactionCreateManyOrderInputEnvelope = {
    data: PaymentTransactionCreateManyOrderInput | PaymentTransactionCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type PaymentTransactionUpsertWithWhereUniqueWithoutOrderInput = {
    where: PaymentTransactionWhereUniqueInput
    update: XOR<PaymentTransactionUpdateWithoutOrderInput, PaymentTransactionUncheckedUpdateWithoutOrderInput>
    create: XOR<PaymentTransactionCreateWithoutOrderInput, PaymentTransactionUncheckedCreateWithoutOrderInput>
  }

  export type PaymentTransactionUpdateWithWhereUniqueWithoutOrderInput = {
    where: PaymentTransactionWhereUniqueInput
    data: XOR<PaymentTransactionUpdateWithoutOrderInput, PaymentTransactionUncheckedUpdateWithoutOrderInput>
  }

  export type PaymentTransactionUpdateManyWithWhereWithoutOrderInput = {
    where: PaymentTransactionScalarWhereInput
    data: XOR<PaymentTransactionUpdateManyMutationInput, PaymentTransactionUncheckedUpdateManyWithoutOrderInput>
  }

  export type PaymentTransactionScalarWhereInput = {
    AND?: PaymentTransactionScalarWhereInput | PaymentTransactionScalarWhereInput[]
    OR?: PaymentTransactionScalarWhereInput[]
    NOT?: PaymentTransactionScalarWhereInput | PaymentTransactionScalarWhereInput[]
    id?: StringFilter<"PaymentTransaction"> | string
    orderId?: StringFilter<"PaymentTransaction"> | string
    provider?: StringFilter<"PaymentTransaction"> | string
    providerRef?: StringNullableFilter<"PaymentTransaction"> | string | null
    type?: StringFilter<"PaymentTransaction"> | string
    status?: StringFilter<"PaymentTransaction"> | string
    amount?: DecimalFilter<"PaymentTransaction"> | Decimal | DecimalJsLike | number | string
    payload?: JsonFilter<"PaymentTransaction">
    createdAt?: DateTimeFilter<"PaymentTransaction"> | Date | string
  }

  export type PaymentOrderCreateWithoutTransactionsInput = {
    id?: string
    userId: string
    scheduleId?: string | null
    assignmentId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currencyCode: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    idempotencyKey?: string | null
    paidAt?: Date | string | null
    refundedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderUncheckedCreateWithoutTransactionsInput = {
    id?: string
    userId: string
    scheduleId?: string | null
    assignmentId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currencyCode: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    idempotencyKey?: string | null
    paidAt?: Date | string | null
    refundedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderCreateOrConnectWithoutTransactionsInput = {
    where: PaymentOrderWhereUniqueInput
    create: XOR<PaymentOrderCreateWithoutTransactionsInput, PaymentOrderUncheckedCreateWithoutTransactionsInput>
  }

  export type PaymentOrderUpsertWithoutTransactionsInput = {
    update: XOR<PaymentOrderUpdateWithoutTransactionsInput, PaymentOrderUncheckedUpdateWithoutTransactionsInput>
    create: XOR<PaymentOrderCreateWithoutTransactionsInput, PaymentOrderUncheckedCreateWithoutTransactionsInput>
    where?: PaymentOrderWhereInput
  }

  export type PaymentOrderUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: PaymentOrderWhereInput
    data: XOR<PaymentOrderUpdateWithoutTransactionsInput, PaymentOrderUncheckedUpdateWithoutTransactionsInput>
  }

  export type PaymentOrderUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionCreateManyOrderInput = {
    id?: string
    provider: string
    providerRef?: string | null
    type: string
    status: string
    amount: Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentTransactionUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTransactionUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PaymentOrderCountOutputTypeDefaultArgs instead
     */
    export type PaymentOrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentOrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentOrderDefaultArgs instead
     */
    export type PaymentOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentTransactionDefaultArgs instead
     */
    export type PaymentTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentTransactionDefaultArgs<ExtArgs>

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