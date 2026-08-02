
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
 * Model ReportingAttemptFact
 * 
 */
export type ReportingAttemptFact = $Result.DefaultSelection<Prisma.$ReportingAttemptFactPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ReportingAttemptFacts
 * const reportingAttemptFacts = await prisma.reportingAttemptFact.findMany()
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
   * // Fetch zero or more ReportingAttemptFacts
   * const reportingAttemptFacts = await prisma.reportingAttemptFact.findMany()
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
   * `prisma.reportingAttemptFact`: Exposes CRUD operations for the **ReportingAttemptFact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReportingAttemptFacts
    * const reportingAttemptFacts = await prisma.reportingAttemptFact.findMany()
    * ```
    */
  get reportingAttemptFact(): Prisma.ReportingAttemptFactDelegate<ExtArgs>;
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
    ReportingAttemptFact: 'ReportingAttemptFact'
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
      modelProps: "reportingAttemptFact"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ReportingAttemptFact: {
        payload: Prisma.$ReportingAttemptFactPayload<ExtArgs>
        fields: Prisma.ReportingAttemptFactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportingAttemptFactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportingAttemptFactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          findFirst: {
            args: Prisma.ReportingAttemptFactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportingAttemptFactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          findMany: {
            args: Prisma.ReportingAttemptFactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>[]
          }
          create: {
            args: Prisma.ReportingAttemptFactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          createMany: {
            args: Prisma.ReportingAttemptFactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportingAttemptFactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>[]
          }
          delete: {
            args: Prisma.ReportingAttemptFactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          update: {
            args: Prisma.ReportingAttemptFactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          deleteMany: {
            args: Prisma.ReportingAttemptFactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportingAttemptFactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportingAttemptFactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportingAttemptFactPayload>
          }
          aggregate: {
            args: Prisma.ReportingAttemptFactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReportingAttemptFact>
          }
          groupBy: {
            args: Prisma.ReportingAttemptFactGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportingAttemptFactGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportingAttemptFactCountArgs<ExtArgs>
            result: $Utils.Optional<ReportingAttemptFactCountAggregateOutputType> | number
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
   * Models
   */

  /**
   * Model ReportingAttemptFact
   */

  export type AggregateReportingAttemptFact = {
    _count: ReportingAttemptFactCountAggregateOutputType | null
    _avg: ReportingAttemptFactAvgAggregateOutputType | null
    _sum: ReportingAttemptFactSumAggregateOutputType | null
    _min: ReportingAttemptFactMinAggregateOutputType | null
    _max: ReportingAttemptFactMaxAggregateOutputType | null
  }

  export type ReportingAttemptFactAvgAggregateOutputType = {
    durationSeconds: number | null
    finalScore: Decimal | null
    maxPossibleScore: Decimal | null
    percentage: Decimal | null
  }

  export type ReportingAttemptFactSumAggregateOutputType = {
    durationSeconds: number | null
    finalScore: Decimal | null
    maxPossibleScore: Decimal | null
    percentage: Decimal | null
  }

  export type ReportingAttemptFactMinAggregateOutputType = {
    id: string | null
    attemptId: string | null
    resultId: string | null
    tenantId: string | null
    scheduleId: string | null
    quizId: string | null
    quizRevisionId: string | null
    candidateId: string | null
    organizationId: string | null
    regionId: string | null
    districtId: string | null
    schoolId: string | null
    classId: string | null
    teacherId: string | null
    assessmentContextId: string | null
    startedAt: Date | null
    submittedAt: Date | null
    durationSeconds: number | null
    finalScore: Decimal | null
    maxPossibleScore: Decimal | null
    percentage: Decimal | null
    passStatus: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ReportingAttemptFactMaxAggregateOutputType = {
    id: string | null
    attemptId: string | null
    resultId: string | null
    tenantId: string | null
    scheduleId: string | null
    quizId: string | null
    quizRevisionId: string | null
    candidateId: string | null
    organizationId: string | null
    regionId: string | null
    districtId: string | null
    schoolId: string | null
    classId: string | null
    teacherId: string | null
    assessmentContextId: string | null
    startedAt: Date | null
    submittedAt: Date | null
    durationSeconds: number | null
    finalScore: Decimal | null
    maxPossibleScore: Decimal | null
    percentage: Decimal | null
    passStatus: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ReportingAttemptFactCountAggregateOutputType = {
    id: number
    attemptId: number
    resultId: number
    tenantId: number
    scheduleId: number
    quizId: number
    quizRevisionId: number
    candidateId: number
    organizationId: number
    regionId: number
    districtId: number
    schoolId: number
    classId: number
    teacherId: number
    assessmentContextId: number
    startedAt: number
    submittedAt: number
    durationSeconds: number
    finalScore: number
    maxPossibleScore: number
    percentage: number
    passStatus: number
    status: number
    createdAt: number
    _all: number
  }


  export type ReportingAttemptFactAvgAggregateInputType = {
    durationSeconds?: true
    finalScore?: true
    maxPossibleScore?: true
    percentage?: true
  }

  export type ReportingAttemptFactSumAggregateInputType = {
    durationSeconds?: true
    finalScore?: true
    maxPossibleScore?: true
    percentage?: true
  }

  export type ReportingAttemptFactMinAggregateInputType = {
    id?: true
    attemptId?: true
    resultId?: true
    tenantId?: true
    scheduleId?: true
    quizId?: true
    quizRevisionId?: true
    candidateId?: true
    organizationId?: true
    regionId?: true
    districtId?: true
    schoolId?: true
    classId?: true
    teacherId?: true
    assessmentContextId?: true
    startedAt?: true
    submittedAt?: true
    durationSeconds?: true
    finalScore?: true
    maxPossibleScore?: true
    percentage?: true
    passStatus?: true
    status?: true
    createdAt?: true
  }

  export type ReportingAttemptFactMaxAggregateInputType = {
    id?: true
    attemptId?: true
    resultId?: true
    tenantId?: true
    scheduleId?: true
    quizId?: true
    quizRevisionId?: true
    candidateId?: true
    organizationId?: true
    regionId?: true
    districtId?: true
    schoolId?: true
    classId?: true
    teacherId?: true
    assessmentContextId?: true
    startedAt?: true
    submittedAt?: true
    durationSeconds?: true
    finalScore?: true
    maxPossibleScore?: true
    percentage?: true
    passStatus?: true
    status?: true
    createdAt?: true
  }

  export type ReportingAttemptFactCountAggregateInputType = {
    id?: true
    attemptId?: true
    resultId?: true
    tenantId?: true
    scheduleId?: true
    quizId?: true
    quizRevisionId?: true
    candidateId?: true
    organizationId?: true
    regionId?: true
    districtId?: true
    schoolId?: true
    classId?: true
    teacherId?: true
    assessmentContextId?: true
    startedAt?: true
    submittedAt?: true
    durationSeconds?: true
    finalScore?: true
    maxPossibleScore?: true
    percentage?: true
    passStatus?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ReportingAttemptFactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportingAttemptFact to aggregate.
     */
    where?: ReportingAttemptFactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportingAttemptFacts to fetch.
     */
    orderBy?: ReportingAttemptFactOrderByWithRelationInput | ReportingAttemptFactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportingAttemptFactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportingAttemptFacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportingAttemptFacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReportingAttemptFacts
    **/
    _count?: true | ReportingAttemptFactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportingAttemptFactAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportingAttemptFactSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportingAttemptFactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportingAttemptFactMaxAggregateInputType
  }

  export type GetReportingAttemptFactAggregateType<T extends ReportingAttemptFactAggregateArgs> = {
        [P in keyof T & keyof AggregateReportingAttemptFact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReportingAttemptFact[P]>
      : GetScalarType<T[P], AggregateReportingAttemptFact[P]>
  }




  export type ReportingAttemptFactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportingAttemptFactWhereInput
    orderBy?: ReportingAttemptFactOrderByWithAggregationInput | ReportingAttemptFactOrderByWithAggregationInput[]
    by: ReportingAttemptFactScalarFieldEnum[] | ReportingAttemptFactScalarFieldEnum
    having?: ReportingAttemptFactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportingAttemptFactCountAggregateInputType | true
    _avg?: ReportingAttemptFactAvgAggregateInputType
    _sum?: ReportingAttemptFactSumAggregateInputType
    _min?: ReportingAttemptFactMinAggregateInputType
    _max?: ReportingAttemptFactMaxAggregateInputType
  }

  export type ReportingAttemptFactGroupByOutputType = {
    id: string
    attemptId: string
    resultId: string | null
    tenantId: string | null
    scheduleId: string
    quizId: string
    quizRevisionId: string
    candidateId: string
    organizationId: string | null
    regionId: string | null
    districtId: string | null
    schoolId: string | null
    classId: string | null
    teacherId: string | null
    assessmentContextId: string | null
    startedAt: Date | null
    submittedAt: Date | null
    durationSeconds: number | null
    finalScore: Decimal | null
    maxPossibleScore: Decimal | null
    percentage: Decimal | null
    passStatus: string | null
    status: string
    createdAt: Date
    _count: ReportingAttemptFactCountAggregateOutputType | null
    _avg: ReportingAttemptFactAvgAggregateOutputType | null
    _sum: ReportingAttemptFactSumAggregateOutputType | null
    _min: ReportingAttemptFactMinAggregateOutputType | null
    _max: ReportingAttemptFactMaxAggregateOutputType | null
  }

  type GetReportingAttemptFactGroupByPayload<T extends ReportingAttemptFactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportingAttemptFactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportingAttemptFactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportingAttemptFactGroupByOutputType[P]>
            : GetScalarType<T[P], ReportingAttemptFactGroupByOutputType[P]>
        }
      >
    >


  export type ReportingAttemptFactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attemptId?: boolean
    resultId?: boolean
    tenantId?: boolean
    scheduleId?: boolean
    quizId?: boolean
    quizRevisionId?: boolean
    candidateId?: boolean
    organizationId?: boolean
    regionId?: boolean
    districtId?: boolean
    schoolId?: boolean
    classId?: boolean
    teacherId?: boolean
    assessmentContextId?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    durationSeconds?: boolean
    finalScore?: boolean
    maxPossibleScore?: boolean
    percentage?: boolean
    passStatus?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reportingAttemptFact"]>

  export type ReportingAttemptFactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attemptId?: boolean
    resultId?: boolean
    tenantId?: boolean
    scheduleId?: boolean
    quizId?: boolean
    quizRevisionId?: boolean
    candidateId?: boolean
    organizationId?: boolean
    regionId?: boolean
    districtId?: boolean
    schoolId?: boolean
    classId?: boolean
    teacherId?: boolean
    assessmentContextId?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    durationSeconds?: boolean
    finalScore?: boolean
    maxPossibleScore?: boolean
    percentage?: boolean
    passStatus?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reportingAttemptFact"]>

  export type ReportingAttemptFactSelectScalar = {
    id?: boolean
    attemptId?: boolean
    resultId?: boolean
    tenantId?: boolean
    scheduleId?: boolean
    quizId?: boolean
    quizRevisionId?: boolean
    candidateId?: boolean
    organizationId?: boolean
    regionId?: boolean
    districtId?: boolean
    schoolId?: boolean
    classId?: boolean
    teacherId?: boolean
    assessmentContextId?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    durationSeconds?: boolean
    finalScore?: boolean
    maxPossibleScore?: boolean
    percentage?: boolean
    passStatus?: boolean
    status?: boolean
    createdAt?: boolean
  }


  export type $ReportingAttemptFactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReportingAttemptFact"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      attemptId: string
      resultId: string | null
      tenantId: string | null
      scheduleId: string
      quizId: string
      quizRevisionId: string
      candidateId: string
      organizationId: string | null
      regionId: string | null
      districtId: string | null
      schoolId: string | null
      classId: string | null
      teacherId: string | null
      assessmentContextId: string | null
      startedAt: Date | null
      submittedAt: Date | null
      durationSeconds: number | null
      finalScore: Prisma.Decimal | null
      maxPossibleScore: Prisma.Decimal | null
      percentage: Prisma.Decimal | null
      passStatus: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["reportingAttemptFact"]>
    composites: {}
  }

  type ReportingAttemptFactGetPayload<S extends boolean | null | undefined | ReportingAttemptFactDefaultArgs> = $Result.GetResult<Prisma.$ReportingAttemptFactPayload, S>

  type ReportingAttemptFactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReportingAttemptFactFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReportingAttemptFactCountAggregateInputType | true
    }

  export interface ReportingAttemptFactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReportingAttemptFact'], meta: { name: 'ReportingAttemptFact' } }
    /**
     * Find zero or one ReportingAttemptFact that matches the filter.
     * @param {ReportingAttemptFactFindUniqueArgs} args - Arguments to find a ReportingAttemptFact
     * @example
     * // Get one ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportingAttemptFactFindUniqueArgs>(args: SelectSubset<T, ReportingAttemptFactFindUniqueArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReportingAttemptFact that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReportingAttemptFactFindUniqueOrThrowArgs} args - Arguments to find a ReportingAttemptFact
     * @example
     * // Get one ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportingAttemptFactFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportingAttemptFactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReportingAttemptFact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactFindFirstArgs} args - Arguments to find a ReportingAttemptFact
     * @example
     * // Get one ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportingAttemptFactFindFirstArgs>(args?: SelectSubset<T, ReportingAttemptFactFindFirstArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReportingAttemptFact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactFindFirstOrThrowArgs} args - Arguments to find a ReportingAttemptFact
     * @example
     * // Get one ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportingAttemptFactFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportingAttemptFactFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReportingAttemptFacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReportingAttemptFacts
     * const reportingAttemptFacts = await prisma.reportingAttemptFact.findMany()
     * 
     * // Get first 10 ReportingAttemptFacts
     * const reportingAttemptFacts = await prisma.reportingAttemptFact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportingAttemptFactWithIdOnly = await prisma.reportingAttemptFact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportingAttemptFactFindManyArgs>(args?: SelectSubset<T, ReportingAttemptFactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReportingAttemptFact.
     * @param {ReportingAttemptFactCreateArgs} args - Arguments to create a ReportingAttemptFact.
     * @example
     * // Create one ReportingAttemptFact
     * const ReportingAttemptFact = await prisma.reportingAttemptFact.create({
     *   data: {
     *     // ... data to create a ReportingAttemptFact
     *   }
     * })
     * 
     */
    create<T extends ReportingAttemptFactCreateArgs>(args: SelectSubset<T, ReportingAttemptFactCreateArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReportingAttemptFacts.
     * @param {ReportingAttemptFactCreateManyArgs} args - Arguments to create many ReportingAttemptFacts.
     * @example
     * // Create many ReportingAttemptFacts
     * const reportingAttemptFact = await prisma.reportingAttemptFact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportingAttemptFactCreateManyArgs>(args?: SelectSubset<T, ReportingAttemptFactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReportingAttemptFacts and returns the data saved in the database.
     * @param {ReportingAttemptFactCreateManyAndReturnArgs} args - Arguments to create many ReportingAttemptFacts.
     * @example
     * // Create many ReportingAttemptFacts
     * const reportingAttemptFact = await prisma.reportingAttemptFact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReportingAttemptFacts and only return the `id`
     * const reportingAttemptFactWithIdOnly = await prisma.reportingAttemptFact.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportingAttemptFactCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportingAttemptFactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReportingAttemptFact.
     * @param {ReportingAttemptFactDeleteArgs} args - Arguments to delete one ReportingAttemptFact.
     * @example
     * // Delete one ReportingAttemptFact
     * const ReportingAttemptFact = await prisma.reportingAttemptFact.delete({
     *   where: {
     *     // ... filter to delete one ReportingAttemptFact
     *   }
     * })
     * 
     */
    delete<T extends ReportingAttemptFactDeleteArgs>(args: SelectSubset<T, ReportingAttemptFactDeleteArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReportingAttemptFact.
     * @param {ReportingAttemptFactUpdateArgs} args - Arguments to update one ReportingAttemptFact.
     * @example
     * // Update one ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportingAttemptFactUpdateArgs>(args: SelectSubset<T, ReportingAttemptFactUpdateArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReportingAttemptFacts.
     * @param {ReportingAttemptFactDeleteManyArgs} args - Arguments to filter ReportingAttemptFacts to delete.
     * @example
     * // Delete a few ReportingAttemptFacts
     * const { count } = await prisma.reportingAttemptFact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportingAttemptFactDeleteManyArgs>(args?: SelectSubset<T, ReportingAttemptFactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReportingAttemptFacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReportingAttemptFacts
     * const reportingAttemptFact = await prisma.reportingAttemptFact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportingAttemptFactUpdateManyArgs>(args: SelectSubset<T, ReportingAttemptFactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReportingAttemptFact.
     * @param {ReportingAttemptFactUpsertArgs} args - Arguments to update or create a ReportingAttemptFact.
     * @example
     * // Update or create a ReportingAttemptFact
     * const reportingAttemptFact = await prisma.reportingAttemptFact.upsert({
     *   create: {
     *     // ... data to create a ReportingAttemptFact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReportingAttemptFact we want to update
     *   }
     * })
     */
    upsert<T extends ReportingAttemptFactUpsertArgs>(args: SelectSubset<T, ReportingAttemptFactUpsertArgs<ExtArgs>>): Prisma__ReportingAttemptFactClient<$Result.GetResult<Prisma.$ReportingAttemptFactPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReportingAttemptFacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactCountArgs} args - Arguments to filter ReportingAttemptFacts to count.
     * @example
     * // Count the number of ReportingAttemptFacts
     * const count = await prisma.reportingAttemptFact.count({
     *   where: {
     *     // ... the filter for the ReportingAttemptFacts we want to count
     *   }
     * })
    **/
    count<T extends ReportingAttemptFactCountArgs>(
      args?: Subset<T, ReportingAttemptFactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportingAttemptFactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReportingAttemptFact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReportingAttemptFactAggregateArgs>(args: Subset<T, ReportingAttemptFactAggregateArgs>): Prisma.PrismaPromise<GetReportingAttemptFactAggregateType<T>>

    /**
     * Group by ReportingAttemptFact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportingAttemptFactGroupByArgs} args - Group by arguments.
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
      T extends ReportingAttemptFactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportingAttemptFactGroupByArgs['orderBy'] }
        : { orderBy?: ReportingAttemptFactGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReportingAttemptFactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportingAttemptFactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReportingAttemptFact model
   */
  readonly fields: ReportingAttemptFactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReportingAttemptFact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportingAttemptFactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the ReportingAttemptFact model
   */ 
  interface ReportingAttemptFactFieldRefs {
    readonly id: FieldRef<"ReportingAttemptFact", 'String'>
    readonly attemptId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly resultId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly tenantId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly scheduleId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly quizId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly quizRevisionId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly candidateId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly organizationId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly regionId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly districtId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly schoolId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly classId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly teacherId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly assessmentContextId: FieldRef<"ReportingAttemptFact", 'String'>
    readonly startedAt: FieldRef<"ReportingAttemptFact", 'DateTime'>
    readonly submittedAt: FieldRef<"ReportingAttemptFact", 'DateTime'>
    readonly durationSeconds: FieldRef<"ReportingAttemptFact", 'Int'>
    readonly finalScore: FieldRef<"ReportingAttemptFact", 'Decimal'>
    readonly maxPossibleScore: FieldRef<"ReportingAttemptFact", 'Decimal'>
    readonly percentage: FieldRef<"ReportingAttemptFact", 'Decimal'>
    readonly passStatus: FieldRef<"ReportingAttemptFact", 'String'>
    readonly status: FieldRef<"ReportingAttemptFact", 'String'>
    readonly createdAt: FieldRef<"ReportingAttemptFact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReportingAttemptFact findUnique
   */
  export type ReportingAttemptFactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter, which ReportingAttemptFact to fetch.
     */
    where: ReportingAttemptFactWhereUniqueInput
  }

  /**
   * ReportingAttemptFact findUniqueOrThrow
   */
  export type ReportingAttemptFactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter, which ReportingAttemptFact to fetch.
     */
    where: ReportingAttemptFactWhereUniqueInput
  }

  /**
   * ReportingAttemptFact findFirst
   */
  export type ReportingAttemptFactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter, which ReportingAttemptFact to fetch.
     */
    where?: ReportingAttemptFactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportingAttemptFacts to fetch.
     */
    orderBy?: ReportingAttemptFactOrderByWithRelationInput | ReportingAttemptFactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportingAttemptFacts.
     */
    cursor?: ReportingAttemptFactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportingAttemptFacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportingAttemptFacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportingAttemptFacts.
     */
    distinct?: ReportingAttemptFactScalarFieldEnum | ReportingAttemptFactScalarFieldEnum[]
  }

  /**
   * ReportingAttemptFact findFirstOrThrow
   */
  export type ReportingAttemptFactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter, which ReportingAttemptFact to fetch.
     */
    where?: ReportingAttemptFactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportingAttemptFacts to fetch.
     */
    orderBy?: ReportingAttemptFactOrderByWithRelationInput | ReportingAttemptFactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportingAttemptFacts.
     */
    cursor?: ReportingAttemptFactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportingAttemptFacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportingAttemptFacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportingAttemptFacts.
     */
    distinct?: ReportingAttemptFactScalarFieldEnum | ReportingAttemptFactScalarFieldEnum[]
  }

  /**
   * ReportingAttemptFact findMany
   */
  export type ReportingAttemptFactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter, which ReportingAttemptFacts to fetch.
     */
    where?: ReportingAttemptFactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportingAttemptFacts to fetch.
     */
    orderBy?: ReportingAttemptFactOrderByWithRelationInput | ReportingAttemptFactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReportingAttemptFacts.
     */
    cursor?: ReportingAttemptFactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportingAttemptFacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportingAttemptFacts.
     */
    skip?: number
    distinct?: ReportingAttemptFactScalarFieldEnum | ReportingAttemptFactScalarFieldEnum[]
  }

  /**
   * ReportingAttemptFact create
   */
  export type ReportingAttemptFactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * The data needed to create a ReportingAttemptFact.
     */
    data: XOR<ReportingAttemptFactCreateInput, ReportingAttemptFactUncheckedCreateInput>
  }

  /**
   * ReportingAttemptFact createMany
   */
  export type ReportingAttemptFactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReportingAttemptFacts.
     */
    data: ReportingAttemptFactCreateManyInput | ReportingAttemptFactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReportingAttemptFact createManyAndReturn
   */
  export type ReportingAttemptFactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReportingAttemptFacts.
     */
    data: ReportingAttemptFactCreateManyInput | ReportingAttemptFactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReportingAttemptFact update
   */
  export type ReportingAttemptFactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * The data needed to update a ReportingAttemptFact.
     */
    data: XOR<ReportingAttemptFactUpdateInput, ReportingAttemptFactUncheckedUpdateInput>
    /**
     * Choose, which ReportingAttemptFact to update.
     */
    where: ReportingAttemptFactWhereUniqueInput
  }

  /**
   * ReportingAttemptFact updateMany
   */
  export type ReportingAttemptFactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReportingAttemptFacts.
     */
    data: XOR<ReportingAttemptFactUpdateManyMutationInput, ReportingAttemptFactUncheckedUpdateManyInput>
    /**
     * Filter which ReportingAttemptFacts to update
     */
    where?: ReportingAttemptFactWhereInput
  }

  /**
   * ReportingAttemptFact upsert
   */
  export type ReportingAttemptFactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * The filter to search for the ReportingAttemptFact to update in case it exists.
     */
    where: ReportingAttemptFactWhereUniqueInput
    /**
     * In case the ReportingAttemptFact found by the `where` argument doesn't exist, create a new ReportingAttemptFact with this data.
     */
    create: XOR<ReportingAttemptFactCreateInput, ReportingAttemptFactUncheckedCreateInput>
    /**
     * In case the ReportingAttemptFact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportingAttemptFactUpdateInput, ReportingAttemptFactUncheckedUpdateInput>
  }

  /**
   * ReportingAttemptFact delete
   */
  export type ReportingAttemptFactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
    /**
     * Filter which ReportingAttemptFact to delete.
     */
    where: ReportingAttemptFactWhereUniqueInput
  }

  /**
   * ReportingAttemptFact deleteMany
   */
  export type ReportingAttemptFactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportingAttemptFacts to delete
     */
    where?: ReportingAttemptFactWhereInput
  }

  /**
   * ReportingAttemptFact without action
   */
  export type ReportingAttemptFactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportingAttemptFact
     */
    select?: ReportingAttemptFactSelect<ExtArgs> | null
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


  export const ReportingAttemptFactScalarFieldEnum: {
    id: 'id',
    attemptId: 'attemptId',
    resultId: 'resultId',
    tenantId: 'tenantId',
    scheduleId: 'scheduleId',
    quizId: 'quizId',
    quizRevisionId: 'quizRevisionId',
    candidateId: 'candidateId',
    organizationId: 'organizationId',
    regionId: 'regionId',
    districtId: 'districtId',
    schoolId: 'schoolId',
    classId: 'classId',
    teacherId: 'teacherId',
    assessmentContextId: 'assessmentContextId',
    startedAt: 'startedAt',
    submittedAt: 'submittedAt',
    durationSeconds: 'durationSeconds',
    finalScore: 'finalScore',
    maxPossibleScore: 'maxPossibleScore',
    percentage: 'percentage',
    passStatus: 'passStatus',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ReportingAttemptFactScalarFieldEnum = (typeof ReportingAttemptFactScalarFieldEnum)[keyof typeof ReportingAttemptFactScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ReportingAttemptFactWhereInput = {
    AND?: ReportingAttemptFactWhereInput | ReportingAttemptFactWhereInput[]
    OR?: ReportingAttemptFactWhereInput[]
    NOT?: ReportingAttemptFactWhereInput | ReportingAttemptFactWhereInput[]
    id?: StringFilter<"ReportingAttemptFact"> | string
    attemptId?: StringFilter<"ReportingAttemptFact"> | string
    resultId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    tenantId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    scheduleId?: StringFilter<"ReportingAttemptFact"> | string
    quizId?: StringFilter<"ReportingAttemptFact"> | string
    quizRevisionId?: StringFilter<"ReportingAttemptFact"> | string
    candidateId?: StringFilter<"ReportingAttemptFact"> | string
    organizationId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    regionId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    districtId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    schoolId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    classId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    teacherId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    assessmentContextId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    startedAt?: DateTimeNullableFilter<"ReportingAttemptFact"> | Date | string | null
    submittedAt?: DateTimeNullableFilter<"ReportingAttemptFact"> | Date | string | null
    durationSeconds?: IntNullableFilter<"ReportingAttemptFact"> | number | null
    finalScore?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    percentage?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    passStatus?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    status?: StringFilter<"ReportingAttemptFact"> | string
    createdAt?: DateTimeFilter<"ReportingAttemptFact"> | Date | string
  }

  export type ReportingAttemptFactOrderByWithRelationInput = {
    id?: SortOrder
    attemptId?: SortOrder
    resultId?: SortOrderInput | SortOrder
    tenantId?: SortOrderInput | SortOrder
    scheduleId?: SortOrder
    quizId?: SortOrder
    quizRevisionId?: SortOrder
    candidateId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    schoolId?: SortOrderInput | SortOrder
    classId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    assessmentContextId?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    finalScore?: SortOrderInput | SortOrder
    maxPossibleScore?: SortOrderInput | SortOrder
    percentage?: SortOrderInput | SortOrder
    passStatus?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportingAttemptFactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    attemptId?: string
    AND?: ReportingAttemptFactWhereInput | ReportingAttemptFactWhereInput[]
    OR?: ReportingAttemptFactWhereInput[]
    NOT?: ReportingAttemptFactWhereInput | ReportingAttemptFactWhereInput[]
    resultId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    tenantId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    scheduleId?: StringFilter<"ReportingAttemptFact"> | string
    quizId?: StringFilter<"ReportingAttemptFact"> | string
    quizRevisionId?: StringFilter<"ReportingAttemptFact"> | string
    candidateId?: StringFilter<"ReportingAttemptFact"> | string
    organizationId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    regionId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    districtId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    schoolId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    classId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    teacherId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    assessmentContextId?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    startedAt?: DateTimeNullableFilter<"ReportingAttemptFact"> | Date | string | null
    submittedAt?: DateTimeNullableFilter<"ReportingAttemptFact"> | Date | string | null
    durationSeconds?: IntNullableFilter<"ReportingAttemptFact"> | number | null
    finalScore?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    percentage?: DecimalNullableFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    passStatus?: StringNullableFilter<"ReportingAttemptFact"> | string | null
    status?: StringFilter<"ReportingAttemptFact"> | string
    createdAt?: DateTimeFilter<"ReportingAttemptFact"> | Date | string
  }, "id" | "attemptId">

  export type ReportingAttemptFactOrderByWithAggregationInput = {
    id?: SortOrder
    attemptId?: SortOrder
    resultId?: SortOrderInput | SortOrder
    tenantId?: SortOrderInput | SortOrder
    scheduleId?: SortOrder
    quizId?: SortOrder
    quizRevisionId?: SortOrder
    candidateId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    schoolId?: SortOrderInput | SortOrder
    classId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    assessmentContextId?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    finalScore?: SortOrderInput | SortOrder
    maxPossibleScore?: SortOrderInput | SortOrder
    percentage?: SortOrderInput | SortOrder
    passStatus?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ReportingAttemptFactCountOrderByAggregateInput
    _avg?: ReportingAttemptFactAvgOrderByAggregateInput
    _max?: ReportingAttemptFactMaxOrderByAggregateInput
    _min?: ReportingAttemptFactMinOrderByAggregateInput
    _sum?: ReportingAttemptFactSumOrderByAggregateInput
  }

  export type ReportingAttemptFactScalarWhereWithAggregatesInput = {
    AND?: ReportingAttemptFactScalarWhereWithAggregatesInput | ReportingAttemptFactScalarWhereWithAggregatesInput[]
    OR?: ReportingAttemptFactScalarWhereWithAggregatesInput[]
    NOT?: ReportingAttemptFactScalarWhereWithAggregatesInput | ReportingAttemptFactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    attemptId?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    resultId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    tenantId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    scheduleId?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    quizId?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    quizRevisionId?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    candidateId?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    organizationId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    regionId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    districtId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    schoolId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    classId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    teacherId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    assessmentContextId?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"ReportingAttemptFact"> | Date | string | null
    submittedAt?: DateTimeNullableWithAggregatesFilter<"ReportingAttemptFact"> | Date | string | null
    durationSeconds?: IntNullableWithAggregatesFilter<"ReportingAttemptFact"> | number | null
    finalScore?: DecimalNullableWithAggregatesFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: DecimalNullableWithAggregatesFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    percentage?: DecimalNullableWithAggregatesFilter<"ReportingAttemptFact"> | Decimal | DecimalJsLike | number | string | null
    passStatus?: StringNullableWithAggregatesFilter<"ReportingAttemptFact"> | string | null
    status?: StringWithAggregatesFilter<"ReportingAttemptFact"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ReportingAttemptFact"> | Date | string
  }

  export type ReportingAttemptFactCreateInput = {
    id?: string
    attemptId: string
    resultId?: string | null
    tenantId?: string | null
    scheduleId: string
    quizId: string
    quizRevisionId: string
    candidateId: string
    organizationId?: string | null
    regionId?: string | null
    districtId?: string | null
    schoolId?: string | null
    classId?: string | null
    teacherId?: string | null
    assessmentContextId?: string | null
    startedAt?: Date | string | null
    submittedAt?: Date | string | null
    durationSeconds?: number | null
    finalScore?: Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: Decimal | DecimalJsLike | number | string | null
    percentage?: Decimal | DecimalJsLike | number | string | null
    passStatus?: string | null
    status: string
    createdAt?: Date | string
  }

  export type ReportingAttemptFactUncheckedCreateInput = {
    id?: string
    attemptId: string
    resultId?: string | null
    tenantId?: string | null
    scheduleId: string
    quizId: string
    quizRevisionId: string
    candidateId: string
    organizationId?: string | null
    regionId?: string | null
    districtId?: string | null
    schoolId?: string | null
    classId?: string | null
    teacherId?: string | null
    assessmentContextId?: string | null
    startedAt?: Date | string | null
    submittedAt?: Date | string | null
    durationSeconds?: number | null
    finalScore?: Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: Decimal | DecimalJsLike | number | string | null
    percentage?: Decimal | DecimalJsLike | number | string | null
    passStatus?: string | null
    status: string
    createdAt?: Date | string
  }

  export type ReportingAttemptFactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptId?: StringFieldUpdateOperationsInput | string
    resultId?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    quizRevisionId?: StringFieldUpdateOperationsInput | string
    candidateId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    assessmentContextId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    finalScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    percentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    passStatus?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportingAttemptFactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptId?: StringFieldUpdateOperationsInput | string
    resultId?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    quizRevisionId?: StringFieldUpdateOperationsInput | string
    candidateId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    assessmentContextId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    finalScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    percentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    passStatus?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportingAttemptFactCreateManyInput = {
    id?: string
    attemptId: string
    resultId?: string | null
    tenantId?: string | null
    scheduleId: string
    quizId: string
    quizRevisionId: string
    candidateId: string
    organizationId?: string | null
    regionId?: string | null
    districtId?: string | null
    schoolId?: string | null
    classId?: string | null
    teacherId?: string | null
    assessmentContextId?: string | null
    startedAt?: Date | string | null
    submittedAt?: Date | string | null
    durationSeconds?: number | null
    finalScore?: Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: Decimal | DecimalJsLike | number | string | null
    percentage?: Decimal | DecimalJsLike | number | string | null
    passStatus?: string | null
    status: string
    createdAt?: Date | string
  }

  export type ReportingAttemptFactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptId?: StringFieldUpdateOperationsInput | string
    resultId?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    quizRevisionId?: StringFieldUpdateOperationsInput | string
    candidateId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    assessmentContextId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    finalScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    percentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    passStatus?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportingAttemptFactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptId?: StringFieldUpdateOperationsInput | string
    resultId?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    quizRevisionId?: StringFieldUpdateOperationsInput | string
    candidateId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    assessmentContextId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    finalScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPossibleScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    percentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    passStatus?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReportingAttemptFactCountOrderByAggregateInput = {
    id?: SortOrder
    attemptId?: SortOrder
    resultId?: SortOrder
    tenantId?: SortOrder
    scheduleId?: SortOrder
    quizId?: SortOrder
    quizRevisionId?: SortOrder
    candidateId?: SortOrder
    organizationId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    teacherId?: SortOrder
    assessmentContextId?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
    durationSeconds?: SortOrder
    finalScore?: SortOrder
    maxPossibleScore?: SortOrder
    percentage?: SortOrder
    passStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportingAttemptFactAvgOrderByAggregateInput = {
    durationSeconds?: SortOrder
    finalScore?: SortOrder
    maxPossibleScore?: SortOrder
    percentage?: SortOrder
  }

  export type ReportingAttemptFactMaxOrderByAggregateInput = {
    id?: SortOrder
    attemptId?: SortOrder
    resultId?: SortOrder
    tenantId?: SortOrder
    scheduleId?: SortOrder
    quizId?: SortOrder
    quizRevisionId?: SortOrder
    candidateId?: SortOrder
    organizationId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    teacherId?: SortOrder
    assessmentContextId?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
    durationSeconds?: SortOrder
    finalScore?: SortOrder
    maxPossibleScore?: SortOrder
    percentage?: SortOrder
    passStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportingAttemptFactMinOrderByAggregateInput = {
    id?: SortOrder
    attemptId?: SortOrder
    resultId?: SortOrder
    tenantId?: SortOrder
    scheduleId?: SortOrder
    quizId?: SortOrder
    quizRevisionId?: SortOrder
    candidateId?: SortOrder
    organizationId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    teacherId?: SortOrder
    assessmentContextId?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
    durationSeconds?: SortOrder
    finalScore?: SortOrder
    maxPossibleScore?: SortOrder
    percentage?: SortOrder
    passStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportingAttemptFactSumOrderByAggregateInput = {
    durationSeconds?: SortOrder
    finalScore?: SortOrder
    maxPossibleScore?: SortOrder
    percentage?: SortOrder
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ReportingAttemptFactDefaultArgs instead
     */
    export type ReportingAttemptFactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReportingAttemptFactDefaultArgs<ExtArgs>

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