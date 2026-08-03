
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
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model ProfileVerification
 * 
 */
export type ProfileVerification = $Result.DefaultSelection<Prisma.$ProfileVerificationPayload>
/**
 * Model ProfileDocument
 * 
 */
export type ProfileDocument = $Result.DefaultSelection<Prisma.$ProfileDocumentPayload>
/**
 * Model ProfileAuditLog
 * 
 */
export type ProfileAuditLog = $Result.DefaultSelection<Prisma.$ProfileAuditLogPayload>
/**
 * Model ProfileLocation
 * 
 */
export type ProfileLocation = $Result.DefaultSelection<Prisma.$ProfileLocationPayload>
/**
 * Model EducationRecord
 * 
 */
export type EducationRecord = $Result.DefaultSelection<Prisma.$EducationRecordPayload>
/**
 * Model WorkRecord
 * 
 */
export type WorkRecord = $Result.DefaultSelection<Prisma.$WorkRecordPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more UserProfiles
 * const userProfiles = await prisma.userProfile.findMany()
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
   * // Fetch zero or more UserProfiles
   * const userProfiles = await prisma.userProfile.findMany()
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
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs>;

  /**
   * `prisma.profileVerification`: Exposes CRUD operations for the **ProfileVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileVerifications
    * const profileVerifications = await prisma.profileVerification.findMany()
    * ```
    */
  get profileVerification(): Prisma.ProfileVerificationDelegate<ExtArgs>;

  /**
   * `prisma.profileDocument`: Exposes CRUD operations for the **ProfileDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileDocuments
    * const profileDocuments = await prisma.profileDocument.findMany()
    * ```
    */
  get profileDocument(): Prisma.ProfileDocumentDelegate<ExtArgs>;

  /**
   * `prisma.profileAuditLog`: Exposes CRUD operations for the **ProfileAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileAuditLogs
    * const profileAuditLogs = await prisma.profileAuditLog.findMany()
    * ```
    */
  get profileAuditLog(): Prisma.ProfileAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.profileLocation`: Exposes CRUD operations for the **ProfileLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileLocations
    * const profileLocations = await prisma.profileLocation.findMany()
    * ```
    */
  get profileLocation(): Prisma.ProfileLocationDelegate<ExtArgs>;

  /**
   * `prisma.educationRecord`: Exposes CRUD operations for the **EducationRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EducationRecords
    * const educationRecords = await prisma.educationRecord.findMany()
    * ```
    */
  get educationRecord(): Prisma.EducationRecordDelegate<ExtArgs>;

  /**
   * `prisma.workRecord`: Exposes CRUD operations for the **WorkRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkRecords
    * const workRecords = await prisma.workRecord.findMany()
    * ```
    */
  get workRecord(): Prisma.WorkRecordDelegate<ExtArgs>;
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
    UserProfile: 'UserProfile',
    ProfileVerification: 'ProfileVerification',
    ProfileDocument: 'ProfileDocument',
    ProfileAuditLog: 'ProfileAuditLog',
    ProfileLocation: 'ProfileLocation',
    EducationRecord: 'EducationRecord',
    WorkRecord: 'WorkRecord'
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
      modelProps: "userProfile" | "profileVerification" | "profileDocument" | "profileAuditLog" | "profileLocation" | "educationRecord" | "workRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      ProfileVerification: {
        payload: Prisma.$ProfileVerificationPayload<ExtArgs>
        fields: Prisma.ProfileVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          findFirst: {
            args: Prisma.ProfileVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          findMany: {
            args: Prisma.ProfileVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>[]
          }
          create: {
            args: Prisma.ProfileVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          createMany: {
            args: Prisma.ProfileVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>[]
          }
          delete: {
            args: Prisma.ProfileVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          update: {
            args: Prisma.ProfileVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          deleteMany: {
            args: Prisma.ProfileVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileVerificationPayload>
          }
          aggregate: {
            args: Prisma.ProfileVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileVerification>
          }
          groupBy: {
            args: Prisma.ProfileVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileVerificationCountAggregateOutputType> | number
          }
        }
      }
      ProfileDocument: {
        payload: Prisma.$ProfileDocumentPayload<ExtArgs>
        fields: Prisma.ProfileDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          findFirst: {
            args: Prisma.ProfileDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          findMany: {
            args: Prisma.ProfileDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>[]
          }
          create: {
            args: Prisma.ProfileDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          createMany: {
            args: Prisma.ProfileDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>[]
          }
          delete: {
            args: Prisma.ProfileDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          update: {
            args: Prisma.ProfileDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          deleteMany: {
            args: Prisma.ProfileDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileDocumentPayload>
          }
          aggregate: {
            args: Prisma.ProfileDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileDocument>
          }
          groupBy: {
            args: Prisma.ProfileDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileDocumentCountAggregateOutputType> | number
          }
        }
      }
      ProfileAuditLog: {
        payload: Prisma.$ProfileAuditLogPayload<ExtArgs>
        fields: Prisma.ProfileAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          findFirst: {
            args: Prisma.ProfileAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          findMany: {
            args: Prisma.ProfileAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>[]
          }
          create: {
            args: Prisma.ProfileAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          createMany: {
            args: Prisma.ProfileAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>[]
          }
          delete: {
            args: Prisma.ProfileAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          update: {
            args: Prisma.ProfileAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.ProfileAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileAuditLogPayload>
          }
          aggregate: {
            args: Prisma.ProfileAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileAuditLog>
          }
          groupBy: {
            args: Prisma.ProfileAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileAuditLogCountAggregateOutputType> | number
          }
        }
      }
      ProfileLocation: {
        payload: Prisma.$ProfileLocationPayload<ExtArgs>
        fields: Prisma.ProfileLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          findFirst: {
            args: Prisma.ProfileLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          findMany: {
            args: Prisma.ProfileLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>[]
          }
          create: {
            args: Prisma.ProfileLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          createMany: {
            args: Prisma.ProfileLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>[]
          }
          delete: {
            args: Prisma.ProfileLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          update: {
            args: Prisma.ProfileLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          deleteMany: {
            args: Prisma.ProfileLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileLocationPayload>
          }
          aggregate: {
            args: Prisma.ProfileLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileLocation>
          }
          groupBy: {
            args: Prisma.ProfileLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileLocationCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileLocationCountAggregateOutputType> | number
          }
        }
      }
      EducationRecord: {
        payload: Prisma.$EducationRecordPayload<ExtArgs>
        fields: Prisma.EducationRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EducationRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EducationRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          findFirst: {
            args: Prisma.EducationRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EducationRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          findMany: {
            args: Prisma.EducationRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>[]
          }
          create: {
            args: Prisma.EducationRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          createMany: {
            args: Prisma.EducationRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EducationRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>[]
          }
          delete: {
            args: Prisma.EducationRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          update: {
            args: Prisma.EducationRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          deleteMany: {
            args: Prisma.EducationRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EducationRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EducationRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationRecordPayload>
          }
          aggregate: {
            args: Prisma.EducationRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEducationRecord>
          }
          groupBy: {
            args: Prisma.EducationRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<EducationRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.EducationRecordCountArgs<ExtArgs>
            result: $Utils.Optional<EducationRecordCountAggregateOutputType> | number
          }
        }
      }
      WorkRecord: {
        payload: Prisma.$WorkRecordPayload<ExtArgs>
        fields: Prisma.WorkRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          findFirst: {
            args: Prisma.WorkRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          findMany: {
            args: Prisma.WorkRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>[]
          }
          create: {
            args: Prisma.WorkRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          createMany: {
            args: Prisma.WorkRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>[]
          }
          delete: {
            args: Prisma.WorkRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          update: {
            args: Prisma.WorkRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          deleteMany: {
            args: Prisma.WorkRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkRecordPayload>
          }
          aggregate: {
            args: Prisma.WorkRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkRecord>
          }
          groupBy: {
            args: Prisma.WorkRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkRecordCountArgs<ExtArgs>
            result: $Utils.Optional<WorkRecordCountAggregateOutputType> | number
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
   * Count Type UserProfileCountOutputType
   */

  export type UserProfileCountOutputType = {
    locations: number
    education: number
    workHistory: number
    verifications: number
    documents: number
    auditLogs: number
  }

  export type UserProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | UserProfileCountOutputTypeCountLocationsArgs
    education?: boolean | UserProfileCountOutputTypeCountEducationArgs
    workHistory?: boolean | UserProfileCountOutputTypeCountWorkHistoryArgs
    verifications?: boolean | UserProfileCountOutputTypeCountVerificationsArgs
    documents?: boolean | UserProfileCountOutputTypeCountDocumentsArgs
    auditLogs?: boolean | UserProfileCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfileCountOutputType
     */
    select?: UserProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileLocationWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountEducationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationRecordWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountWorkHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkRecordWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountVerificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileVerificationWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileDocumentWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileAuditLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    phoneNumberVerifiedAt: Date | null
    organisation: string | null
    birthDate: Date | null
    gender: string | null
    country: string | null
    address: string | null
    preferredLanguage: string | null
    completionStatus: string | null
    verifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    phoneNumberVerifiedAt: Date | null
    organisation: string | null
    birthDate: Date | null
    gender: string | null
    country: string | null
    address: string | null
    preferredLanguage: string | null
    completionStatus: string | null
    verifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    userId: number
    displayName: number
    firstName: number
    lastName: number
    phoneNumber: number
    phoneNumberVerifiedAt: number
    organisation: number
    birthDate: number
    gender: number
    country: number
    address: number
    preferredLanguage: number
    completionStatus: number
    verifiedAt: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileMinAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    firstName?: true
    lastName?: true
    phoneNumber?: true
    phoneNumberVerifiedAt?: true
    organisation?: true
    birthDate?: true
    gender?: true
    country?: true
    address?: true
    preferredLanguage?: true
    completionStatus?: true
    verifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    firstName?: true
    lastName?: true
    phoneNumber?: true
    phoneNumberVerifiedAt?: true
    organisation?: true
    birthDate?: true
    gender?: true
    country?: true
    address?: true
    preferredLanguage?: true
    completionStatus?: true
    verifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    firstName?: true
    lastName?: true
    phoneNumber?: true
    phoneNumberVerifiedAt?: true
    organisation?: true
    birthDate?: true
    gender?: true
    country?: true
    address?: true
    preferredLanguage?: true
    completionStatus?: true
    verifiedAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    userId: string
    displayName: string | null
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    phoneNumberVerifiedAt: Date | null
    organisation: string | null
    birthDate: Date | null
    gender: string | null
    country: string | null
    address: string | null
    preferredLanguage: string | null
    completionStatus: string | null
    verifiedAt: Date | null
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    firstName?: boolean
    lastName?: boolean
    phoneNumber?: boolean
    phoneNumberVerifiedAt?: boolean
    organisation?: boolean
    birthDate?: boolean
    gender?: boolean
    country?: boolean
    address?: boolean
    preferredLanguage?: boolean
    completionStatus?: boolean
    verifiedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locations?: boolean | UserProfile$locationsArgs<ExtArgs>
    education?: boolean | UserProfile$educationArgs<ExtArgs>
    workHistory?: boolean | UserProfile$workHistoryArgs<ExtArgs>
    verifications?: boolean | UserProfile$verificationsArgs<ExtArgs>
    documents?: boolean | UserProfile$documentsArgs<ExtArgs>
    auditLogs?: boolean | UserProfile$auditLogsArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    firstName?: boolean
    lastName?: boolean
    phoneNumber?: boolean
    phoneNumberVerifiedAt?: boolean
    organisation?: boolean
    birthDate?: boolean
    gender?: boolean
    country?: boolean
    address?: boolean
    preferredLanguage?: boolean
    completionStatus?: boolean
    verifiedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    displayName?: boolean
    firstName?: boolean
    lastName?: boolean
    phoneNumber?: boolean
    phoneNumberVerifiedAt?: boolean
    organisation?: boolean
    birthDate?: boolean
    gender?: boolean
    country?: boolean
    address?: boolean
    preferredLanguage?: boolean
    completionStatus?: boolean
    verifiedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | UserProfile$locationsArgs<ExtArgs>
    education?: boolean | UserProfile$educationArgs<ExtArgs>
    workHistory?: boolean | UserProfile$workHistoryArgs<ExtArgs>
    verifications?: boolean | UserProfile$verificationsArgs<ExtArgs>
    documents?: boolean | UserProfile$documentsArgs<ExtArgs>
    auditLogs?: boolean | UserProfile$auditLogsArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      locations: Prisma.$ProfileLocationPayload<ExtArgs>[]
      education: Prisma.$EducationRecordPayload<ExtArgs>[]
      workHistory: Prisma.$WorkRecordPayload<ExtArgs>[]
      verifications: Prisma.$ProfileVerificationPayload<ExtArgs>[]
      documents: Prisma.$ProfileDocumentPayload<ExtArgs>[]
      auditLogs: Prisma.$ProfileAuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      displayName: string | null
      firstName: string | null
      lastName: string | null
      phoneNumber: string | null
      phoneNumberVerifiedAt: Date | null
      organisation: string | null
      birthDate: Date | null
      gender: string | null
      country: string | null
      address: string | null
      preferredLanguage: string | null
      completionStatus: string | null
      verifiedAt: Date | null
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
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
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    locations<T extends UserProfile$locationsArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findMany"> | Null>
    education<T extends UserProfile$educationArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$educationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findMany"> | Null>
    workHistory<T extends UserProfile$workHistoryArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$workHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findMany"> | Null>
    verifications<T extends UserProfile$verificationsArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$verificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findMany"> | Null>
    documents<T extends UserProfile$documentsArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends UserProfile$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the UserProfile model
   */ 
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly userId: FieldRef<"UserProfile", 'String'>
    readonly displayName: FieldRef<"UserProfile", 'String'>
    readonly firstName: FieldRef<"UserProfile", 'String'>
    readonly lastName: FieldRef<"UserProfile", 'String'>
    readonly phoneNumber: FieldRef<"UserProfile", 'String'>
    readonly phoneNumberVerifiedAt: FieldRef<"UserProfile", 'DateTime'>
    readonly organisation: FieldRef<"UserProfile", 'String'>
    readonly birthDate: FieldRef<"UserProfile", 'DateTime'>
    readonly gender: FieldRef<"UserProfile", 'String'>
    readonly country: FieldRef<"UserProfile", 'String'>
    readonly address: FieldRef<"UserProfile", 'String'>
    readonly preferredLanguage: FieldRef<"UserProfile", 'String'>
    readonly completionStatus: FieldRef<"UserProfile", 'String'>
    readonly verifiedAt: FieldRef<"UserProfile", 'DateTime'>
    readonly metadata: FieldRef<"UserProfile", 'Json'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile.locations
   */
  export type UserProfile$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    where?: ProfileLocationWhereInput
    orderBy?: ProfileLocationOrderByWithRelationInput | ProfileLocationOrderByWithRelationInput[]
    cursor?: ProfileLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileLocationScalarFieldEnum | ProfileLocationScalarFieldEnum[]
  }

  /**
   * UserProfile.education
   */
  export type UserProfile$educationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    where?: EducationRecordWhereInput
    orderBy?: EducationRecordOrderByWithRelationInput | EducationRecordOrderByWithRelationInput[]
    cursor?: EducationRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EducationRecordScalarFieldEnum | EducationRecordScalarFieldEnum[]
  }

  /**
   * UserProfile.workHistory
   */
  export type UserProfile$workHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    where?: WorkRecordWhereInput
    orderBy?: WorkRecordOrderByWithRelationInput | WorkRecordOrderByWithRelationInput[]
    cursor?: WorkRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkRecordScalarFieldEnum | WorkRecordScalarFieldEnum[]
  }

  /**
   * UserProfile.verifications
   */
  export type UserProfile$verificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    where?: ProfileVerificationWhereInput
    orderBy?: ProfileVerificationOrderByWithRelationInput | ProfileVerificationOrderByWithRelationInput[]
    cursor?: ProfileVerificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileVerificationScalarFieldEnum | ProfileVerificationScalarFieldEnum[]
  }

  /**
   * UserProfile.documents
   */
  export type UserProfile$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    where?: ProfileDocumentWhereInput
    orderBy?: ProfileDocumentOrderByWithRelationInput | ProfileDocumentOrderByWithRelationInput[]
    cursor?: ProfileDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileDocumentScalarFieldEnum | ProfileDocumentScalarFieldEnum[]
  }

  /**
   * UserProfile.auditLogs
   */
  export type UserProfile$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    where?: ProfileAuditLogWhereInput
    orderBy?: ProfileAuditLogOrderByWithRelationInput | ProfileAuditLogOrderByWithRelationInput[]
    cursor?: ProfileAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileAuditLogScalarFieldEnum | ProfileAuditLogScalarFieldEnum[]
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model ProfileVerification
   */

  export type AggregateProfileVerification = {
    _count: ProfileVerificationCountAggregateOutputType | null
    _min: ProfileVerificationMinAggregateOutputType | null
    _max: ProfileVerificationMaxAggregateOutputType | null
  }

  export type ProfileVerificationMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    status: string | null
    type: string | null
    rejectedReason: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileVerificationMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    status: string | null
    type: string | null
    rejectedReason: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileVerificationCountAggregateOutputType = {
    id: number
    profileId: number
    status: number
    type: number
    rejectedReason: number
    reviewedBy: number
    reviewedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileVerificationMinAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    type?: true
    rejectedReason?: true
    reviewedBy?: true
    reviewedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileVerificationMaxAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    type?: true
    rejectedReason?: true
    reviewedBy?: true
    reviewedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileVerificationCountAggregateInputType = {
    id?: true
    profileId?: true
    status?: true
    type?: true
    rejectedReason?: true
    reviewedBy?: true
    reviewedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileVerification to aggregate.
     */
    where?: ProfileVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileVerifications to fetch.
     */
    orderBy?: ProfileVerificationOrderByWithRelationInput | ProfileVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileVerifications
    **/
    _count?: true | ProfileVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileVerificationMaxAggregateInputType
  }

  export type GetProfileVerificationAggregateType<T extends ProfileVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileVerification[P]>
      : GetScalarType<T[P], AggregateProfileVerification[P]>
  }




  export type ProfileVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileVerificationWhereInput
    orderBy?: ProfileVerificationOrderByWithAggregationInput | ProfileVerificationOrderByWithAggregationInput[]
    by: ProfileVerificationScalarFieldEnum[] | ProfileVerificationScalarFieldEnum
    having?: ProfileVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileVerificationCountAggregateInputType | true
    _min?: ProfileVerificationMinAggregateInputType
    _max?: ProfileVerificationMaxAggregateInputType
  }

  export type ProfileVerificationGroupByOutputType = {
    id: string
    profileId: string
    status: string
    type: string
    rejectedReason: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileVerificationCountAggregateOutputType | null
    _min: ProfileVerificationMinAggregateOutputType | null
    _max: ProfileVerificationMaxAggregateOutputType | null
  }

  type GetProfileVerificationGroupByPayload<T extends ProfileVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileVerificationGroupByOutputType[P]>
        }
      >
    >


  export type ProfileVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    status?: boolean
    type?: boolean
    rejectedReason?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileVerification"]>

  export type ProfileVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    status?: boolean
    type?: boolean
    rejectedReason?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileVerification"]>

  export type ProfileVerificationSelectScalar = {
    id?: boolean
    profileId?: boolean
    status?: boolean
    type?: boolean
    rejectedReason?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileVerificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type ProfileVerificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $ProfileVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileVerification"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      status: string
      type: string
      rejectedReason: string | null
      reviewedBy: string | null
      reviewedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profileVerification"]>
    composites: {}
  }

  type ProfileVerificationGetPayload<S extends boolean | null | undefined | ProfileVerificationDefaultArgs> = $Result.GetResult<Prisma.$ProfileVerificationPayload, S>

  type ProfileVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileVerificationCountAggregateInputType | true
    }

  export interface ProfileVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileVerification'], meta: { name: 'ProfileVerification' } }
    /**
     * Find zero or one ProfileVerification that matches the filter.
     * @param {ProfileVerificationFindUniqueArgs} args - Arguments to find a ProfileVerification
     * @example
     * // Get one ProfileVerification
     * const profileVerification = await prisma.profileVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileVerificationFindUniqueArgs>(args: SelectSubset<T, ProfileVerificationFindUniqueArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileVerification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileVerificationFindUniqueOrThrowArgs} args - Arguments to find a ProfileVerification
     * @example
     * // Get one ProfileVerification
     * const profileVerification = await prisma.profileVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationFindFirstArgs} args - Arguments to find a ProfileVerification
     * @example
     * // Get one ProfileVerification
     * const profileVerification = await prisma.profileVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileVerificationFindFirstArgs>(args?: SelectSubset<T, ProfileVerificationFindFirstArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationFindFirstOrThrowArgs} args - Arguments to find a ProfileVerification
     * @example
     * // Get one ProfileVerification
     * const profileVerification = await prisma.profileVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileVerifications
     * const profileVerifications = await prisma.profileVerification.findMany()
     * 
     * // Get first 10 ProfileVerifications
     * const profileVerifications = await prisma.profileVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileVerificationWithIdOnly = await prisma.profileVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileVerificationFindManyArgs>(args?: SelectSubset<T, ProfileVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileVerification.
     * @param {ProfileVerificationCreateArgs} args - Arguments to create a ProfileVerification.
     * @example
     * // Create one ProfileVerification
     * const ProfileVerification = await prisma.profileVerification.create({
     *   data: {
     *     // ... data to create a ProfileVerification
     *   }
     * })
     * 
     */
    create<T extends ProfileVerificationCreateArgs>(args: SelectSubset<T, ProfileVerificationCreateArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileVerifications.
     * @param {ProfileVerificationCreateManyArgs} args - Arguments to create many ProfileVerifications.
     * @example
     * // Create many ProfileVerifications
     * const profileVerification = await prisma.profileVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileVerificationCreateManyArgs>(args?: SelectSubset<T, ProfileVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileVerifications and returns the data saved in the database.
     * @param {ProfileVerificationCreateManyAndReturnArgs} args - Arguments to create many ProfileVerifications.
     * @example
     * // Create many ProfileVerifications
     * const profileVerification = await prisma.profileVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileVerifications and only return the `id`
     * const profileVerificationWithIdOnly = await prisma.profileVerification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProfileVerification.
     * @param {ProfileVerificationDeleteArgs} args - Arguments to delete one ProfileVerification.
     * @example
     * // Delete one ProfileVerification
     * const ProfileVerification = await prisma.profileVerification.delete({
     *   where: {
     *     // ... filter to delete one ProfileVerification
     *   }
     * })
     * 
     */
    delete<T extends ProfileVerificationDeleteArgs>(args: SelectSubset<T, ProfileVerificationDeleteArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileVerification.
     * @param {ProfileVerificationUpdateArgs} args - Arguments to update one ProfileVerification.
     * @example
     * // Update one ProfileVerification
     * const profileVerification = await prisma.profileVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileVerificationUpdateArgs>(args: SelectSubset<T, ProfileVerificationUpdateArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileVerifications.
     * @param {ProfileVerificationDeleteManyArgs} args - Arguments to filter ProfileVerifications to delete.
     * @example
     * // Delete a few ProfileVerifications
     * const { count } = await prisma.profileVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileVerificationDeleteManyArgs>(args?: SelectSubset<T, ProfileVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileVerifications
     * const profileVerification = await prisma.profileVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileVerificationUpdateManyArgs>(args: SelectSubset<T, ProfileVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileVerification.
     * @param {ProfileVerificationUpsertArgs} args - Arguments to update or create a ProfileVerification.
     * @example
     * // Update or create a ProfileVerification
     * const profileVerification = await prisma.profileVerification.upsert({
     *   create: {
     *     // ... data to create a ProfileVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileVerification we want to update
     *   }
     * })
     */
    upsert<T extends ProfileVerificationUpsertArgs>(args: SelectSubset<T, ProfileVerificationUpsertArgs<ExtArgs>>): Prisma__ProfileVerificationClient<$Result.GetResult<Prisma.$ProfileVerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationCountArgs} args - Arguments to filter ProfileVerifications to count.
     * @example
     * // Count the number of ProfileVerifications
     * const count = await prisma.profileVerification.count({
     *   where: {
     *     // ... the filter for the ProfileVerifications we want to count
     *   }
     * })
    **/
    count<T extends ProfileVerificationCountArgs>(
      args?: Subset<T, ProfileVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileVerificationAggregateArgs>(args: Subset<T, ProfileVerificationAggregateArgs>): Prisma.PrismaPromise<GetProfileVerificationAggregateType<T>>

    /**
     * Group by ProfileVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileVerificationGroupByArgs} args - Group by arguments.
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
      T extends ProfileVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileVerificationGroupByArgs['orderBy'] }
        : { orderBy?: ProfileVerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileVerification model
   */
  readonly fields: ProfileVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ProfileVerification model
   */ 
  interface ProfileVerificationFieldRefs {
    readonly id: FieldRef<"ProfileVerification", 'String'>
    readonly profileId: FieldRef<"ProfileVerification", 'String'>
    readonly status: FieldRef<"ProfileVerification", 'String'>
    readonly type: FieldRef<"ProfileVerification", 'String'>
    readonly rejectedReason: FieldRef<"ProfileVerification", 'String'>
    readonly reviewedBy: FieldRef<"ProfileVerification", 'String'>
    readonly reviewedAt: FieldRef<"ProfileVerification", 'DateTime'>
    readonly createdAt: FieldRef<"ProfileVerification", 'DateTime'>
    readonly updatedAt: FieldRef<"ProfileVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileVerification findUnique
   */
  export type ProfileVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileVerification to fetch.
     */
    where: ProfileVerificationWhereUniqueInput
  }

  /**
   * ProfileVerification findUniqueOrThrow
   */
  export type ProfileVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileVerification to fetch.
     */
    where: ProfileVerificationWhereUniqueInput
  }

  /**
   * ProfileVerification findFirst
   */
  export type ProfileVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileVerification to fetch.
     */
    where?: ProfileVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileVerifications to fetch.
     */
    orderBy?: ProfileVerificationOrderByWithRelationInput | ProfileVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileVerifications.
     */
    cursor?: ProfileVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileVerifications.
     */
    distinct?: ProfileVerificationScalarFieldEnum | ProfileVerificationScalarFieldEnum[]
  }

  /**
   * ProfileVerification findFirstOrThrow
   */
  export type ProfileVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileVerification to fetch.
     */
    where?: ProfileVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileVerifications to fetch.
     */
    orderBy?: ProfileVerificationOrderByWithRelationInput | ProfileVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileVerifications.
     */
    cursor?: ProfileVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileVerifications.
     */
    distinct?: ProfileVerificationScalarFieldEnum | ProfileVerificationScalarFieldEnum[]
  }

  /**
   * ProfileVerification findMany
   */
  export type ProfileVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileVerifications to fetch.
     */
    where?: ProfileVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileVerifications to fetch.
     */
    orderBy?: ProfileVerificationOrderByWithRelationInput | ProfileVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileVerifications.
     */
    cursor?: ProfileVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileVerifications.
     */
    skip?: number
    distinct?: ProfileVerificationScalarFieldEnum | ProfileVerificationScalarFieldEnum[]
  }

  /**
   * ProfileVerification create
   */
  export type ProfileVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileVerification.
     */
    data: XOR<ProfileVerificationCreateInput, ProfileVerificationUncheckedCreateInput>
  }

  /**
   * ProfileVerification createMany
   */
  export type ProfileVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileVerifications.
     */
    data: ProfileVerificationCreateManyInput | ProfileVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileVerification createManyAndReturn
   */
  export type ProfileVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProfileVerifications.
     */
    data: ProfileVerificationCreateManyInput | ProfileVerificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileVerification update
   */
  export type ProfileVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileVerification.
     */
    data: XOR<ProfileVerificationUpdateInput, ProfileVerificationUncheckedUpdateInput>
    /**
     * Choose, which ProfileVerification to update.
     */
    where: ProfileVerificationWhereUniqueInput
  }

  /**
   * ProfileVerification updateMany
   */
  export type ProfileVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileVerifications.
     */
    data: XOR<ProfileVerificationUpdateManyMutationInput, ProfileVerificationUncheckedUpdateManyInput>
    /**
     * Filter which ProfileVerifications to update
     */
    where?: ProfileVerificationWhereInput
  }

  /**
   * ProfileVerification upsert
   */
  export type ProfileVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileVerification to update in case it exists.
     */
    where: ProfileVerificationWhereUniqueInput
    /**
     * In case the ProfileVerification found by the `where` argument doesn't exist, create a new ProfileVerification with this data.
     */
    create: XOR<ProfileVerificationCreateInput, ProfileVerificationUncheckedCreateInput>
    /**
     * In case the ProfileVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileVerificationUpdateInput, ProfileVerificationUncheckedUpdateInput>
  }

  /**
   * ProfileVerification delete
   */
  export type ProfileVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
    /**
     * Filter which ProfileVerification to delete.
     */
    where: ProfileVerificationWhereUniqueInput
  }

  /**
   * ProfileVerification deleteMany
   */
  export type ProfileVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileVerifications to delete
     */
    where?: ProfileVerificationWhereInput
  }

  /**
   * ProfileVerification without action
   */
  export type ProfileVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileVerification
     */
    select?: ProfileVerificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileVerificationInclude<ExtArgs> | null
  }


  /**
   * Model ProfileDocument
   */

  export type AggregateProfileDocument = {
    _count: ProfileDocumentCountAggregateOutputType | null
    _avg: ProfileDocumentAvgAggregateOutputType | null
    _sum: ProfileDocumentSumAggregateOutputType | null
    _min: ProfileDocumentMinAggregateOutputType | null
    _max: ProfileDocumentMaxAggregateOutputType | null
  }

  export type ProfileDocumentAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type ProfileDocumentSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type ProfileDocumentMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    type: string | null
    name: string | null
    storageKey: string | null
    mimeType: string | null
    sizeBytes: number | null
    status: string | null
    uploadedAt: Date | null
  }

  export type ProfileDocumentMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    type: string | null
    name: string | null
    storageKey: string | null
    mimeType: string | null
    sizeBytes: number | null
    status: string | null
    uploadedAt: Date | null
  }

  export type ProfileDocumentCountAggregateOutputType = {
    id: number
    profileId: number
    type: number
    name: number
    storageKey: number
    mimeType: number
    sizeBytes: number
    status: number
    uploadedAt: number
    _all: number
  }


  export type ProfileDocumentAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type ProfileDocumentSumAggregateInputType = {
    sizeBytes?: true
  }

  export type ProfileDocumentMinAggregateInputType = {
    id?: true
    profileId?: true
    type?: true
    name?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    status?: true
    uploadedAt?: true
  }

  export type ProfileDocumentMaxAggregateInputType = {
    id?: true
    profileId?: true
    type?: true
    name?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    status?: true
    uploadedAt?: true
  }

  export type ProfileDocumentCountAggregateInputType = {
    id?: true
    profileId?: true
    type?: true
    name?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    status?: true
    uploadedAt?: true
    _all?: true
  }

  export type ProfileDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileDocument to aggregate.
     */
    where?: ProfileDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileDocuments to fetch.
     */
    orderBy?: ProfileDocumentOrderByWithRelationInput | ProfileDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileDocuments
    **/
    _count?: true | ProfileDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileDocumentMaxAggregateInputType
  }

  export type GetProfileDocumentAggregateType<T extends ProfileDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileDocument[P]>
      : GetScalarType<T[P], AggregateProfileDocument[P]>
  }




  export type ProfileDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileDocumentWhereInput
    orderBy?: ProfileDocumentOrderByWithAggregationInput | ProfileDocumentOrderByWithAggregationInput[]
    by: ProfileDocumentScalarFieldEnum[] | ProfileDocumentScalarFieldEnum
    having?: ProfileDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileDocumentCountAggregateInputType | true
    _avg?: ProfileDocumentAvgAggregateInputType
    _sum?: ProfileDocumentSumAggregateInputType
    _min?: ProfileDocumentMinAggregateInputType
    _max?: ProfileDocumentMaxAggregateInputType
  }

  export type ProfileDocumentGroupByOutputType = {
    id: string
    profileId: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt: Date
    _count: ProfileDocumentCountAggregateOutputType | null
    _avg: ProfileDocumentAvgAggregateOutputType | null
    _sum: ProfileDocumentSumAggregateOutputType | null
    _min: ProfileDocumentMinAggregateOutputType | null
    _max: ProfileDocumentMaxAggregateOutputType | null
  }

  type GetProfileDocumentGroupByPayload<T extends ProfileDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileDocumentGroupByOutputType[P]>
        }
      >
    >


  export type ProfileDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    type?: boolean
    name?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    status?: boolean
    uploadedAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileDocument"]>

  export type ProfileDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    type?: boolean
    name?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    status?: boolean
    uploadedAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileDocument"]>

  export type ProfileDocumentSelectScalar = {
    id?: boolean
    profileId?: boolean
    type?: boolean
    name?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    status?: boolean
    uploadedAt?: boolean
  }

  export type ProfileDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type ProfileDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $ProfileDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileDocument"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      type: string
      name: string
      storageKey: string
      mimeType: string
      sizeBytes: number
      status: string
      uploadedAt: Date
    }, ExtArgs["result"]["profileDocument"]>
    composites: {}
  }

  type ProfileDocumentGetPayload<S extends boolean | null | undefined | ProfileDocumentDefaultArgs> = $Result.GetResult<Prisma.$ProfileDocumentPayload, S>

  type ProfileDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileDocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileDocumentCountAggregateInputType | true
    }

  export interface ProfileDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileDocument'], meta: { name: 'ProfileDocument' } }
    /**
     * Find zero or one ProfileDocument that matches the filter.
     * @param {ProfileDocumentFindUniqueArgs} args - Arguments to find a ProfileDocument
     * @example
     * // Get one ProfileDocument
     * const profileDocument = await prisma.profileDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileDocumentFindUniqueArgs>(args: SelectSubset<T, ProfileDocumentFindUniqueArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileDocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileDocumentFindUniqueOrThrowArgs} args - Arguments to find a ProfileDocument
     * @example
     * // Get one ProfileDocument
     * const profileDocument = await prisma.profileDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentFindFirstArgs} args - Arguments to find a ProfileDocument
     * @example
     * // Get one ProfileDocument
     * const profileDocument = await prisma.profileDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileDocumentFindFirstArgs>(args?: SelectSubset<T, ProfileDocumentFindFirstArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentFindFirstOrThrowArgs} args - Arguments to find a ProfileDocument
     * @example
     * // Get one ProfileDocument
     * const profileDocument = await prisma.profileDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileDocuments
     * const profileDocuments = await prisma.profileDocument.findMany()
     * 
     * // Get first 10 ProfileDocuments
     * const profileDocuments = await prisma.profileDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileDocumentWithIdOnly = await prisma.profileDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileDocumentFindManyArgs>(args?: SelectSubset<T, ProfileDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileDocument.
     * @param {ProfileDocumentCreateArgs} args - Arguments to create a ProfileDocument.
     * @example
     * // Create one ProfileDocument
     * const ProfileDocument = await prisma.profileDocument.create({
     *   data: {
     *     // ... data to create a ProfileDocument
     *   }
     * })
     * 
     */
    create<T extends ProfileDocumentCreateArgs>(args: SelectSubset<T, ProfileDocumentCreateArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileDocuments.
     * @param {ProfileDocumentCreateManyArgs} args - Arguments to create many ProfileDocuments.
     * @example
     * // Create many ProfileDocuments
     * const profileDocument = await prisma.profileDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileDocumentCreateManyArgs>(args?: SelectSubset<T, ProfileDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileDocuments and returns the data saved in the database.
     * @param {ProfileDocumentCreateManyAndReturnArgs} args - Arguments to create many ProfileDocuments.
     * @example
     * // Create many ProfileDocuments
     * const profileDocument = await prisma.profileDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileDocuments and only return the `id`
     * const profileDocumentWithIdOnly = await prisma.profileDocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProfileDocument.
     * @param {ProfileDocumentDeleteArgs} args - Arguments to delete one ProfileDocument.
     * @example
     * // Delete one ProfileDocument
     * const ProfileDocument = await prisma.profileDocument.delete({
     *   where: {
     *     // ... filter to delete one ProfileDocument
     *   }
     * })
     * 
     */
    delete<T extends ProfileDocumentDeleteArgs>(args: SelectSubset<T, ProfileDocumentDeleteArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileDocument.
     * @param {ProfileDocumentUpdateArgs} args - Arguments to update one ProfileDocument.
     * @example
     * // Update one ProfileDocument
     * const profileDocument = await prisma.profileDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileDocumentUpdateArgs>(args: SelectSubset<T, ProfileDocumentUpdateArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileDocuments.
     * @param {ProfileDocumentDeleteManyArgs} args - Arguments to filter ProfileDocuments to delete.
     * @example
     * // Delete a few ProfileDocuments
     * const { count } = await prisma.profileDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDocumentDeleteManyArgs>(args?: SelectSubset<T, ProfileDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileDocuments
     * const profileDocument = await prisma.profileDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileDocumentUpdateManyArgs>(args: SelectSubset<T, ProfileDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileDocument.
     * @param {ProfileDocumentUpsertArgs} args - Arguments to update or create a ProfileDocument.
     * @example
     * // Update or create a ProfileDocument
     * const profileDocument = await prisma.profileDocument.upsert({
     *   create: {
     *     // ... data to create a ProfileDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileDocument we want to update
     *   }
     * })
     */
    upsert<T extends ProfileDocumentUpsertArgs>(args: SelectSubset<T, ProfileDocumentUpsertArgs<ExtArgs>>): Prisma__ProfileDocumentClient<$Result.GetResult<Prisma.$ProfileDocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentCountArgs} args - Arguments to filter ProfileDocuments to count.
     * @example
     * // Count the number of ProfileDocuments
     * const count = await prisma.profileDocument.count({
     *   where: {
     *     // ... the filter for the ProfileDocuments we want to count
     *   }
     * })
    **/
    count<T extends ProfileDocumentCountArgs>(
      args?: Subset<T, ProfileDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileDocumentAggregateArgs>(args: Subset<T, ProfileDocumentAggregateArgs>): Prisma.PrismaPromise<GetProfileDocumentAggregateType<T>>

    /**
     * Group by ProfileDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileDocumentGroupByArgs} args - Group by arguments.
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
      T extends ProfileDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileDocumentGroupByArgs['orderBy'] }
        : { orderBy?: ProfileDocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileDocument model
   */
  readonly fields: ProfileDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ProfileDocument model
   */ 
  interface ProfileDocumentFieldRefs {
    readonly id: FieldRef<"ProfileDocument", 'String'>
    readonly profileId: FieldRef<"ProfileDocument", 'String'>
    readonly type: FieldRef<"ProfileDocument", 'String'>
    readonly name: FieldRef<"ProfileDocument", 'String'>
    readonly storageKey: FieldRef<"ProfileDocument", 'String'>
    readonly mimeType: FieldRef<"ProfileDocument", 'String'>
    readonly sizeBytes: FieldRef<"ProfileDocument", 'Int'>
    readonly status: FieldRef<"ProfileDocument", 'String'>
    readonly uploadedAt: FieldRef<"ProfileDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileDocument findUnique
   */
  export type ProfileDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ProfileDocument to fetch.
     */
    where: ProfileDocumentWhereUniqueInput
  }

  /**
   * ProfileDocument findUniqueOrThrow
   */
  export type ProfileDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ProfileDocument to fetch.
     */
    where: ProfileDocumentWhereUniqueInput
  }

  /**
   * ProfileDocument findFirst
   */
  export type ProfileDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ProfileDocument to fetch.
     */
    where?: ProfileDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileDocuments to fetch.
     */
    orderBy?: ProfileDocumentOrderByWithRelationInput | ProfileDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileDocuments.
     */
    cursor?: ProfileDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileDocuments.
     */
    distinct?: ProfileDocumentScalarFieldEnum | ProfileDocumentScalarFieldEnum[]
  }

  /**
   * ProfileDocument findFirstOrThrow
   */
  export type ProfileDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ProfileDocument to fetch.
     */
    where?: ProfileDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileDocuments to fetch.
     */
    orderBy?: ProfileDocumentOrderByWithRelationInput | ProfileDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileDocuments.
     */
    cursor?: ProfileDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileDocuments.
     */
    distinct?: ProfileDocumentScalarFieldEnum | ProfileDocumentScalarFieldEnum[]
  }

  /**
   * ProfileDocument findMany
   */
  export type ProfileDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ProfileDocuments to fetch.
     */
    where?: ProfileDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileDocuments to fetch.
     */
    orderBy?: ProfileDocumentOrderByWithRelationInput | ProfileDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileDocuments.
     */
    cursor?: ProfileDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileDocuments.
     */
    skip?: number
    distinct?: ProfileDocumentScalarFieldEnum | ProfileDocumentScalarFieldEnum[]
  }

  /**
   * ProfileDocument create
   */
  export type ProfileDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileDocument.
     */
    data: XOR<ProfileDocumentCreateInput, ProfileDocumentUncheckedCreateInput>
  }

  /**
   * ProfileDocument createMany
   */
  export type ProfileDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileDocuments.
     */
    data: ProfileDocumentCreateManyInput | ProfileDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileDocument createManyAndReturn
   */
  export type ProfileDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProfileDocuments.
     */
    data: ProfileDocumentCreateManyInput | ProfileDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileDocument update
   */
  export type ProfileDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileDocument.
     */
    data: XOR<ProfileDocumentUpdateInput, ProfileDocumentUncheckedUpdateInput>
    /**
     * Choose, which ProfileDocument to update.
     */
    where: ProfileDocumentWhereUniqueInput
  }

  /**
   * ProfileDocument updateMany
   */
  export type ProfileDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileDocuments.
     */
    data: XOR<ProfileDocumentUpdateManyMutationInput, ProfileDocumentUncheckedUpdateManyInput>
    /**
     * Filter which ProfileDocuments to update
     */
    where?: ProfileDocumentWhereInput
  }

  /**
   * ProfileDocument upsert
   */
  export type ProfileDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileDocument to update in case it exists.
     */
    where: ProfileDocumentWhereUniqueInput
    /**
     * In case the ProfileDocument found by the `where` argument doesn't exist, create a new ProfileDocument with this data.
     */
    create: XOR<ProfileDocumentCreateInput, ProfileDocumentUncheckedCreateInput>
    /**
     * In case the ProfileDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileDocumentUpdateInput, ProfileDocumentUncheckedUpdateInput>
  }

  /**
   * ProfileDocument delete
   */
  export type ProfileDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
    /**
     * Filter which ProfileDocument to delete.
     */
    where: ProfileDocumentWhereUniqueInput
  }

  /**
   * ProfileDocument deleteMany
   */
  export type ProfileDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileDocuments to delete
     */
    where?: ProfileDocumentWhereInput
  }

  /**
   * ProfileDocument without action
   */
  export type ProfileDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileDocument
     */
    select?: ProfileDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileDocumentInclude<ExtArgs> | null
  }


  /**
   * Model ProfileAuditLog
   */

  export type AggregateProfileAuditLog = {
    _count: ProfileAuditLogCountAggregateOutputType | null
    _min: ProfileAuditLogMinAggregateOutputType | null
    _max: ProfileAuditLogMaxAggregateOutputType | null
  }

  export type ProfileAuditLogMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    userId: string | null
    actorUserId: string | null
    action: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type ProfileAuditLogMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    userId: string | null
    actorUserId: string | null
    action: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type ProfileAuditLogCountAggregateOutputType = {
    id: number
    profileId: number
    userId: number
    actorUserId: number
    action: number
    before: number
    after: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type ProfileAuditLogMinAggregateInputType = {
    id?: true
    profileId?: true
    userId?: true
    actorUserId?: true
    action?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type ProfileAuditLogMaxAggregateInputType = {
    id?: true
    profileId?: true
    userId?: true
    actorUserId?: true
    action?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type ProfileAuditLogCountAggregateInputType = {
    id?: true
    profileId?: true
    userId?: true
    actorUserId?: true
    action?: true
    before?: true
    after?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type ProfileAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileAuditLog to aggregate.
     */
    where?: ProfileAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileAuditLogs to fetch.
     */
    orderBy?: ProfileAuditLogOrderByWithRelationInput | ProfileAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileAuditLogs
    **/
    _count?: true | ProfileAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileAuditLogMaxAggregateInputType
  }

  export type GetProfileAuditLogAggregateType<T extends ProfileAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileAuditLog[P]>
      : GetScalarType<T[P], AggregateProfileAuditLog[P]>
  }




  export type ProfileAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileAuditLogWhereInput
    orderBy?: ProfileAuditLogOrderByWithAggregationInput | ProfileAuditLogOrderByWithAggregationInput[]
    by: ProfileAuditLogScalarFieldEnum[] | ProfileAuditLogScalarFieldEnum
    having?: ProfileAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileAuditLogCountAggregateInputType | true
    _min?: ProfileAuditLogMinAggregateInputType
    _max?: ProfileAuditLogMaxAggregateInputType
  }

  export type ProfileAuditLogGroupByOutputType = {
    id: string
    profileId: string
    userId: string
    actorUserId: string
    action: string
    before: JsonValue
    after: JsonValue
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: ProfileAuditLogCountAggregateOutputType | null
    _min: ProfileAuditLogMinAggregateOutputType | null
    _max: ProfileAuditLogMaxAggregateOutputType | null
  }

  type GetProfileAuditLogGroupByPayload<T extends ProfileAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type ProfileAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    userId?: boolean
    actorUserId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileAuditLog"]>

  export type ProfileAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    userId?: boolean
    actorUserId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileAuditLog"]>

  export type ProfileAuditLogSelectScalar = {
    id?: boolean
    profileId?: boolean
    userId?: boolean
    actorUserId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type ProfileAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type ProfileAuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $ProfileAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileAuditLog"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      userId: string
      actorUserId: string
      action: string
      before: Prisma.JsonValue
      after: Prisma.JsonValue
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["profileAuditLog"]>
    composites: {}
  }

  type ProfileAuditLogGetPayload<S extends boolean | null | undefined | ProfileAuditLogDefaultArgs> = $Result.GetResult<Prisma.$ProfileAuditLogPayload, S>

  type ProfileAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileAuditLogCountAggregateInputType | true
    }

  export interface ProfileAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileAuditLog'], meta: { name: 'ProfileAuditLog' } }
    /**
     * Find zero or one ProfileAuditLog that matches the filter.
     * @param {ProfileAuditLogFindUniqueArgs} args - Arguments to find a ProfileAuditLog
     * @example
     * // Get one ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileAuditLogFindUniqueArgs>(args: SelectSubset<T, ProfileAuditLogFindUniqueArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileAuditLogFindUniqueOrThrowArgs} args - Arguments to find a ProfileAuditLog
     * @example
     * // Get one ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogFindFirstArgs} args - Arguments to find a ProfileAuditLog
     * @example
     * // Get one ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileAuditLogFindFirstArgs>(args?: SelectSubset<T, ProfileAuditLogFindFirstArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogFindFirstOrThrowArgs} args - Arguments to find a ProfileAuditLog
     * @example
     * // Get one ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileAuditLogs
     * const profileAuditLogs = await prisma.profileAuditLog.findMany()
     * 
     * // Get first 10 ProfileAuditLogs
     * const profileAuditLogs = await prisma.profileAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileAuditLogWithIdOnly = await prisma.profileAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileAuditLogFindManyArgs>(args?: SelectSubset<T, ProfileAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileAuditLog.
     * @param {ProfileAuditLogCreateArgs} args - Arguments to create a ProfileAuditLog.
     * @example
     * // Create one ProfileAuditLog
     * const ProfileAuditLog = await prisma.profileAuditLog.create({
     *   data: {
     *     // ... data to create a ProfileAuditLog
     *   }
     * })
     * 
     */
    create<T extends ProfileAuditLogCreateArgs>(args: SelectSubset<T, ProfileAuditLogCreateArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileAuditLogs.
     * @param {ProfileAuditLogCreateManyArgs} args - Arguments to create many ProfileAuditLogs.
     * @example
     * // Create many ProfileAuditLogs
     * const profileAuditLog = await prisma.profileAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileAuditLogCreateManyArgs>(args?: SelectSubset<T, ProfileAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileAuditLogs and returns the data saved in the database.
     * @param {ProfileAuditLogCreateManyAndReturnArgs} args - Arguments to create many ProfileAuditLogs.
     * @example
     * // Create many ProfileAuditLogs
     * const profileAuditLog = await prisma.profileAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileAuditLogs and only return the `id`
     * const profileAuditLogWithIdOnly = await prisma.profileAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProfileAuditLog.
     * @param {ProfileAuditLogDeleteArgs} args - Arguments to delete one ProfileAuditLog.
     * @example
     * // Delete one ProfileAuditLog
     * const ProfileAuditLog = await prisma.profileAuditLog.delete({
     *   where: {
     *     // ... filter to delete one ProfileAuditLog
     *   }
     * })
     * 
     */
    delete<T extends ProfileAuditLogDeleteArgs>(args: SelectSubset<T, ProfileAuditLogDeleteArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileAuditLog.
     * @param {ProfileAuditLogUpdateArgs} args - Arguments to update one ProfileAuditLog.
     * @example
     * // Update one ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileAuditLogUpdateArgs>(args: SelectSubset<T, ProfileAuditLogUpdateArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileAuditLogs.
     * @param {ProfileAuditLogDeleteManyArgs} args - Arguments to filter ProfileAuditLogs to delete.
     * @example
     * // Delete a few ProfileAuditLogs
     * const { count } = await prisma.profileAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileAuditLogDeleteManyArgs>(args?: SelectSubset<T, ProfileAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileAuditLogs
     * const profileAuditLog = await prisma.profileAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileAuditLogUpdateManyArgs>(args: SelectSubset<T, ProfileAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileAuditLog.
     * @param {ProfileAuditLogUpsertArgs} args - Arguments to update or create a ProfileAuditLog.
     * @example
     * // Update or create a ProfileAuditLog
     * const profileAuditLog = await prisma.profileAuditLog.upsert({
     *   create: {
     *     // ... data to create a ProfileAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends ProfileAuditLogUpsertArgs>(args: SelectSubset<T, ProfileAuditLogUpsertArgs<ExtArgs>>): Prisma__ProfileAuditLogClient<$Result.GetResult<Prisma.$ProfileAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogCountArgs} args - Arguments to filter ProfileAuditLogs to count.
     * @example
     * // Count the number of ProfileAuditLogs
     * const count = await prisma.profileAuditLog.count({
     *   where: {
     *     // ... the filter for the ProfileAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends ProfileAuditLogCountArgs>(
      args?: Subset<T, ProfileAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileAuditLogAggregateArgs>(args: Subset<T, ProfileAuditLogAggregateArgs>): Prisma.PrismaPromise<GetProfileAuditLogAggregateType<T>>

    /**
     * Group by ProfileAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAuditLogGroupByArgs} args - Group by arguments.
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
      T extends ProfileAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: ProfileAuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileAuditLog model
   */
  readonly fields: ProfileAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ProfileAuditLog model
   */ 
  interface ProfileAuditLogFieldRefs {
    readonly id: FieldRef<"ProfileAuditLog", 'String'>
    readonly profileId: FieldRef<"ProfileAuditLog", 'String'>
    readonly userId: FieldRef<"ProfileAuditLog", 'String'>
    readonly actorUserId: FieldRef<"ProfileAuditLog", 'String'>
    readonly action: FieldRef<"ProfileAuditLog", 'String'>
    readonly before: FieldRef<"ProfileAuditLog", 'Json'>
    readonly after: FieldRef<"ProfileAuditLog", 'Json'>
    readonly ipAddress: FieldRef<"ProfileAuditLog", 'String'>
    readonly userAgent: FieldRef<"ProfileAuditLog", 'String'>
    readonly createdAt: FieldRef<"ProfileAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileAuditLog findUnique
   */
  export type ProfileAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which ProfileAuditLog to fetch.
     */
    where: ProfileAuditLogWhereUniqueInput
  }

  /**
   * ProfileAuditLog findUniqueOrThrow
   */
  export type ProfileAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which ProfileAuditLog to fetch.
     */
    where: ProfileAuditLogWhereUniqueInput
  }

  /**
   * ProfileAuditLog findFirst
   */
  export type ProfileAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which ProfileAuditLog to fetch.
     */
    where?: ProfileAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileAuditLogs to fetch.
     */
    orderBy?: ProfileAuditLogOrderByWithRelationInput | ProfileAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileAuditLogs.
     */
    cursor?: ProfileAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileAuditLogs.
     */
    distinct?: ProfileAuditLogScalarFieldEnum | ProfileAuditLogScalarFieldEnum[]
  }

  /**
   * ProfileAuditLog findFirstOrThrow
   */
  export type ProfileAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which ProfileAuditLog to fetch.
     */
    where?: ProfileAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileAuditLogs to fetch.
     */
    orderBy?: ProfileAuditLogOrderByWithRelationInput | ProfileAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileAuditLogs.
     */
    cursor?: ProfileAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileAuditLogs.
     */
    distinct?: ProfileAuditLogScalarFieldEnum | ProfileAuditLogScalarFieldEnum[]
  }

  /**
   * ProfileAuditLog findMany
   */
  export type ProfileAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which ProfileAuditLogs to fetch.
     */
    where?: ProfileAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileAuditLogs to fetch.
     */
    orderBy?: ProfileAuditLogOrderByWithRelationInput | ProfileAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileAuditLogs.
     */
    cursor?: ProfileAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileAuditLogs.
     */
    skip?: number
    distinct?: ProfileAuditLogScalarFieldEnum | ProfileAuditLogScalarFieldEnum[]
  }

  /**
   * ProfileAuditLog create
   */
  export type ProfileAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileAuditLog.
     */
    data: XOR<ProfileAuditLogCreateInput, ProfileAuditLogUncheckedCreateInput>
  }

  /**
   * ProfileAuditLog createMany
   */
  export type ProfileAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileAuditLogs.
     */
    data: ProfileAuditLogCreateManyInput | ProfileAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileAuditLog createManyAndReturn
   */
  export type ProfileAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProfileAuditLogs.
     */
    data: ProfileAuditLogCreateManyInput | ProfileAuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileAuditLog update
   */
  export type ProfileAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileAuditLog.
     */
    data: XOR<ProfileAuditLogUpdateInput, ProfileAuditLogUncheckedUpdateInput>
    /**
     * Choose, which ProfileAuditLog to update.
     */
    where: ProfileAuditLogWhereUniqueInput
  }

  /**
   * ProfileAuditLog updateMany
   */
  export type ProfileAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileAuditLogs.
     */
    data: XOR<ProfileAuditLogUpdateManyMutationInput, ProfileAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which ProfileAuditLogs to update
     */
    where?: ProfileAuditLogWhereInput
  }

  /**
   * ProfileAuditLog upsert
   */
  export type ProfileAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileAuditLog to update in case it exists.
     */
    where: ProfileAuditLogWhereUniqueInput
    /**
     * In case the ProfileAuditLog found by the `where` argument doesn't exist, create a new ProfileAuditLog with this data.
     */
    create: XOR<ProfileAuditLogCreateInput, ProfileAuditLogUncheckedCreateInput>
    /**
     * In case the ProfileAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileAuditLogUpdateInput, ProfileAuditLogUncheckedUpdateInput>
  }

  /**
   * ProfileAuditLog delete
   */
  export type ProfileAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
    /**
     * Filter which ProfileAuditLog to delete.
     */
    where: ProfileAuditLogWhereUniqueInput
  }

  /**
   * ProfileAuditLog deleteMany
   */
  export type ProfileAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileAuditLogs to delete
     */
    where?: ProfileAuditLogWhereInput
  }

  /**
   * ProfileAuditLog without action
   */
  export type ProfileAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileAuditLog
     */
    select?: ProfileAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileAuditLogInclude<ExtArgs> | null
  }


  /**
   * Model ProfileLocation
   */

  export type AggregateProfileLocation = {
    _count: ProfileLocationCountAggregateOutputType | null
    _min: ProfileLocationMinAggregateOutputType | null
    _max: ProfileLocationMaxAggregateOutputType | null
  }

  export type ProfileLocationMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    regionId: string | null
    districtId: string | null
    address: string | null
    isPrimary: boolean | null
    createdAt: Date | null
  }

  export type ProfileLocationMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    regionId: string | null
    districtId: string | null
    address: string | null
    isPrimary: boolean | null
    createdAt: Date | null
  }

  export type ProfileLocationCountAggregateOutputType = {
    id: number
    profileId: number
    regionId: number
    districtId: number
    address: number
    isPrimary: number
    createdAt: number
    _all: number
  }


  export type ProfileLocationMinAggregateInputType = {
    id?: true
    profileId?: true
    regionId?: true
    districtId?: true
    address?: true
    isPrimary?: true
    createdAt?: true
  }

  export type ProfileLocationMaxAggregateInputType = {
    id?: true
    profileId?: true
    regionId?: true
    districtId?: true
    address?: true
    isPrimary?: true
    createdAt?: true
  }

  export type ProfileLocationCountAggregateInputType = {
    id?: true
    profileId?: true
    regionId?: true
    districtId?: true
    address?: true
    isPrimary?: true
    createdAt?: true
    _all?: true
  }

  export type ProfileLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileLocation to aggregate.
     */
    where?: ProfileLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileLocations to fetch.
     */
    orderBy?: ProfileLocationOrderByWithRelationInput | ProfileLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileLocations
    **/
    _count?: true | ProfileLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileLocationMaxAggregateInputType
  }

  export type GetProfileLocationAggregateType<T extends ProfileLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileLocation[P]>
      : GetScalarType<T[P], AggregateProfileLocation[P]>
  }




  export type ProfileLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileLocationWhereInput
    orderBy?: ProfileLocationOrderByWithAggregationInput | ProfileLocationOrderByWithAggregationInput[]
    by: ProfileLocationScalarFieldEnum[] | ProfileLocationScalarFieldEnum
    having?: ProfileLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileLocationCountAggregateInputType | true
    _min?: ProfileLocationMinAggregateInputType
    _max?: ProfileLocationMaxAggregateInputType
  }

  export type ProfileLocationGroupByOutputType = {
    id: string
    profileId: string
    regionId: string | null
    districtId: string | null
    address: string | null
    isPrimary: boolean
    createdAt: Date
    _count: ProfileLocationCountAggregateOutputType | null
    _min: ProfileLocationMinAggregateOutputType | null
    _max: ProfileLocationMaxAggregateOutputType | null
  }

  type GetProfileLocationGroupByPayload<T extends ProfileLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileLocationGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileLocationGroupByOutputType[P]>
        }
      >
    >


  export type ProfileLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    regionId?: boolean
    districtId?: boolean
    address?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileLocation"]>

  export type ProfileLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    regionId?: boolean
    districtId?: boolean
    address?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profileLocation"]>

  export type ProfileLocationSelectScalar = {
    id?: boolean
    profileId?: boolean
    regionId?: boolean
    districtId?: boolean
    address?: boolean
    isPrimary?: boolean
    createdAt?: boolean
  }

  export type ProfileLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type ProfileLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $ProfileLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileLocation"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      regionId: string | null
      districtId: string | null
      address: string | null
      isPrimary: boolean
      createdAt: Date
    }, ExtArgs["result"]["profileLocation"]>
    composites: {}
  }

  type ProfileLocationGetPayload<S extends boolean | null | undefined | ProfileLocationDefaultArgs> = $Result.GetResult<Prisma.$ProfileLocationPayload, S>

  type ProfileLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileLocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileLocationCountAggregateInputType | true
    }

  export interface ProfileLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileLocation'], meta: { name: 'ProfileLocation' } }
    /**
     * Find zero or one ProfileLocation that matches the filter.
     * @param {ProfileLocationFindUniqueArgs} args - Arguments to find a ProfileLocation
     * @example
     * // Get one ProfileLocation
     * const profileLocation = await prisma.profileLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileLocationFindUniqueArgs>(args: SelectSubset<T, ProfileLocationFindUniqueArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileLocation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileLocationFindUniqueOrThrowArgs} args - Arguments to find a ProfileLocation
     * @example
     * // Get one ProfileLocation
     * const profileLocation = await prisma.profileLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationFindFirstArgs} args - Arguments to find a ProfileLocation
     * @example
     * // Get one ProfileLocation
     * const profileLocation = await prisma.profileLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileLocationFindFirstArgs>(args?: SelectSubset<T, ProfileLocationFindFirstArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationFindFirstOrThrowArgs} args - Arguments to find a ProfileLocation
     * @example
     * // Get one ProfileLocation
     * const profileLocation = await prisma.profileLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileLocations
     * const profileLocations = await prisma.profileLocation.findMany()
     * 
     * // Get first 10 ProfileLocations
     * const profileLocations = await prisma.profileLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileLocationWithIdOnly = await prisma.profileLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileLocationFindManyArgs>(args?: SelectSubset<T, ProfileLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileLocation.
     * @param {ProfileLocationCreateArgs} args - Arguments to create a ProfileLocation.
     * @example
     * // Create one ProfileLocation
     * const ProfileLocation = await prisma.profileLocation.create({
     *   data: {
     *     // ... data to create a ProfileLocation
     *   }
     * })
     * 
     */
    create<T extends ProfileLocationCreateArgs>(args: SelectSubset<T, ProfileLocationCreateArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileLocations.
     * @param {ProfileLocationCreateManyArgs} args - Arguments to create many ProfileLocations.
     * @example
     * // Create many ProfileLocations
     * const profileLocation = await prisma.profileLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileLocationCreateManyArgs>(args?: SelectSubset<T, ProfileLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileLocations and returns the data saved in the database.
     * @param {ProfileLocationCreateManyAndReturnArgs} args - Arguments to create many ProfileLocations.
     * @example
     * // Create many ProfileLocations
     * const profileLocation = await prisma.profileLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileLocations and only return the `id`
     * const profileLocationWithIdOnly = await prisma.profileLocation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProfileLocation.
     * @param {ProfileLocationDeleteArgs} args - Arguments to delete one ProfileLocation.
     * @example
     * // Delete one ProfileLocation
     * const ProfileLocation = await prisma.profileLocation.delete({
     *   where: {
     *     // ... filter to delete one ProfileLocation
     *   }
     * })
     * 
     */
    delete<T extends ProfileLocationDeleteArgs>(args: SelectSubset<T, ProfileLocationDeleteArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileLocation.
     * @param {ProfileLocationUpdateArgs} args - Arguments to update one ProfileLocation.
     * @example
     * // Update one ProfileLocation
     * const profileLocation = await prisma.profileLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileLocationUpdateArgs>(args: SelectSubset<T, ProfileLocationUpdateArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileLocations.
     * @param {ProfileLocationDeleteManyArgs} args - Arguments to filter ProfileLocations to delete.
     * @example
     * // Delete a few ProfileLocations
     * const { count } = await prisma.profileLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileLocationDeleteManyArgs>(args?: SelectSubset<T, ProfileLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileLocations
     * const profileLocation = await prisma.profileLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileLocationUpdateManyArgs>(args: SelectSubset<T, ProfileLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileLocation.
     * @param {ProfileLocationUpsertArgs} args - Arguments to update or create a ProfileLocation.
     * @example
     * // Update or create a ProfileLocation
     * const profileLocation = await prisma.profileLocation.upsert({
     *   create: {
     *     // ... data to create a ProfileLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileLocation we want to update
     *   }
     * })
     */
    upsert<T extends ProfileLocationUpsertArgs>(args: SelectSubset<T, ProfileLocationUpsertArgs<ExtArgs>>): Prisma__ProfileLocationClient<$Result.GetResult<Prisma.$ProfileLocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationCountArgs} args - Arguments to filter ProfileLocations to count.
     * @example
     * // Count the number of ProfileLocations
     * const count = await prisma.profileLocation.count({
     *   where: {
     *     // ... the filter for the ProfileLocations we want to count
     *   }
     * })
    **/
    count<T extends ProfileLocationCountArgs>(
      args?: Subset<T, ProfileLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileLocationAggregateArgs>(args: Subset<T, ProfileLocationAggregateArgs>): Prisma.PrismaPromise<GetProfileLocationAggregateType<T>>

    /**
     * Group by ProfileLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileLocationGroupByArgs} args - Group by arguments.
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
      T extends ProfileLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileLocationGroupByArgs['orderBy'] }
        : { orderBy?: ProfileLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileLocation model
   */
  readonly fields: ProfileLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ProfileLocation model
   */ 
  interface ProfileLocationFieldRefs {
    readonly id: FieldRef<"ProfileLocation", 'String'>
    readonly profileId: FieldRef<"ProfileLocation", 'String'>
    readonly regionId: FieldRef<"ProfileLocation", 'String'>
    readonly districtId: FieldRef<"ProfileLocation", 'String'>
    readonly address: FieldRef<"ProfileLocation", 'String'>
    readonly isPrimary: FieldRef<"ProfileLocation", 'Boolean'>
    readonly createdAt: FieldRef<"ProfileLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileLocation findUnique
   */
  export type ProfileLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileLocation to fetch.
     */
    where: ProfileLocationWhereUniqueInput
  }

  /**
   * ProfileLocation findUniqueOrThrow
   */
  export type ProfileLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileLocation to fetch.
     */
    where: ProfileLocationWhereUniqueInput
  }

  /**
   * ProfileLocation findFirst
   */
  export type ProfileLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileLocation to fetch.
     */
    where?: ProfileLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileLocations to fetch.
     */
    orderBy?: ProfileLocationOrderByWithRelationInput | ProfileLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileLocations.
     */
    cursor?: ProfileLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileLocations.
     */
    distinct?: ProfileLocationScalarFieldEnum | ProfileLocationScalarFieldEnum[]
  }

  /**
   * ProfileLocation findFirstOrThrow
   */
  export type ProfileLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileLocation to fetch.
     */
    where?: ProfileLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileLocations to fetch.
     */
    orderBy?: ProfileLocationOrderByWithRelationInput | ProfileLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileLocations.
     */
    cursor?: ProfileLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileLocations.
     */
    distinct?: ProfileLocationScalarFieldEnum | ProfileLocationScalarFieldEnum[]
  }

  /**
   * ProfileLocation findMany
   */
  export type ProfileLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter, which ProfileLocations to fetch.
     */
    where?: ProfileLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileLocations to fetch.
     */
    orderBy?: ProfileLocationOrderByWithRelationInput | ProfileLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileLocations.
     */
    cursor?: ProfileLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileLocations.
     */
    skip?: number
    distinct?: ProfileLocationScalarFieldEnum | ProfileLocationScalarFieldEnum[]
  }

  /**
   * ProfileLocation create
   */
  export type ProfileLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileLocation.
     */
    data: XOR<ProfileLocationCreateInput, ProfileLocationUncheckedCreateInput>
  }

  /**
   * ProfileLocation createMany
   */
  export type ProfileLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileLocations.
     */
    data: ProfileLocationCreateManyInput | ProfileLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileLocation createManyAndReturn
   */
  export type ProfileLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProfileLocations.
     */
    data: ProfileLocationCreateManyInput | ProfileLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileLocation update
   */
  export type ProfileLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileLocation.
     */
    data: XOR<ProfileLocationUpdateInput, ProfileLocationUncheckedUpdateInput>
    /**
     * Choose, which ProfileLocation to update.
     */
    where: ProfileLocationWhereUniqueInput
  }

  /**
   * ProfileLocation updateMany
   */
  export type ProfileLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileLocations.
     */
    data: XOR<ProfileLocationUpdateManyMutationInput, ProfileLocationUncheckedUpdateManyInput>
    /**
     * Filter which ProfileLocations to update
     */
    where?: ProfileLocationWhereInput
  }

  /**
   * ProfileLocation upsert
   */
  export type ProfileLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileLocation to update in case it exists.
     */
    where: ProfileLocationWhereUniqueInput
    /**
     * In case the ProfileLocation found by the `where` argument doesn't exist, create a new ProfileLocation with this data.
     */
    create: XOR<ProfileLocationCreateInput, ProfileLocationUncheckedCreateInput>
    /**
     * In case the ProfileLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileLocationUpdateInput, ProfileLocationUncheckedUpdateInput>
  }

  /**
   * ProfileLocation delete
   */
  export type ProfileLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
    /**
     * Filter which ProfileLocation to delete.
     */
    where: ProfileLocationWhereUniqueInput
  }

  /**
   * ProfileLocation deleteMany
   */
  export type ProfileLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileLocations to delete
     */
    where?: ProfileLocationWhereInput
  }

  /**
   * ProfileLocation without action
   */
  export type ProfileLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileLocation
     */
    select?: ProfileLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileLocationInclude<ExtArgs> | null
  }


  /**
   * Model EducationRecord
   */

  export type AggregateEducationRecord = {
    _count: EducationRecordCountAggregateOutputType | null
    _min: EducationRecordMinAggregateOutputType | null
    _max: EducationRecordMaxAggregateOutputType | null
  }

  export type EducationRecordMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    organizationId: string | null
    schoolId: string | null
    classId: string | null
    level: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type EducationRecordMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    organizationId: string | null
    schoolId: string | null
    classId: string | null
    level: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type EducationRecordCountAggregateOutputType = {
    id: number
    profileId: number
    organizationId: number
    schoolId: number
    classId: number
    level: number
    startedAt: number
    endedAt: number
    metadata: number
    _all: number
  }


  export type EducationRecordMinAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    schoolId?: true
    classId?: true
    level?: true
    startedAt?: true
    endedAt?: true
  }

  export type EducationRecordMaxAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    schoolId?: true
    classId?: true
    level?: true
    startedAt?: true
    endedAt?: true
  }

  export type EducationRecordCountAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    schoolId?: true
    classId?: true
    level?: true
    startedAt?: true
    endedAt?: true
    metadata?: true
    _all?: true
  }

  export type EducationRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EducationRecord to aggregate.
     */
    where?: EducationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationRecords to fetch.
     */
    orderBy?: EducationRecordOrderByWithRelationInput | EducationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EducationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EducationRecords
    **/
    _count?: true | EducationRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EducationRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EducationRecordMaxAggregateInputType
  }

  export type GetEducationRecordAggregateType<T extends EducationRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateEducationRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEducationRecord[P]>
      : GetScalarType<T[P], AggregateEducationRecord[P]>
  }




  export type EducationRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationRecordWhereInput
    orderBy?: EducationRecordOrderByWithAggregationInput | EducationRecordOrderByWithAggregationInput[]
    by: EducationRecordScalarFieldEnum[] | EducationRecordScalarFieldEnum
    having?: EducationRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EducationRecordCountAggregateInputType | true
    _min?: EducationRecordMinAggregateInputType
    _max?: EducationRecordMaxAggregateInputType
  }

  export type EducationRecordGroupByOutputType = {
    id: string
    profileId: string
    organizationId: string | null
    schoolId: string | null
    classId: string | null
    level: string | null
    startedAt: Date | null
    endedAt: Date | null
    metadata: JsonValue
    _count: EducationRecordCountAggregateOutputType | null
    _min: EducationRecordMinAggregateOutputType | null
    _max: EducationRecordMaxAggregateOutputType | null
  }

  type GetEducationRecordGroupByPayload<T extends EducationRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EducationRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EducationRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EducationRecordGroupByOutputType[P]>
            : GetScalarType<T[P], EducationRecordGroupByOutputType[P]>
        }
      >
    >


  export type EducationRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    schoolId?: boolean
    classId?: boolean
    level?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["educationRecord"]>

  export type EducationRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    schoolId?: boolean
    classId?: boolean
    level?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["educationRecord"]>

  export type EducationRecordSelectScalar = {
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    schoolId?: boolean
    classId?: boolean
    level?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
  }

  export type EducationRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type EducationRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $EducationRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EducationRecord"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      organizationId: string | null
      schoolId: string | null
      classId: string | null
      level: string | null
      startedAt: Date | null
      endedAt: Date | null
      metadata: Prisma.JsonValue
    }, ExtArgs["result"]["educationRecord"]>
    composites: {}
  }

  type EducationRecordGetPayload<S extends boolean | null | undefined | EducationRecordDefaultArgs> = $Result.GetResult<Prisma.$EducationRecordPayload, S>

  type EducationRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EducationRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EducationRecordCountAggregateInputType | true
    }

  export interface EducationRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EducationRecord'], meta: { name: 'EducationRecord' } }
    /**
     * Find zero or one EducationRecord that matches the filter.
     * @param {EducationRecordFindUniqueArgs} args - Arguments to find a EducationRecord
     * @example
     * // Get one EducationRecord
     * const educationRecord = await prisma.educationRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EducationRecordFindUniqueArgs>(args: SelectSubset<T, EducationRecordFindUniqueArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EducationRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EducationRecordFindUniqueOrThrowArgs} args - Arguments to find a EducationRecord
     * @example
     * // Get one EducationRecord
     * const educationRecord = await prisma.educationRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EducationRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, EducationRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EducationRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordFindFirstArgs} args - Arguments to find a EducationRecord
     * @example
     * // Get one EducationRecord
     * const educationRecord = await prisma.educationRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EducationRecordFindFirstArgs>(args?: SelectSubset<T, EducationRecordFindFirstArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EducationRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordFindFirstOrThrowArgs} args - Arguments to find a EducationRecord
     * @example
     * // Get one EducationRecord
     * const educationRecord = await prisma.educationRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EducationRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, EducationRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EducationRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EducationRecords
     * const educationRecords = await prisma.educationRecord.findMany()
     * 
     * // Get first 10 EducationRecords
     * const educationRecords = await prisma.educationRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const educationRecordWithIdOnly = await prisma.educationRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EducationRecordFindManyArgs>(args?: SelectSubset<T, EducationRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EducationRecord.
     * @param {EducationRecordCreateArgs} args - Arguments to create a EducationRecord.
     * @example
     * // Create one EducationRecord
     * const EducationRecord = await prisma.educationRecord.create({
     *   data: {
     *     // ... data to create a EducationRecord
     *   }
     * })
     * 
     */
    create<T extends EducationRecordCreateArgs>(args: SelectSubset<T, EducationRecordCreateArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EducationRecords.
     * @param {EducationRecordCreateManyArgs} args - Arguments to create many EducationRecords.
     * @example
     * // Create many EducationRecords
     * const educationRecord = await prisma.educationRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EducationRecordCreateManyArgs>(args?: SelectSubset<T, EducationRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EducationRecords and returns the data saved in the database.
     * @param {EducationRecordCreateManyAndReturnArgs} args - Arguments to create many EducationRecords.
     * @example
     * // Create many EducationRecords
     * const educationRecord = await prisma.educationRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EducationRecords and only return the `id`
     * const educationRecordWithIdOnly = await prisma.educationRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EducationRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, EducationRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EducationRecord.
     * @param {EducationRecordDeleteArgs} args - Arguments to delete one EducationRecord.
     * @example
     * // Delete one EducationRecord
     * const EducationRecord = await prisma.educationRecord.delete({
     *   where: {
     *     // ... filter to delete one EducationRecord
     *   }
     * })
     * 
     */
    delete<T extends EducationRecordDeleteArgs>(args: SelectSubset<T, EducationRecordDeleteArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EducationRecord.
     * @param {EducationRecordUpdateArgs} args - Arguments to update one EducationRecord.
     * @example
     * // Update one EducationRecord
     * const educationRecord = await prisma.educationRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EducationRecordUpdateArgs>(args: SelectSubset<T, EducationRecordUpdateArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EducationRecords.
     * @param {EducationRecordDeleteManyArgs} args - Arguments to filter EducationRecords to delete.
     * @example
     * // Delete a few EducationRecords
     * const { count } = await prisma.educationRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EducationRecordDeleteManyArgs>(args?: SelectSubset<T, EducationRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EducationRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EducationRecords
     * const educationRecord = await prisma.educationRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EducationRecordUpdateManyArgs>(args: SelectSubset<T, EducationRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EducationRecord.
     * @param {EducationRecordUpsertArgs} args - Arguments to update or create a EducationRecord.
     * @example
     * // Update or create a EducationRecord
     * const educationRecord = await prisma.educationRecord.upsert({
     *   create: {
     *     // ... data to create a EducationRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EducationRecord we want to update
     *   }
     * })
     */
    upsert<T extends EducationRecordUpsertArgs>(args: SelectSubset<T, EducationRecordUpsertArgs<ExtArgs>>): Prisma__EducationRecordClient<$Result.GetResult<Prisma.$EducationRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EducationRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordCountArgs} args - Arguments to filter EducationRecords to count.
     * @example
     * // Count the number of EducationRecords
     * const count = await prisma.educationRecord.count({
     *   where: {
     *     // ... the filter for the EducationRecords we want to count
     *   }
     * })
    **/
    count<T extends EducationRecordCountArgs>(
      args?: Subset<T, EducationRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EducationRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EducationRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EducationRecordAggregateArgs>(args: Subset<T, EducationRecordAggregateArgs>): Prisma.PrismaPromise<GetEducationRecordAggregateType<T>>

    /**
     * Group by EducationRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationRecordGroupByArgs} args - Group by arguments.
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
      T extends EducationRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EducationRecordGroupByArgs['orderBy'] }
        : { orderBy?: EducationRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EducationRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEducationRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EducationRecord model
   */
  readonly fields: EducationRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EducationRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EducationRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EducationRecord model
   */ 
  interface EducationRecordFieldRefs {
    readonly id: FieldRef<"EducationRecord", 'String'>
    readonly profileId: FieldRef<"EducationRecord", 'String'>
    readonly organizationId: FieldRef<"EducationRecord", 'String'>
    readonly schoolId: FieldRef<"EducationRecord", 'String'>
    readonly classId: FieldRef<"EducationRecord", 'String'>
    readonly level: FieldRef<"EducationRecord", 'String'>
    readonly startedAt: FieldRef<"EducationRecord", 'DateTime'>
    readonly endedAt: FieldRef<"EducationRecord", 'DateTime'>
    readonly metadata: FieldRef<"EducationRecord", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * EducationRecord findUnique
   */
  export type EducationRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter, which EducationRecord to fetch.
     */
    where: EducationRecordWhereUniqueInput
  }

  /**
   * EducationRecord findUniqueOrThrow
   */
  export type EducationRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter, which EducationRecord to fetch.
     */
    where: EducationRecordWhereUniqueInput
  }

  /**
   * EducationRecord findFirst
   */
  export type EducationRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter, which EducationRecord to fetch.
     */
    where?: EducationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationRecords to fetch.
     */
    orderBy?: EducationRecordOrderByWithRelationInput | EducationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EducationRecords.
     */
    cursor?: EducationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EducationRecords.
     */
    distinct?: EducationRecordScalarFieldEnum | EducationRecordScalarFieldEnum[]
  }

  /**
   * EducationRecord findFirstOrThrow
   */
  export type EducationRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter, which EducationRecord to fetch.
     */
    where?: EducationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationRecords to fetch.
     */
    orderBy?: EducationRecordOrderByWithRelationInput | EducationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EducationRecords.
     */
    cursor?: EducationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EducationRecords.
     */
    distinct?: EducationRecordScalarFieldEnum | EducationRecordScalarFieldEnum[]
  }

  /**
   * EducationRecord findMany
   */
  export type EducationRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter, which EducationRecords to fetch.
     */
    where?: EducationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationRecords to fetch.
     */
    orderBy?: EducationRecordOrderByWithRelationInput | EducationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EducationRecords.
     */
    cursor?: EducationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationRecords.
     */
    skip?: number
    distinct?: EducationRecordScalarFieldEnum | EducationRecordScalarFieldEnum[]
  }

  /**
   * EducationRecord create
   */
  export type EducationRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a EducationRecord.
     */
    data: XOR<EducationRecordCreateInput, EducationRecordUncheckedCreateInput>
  }

  /**
   * EducationRecord createMany
   */
  export type EducationRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EducationRecords.
     */
    data: EducationRecordCreateManyInput | EducationRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EducationRecord createManyAndReturn
   */
  export type EducationRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EducationRecords.
     */
    data: EducationRecordCreateManyInput | EducationRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EducationRecord update
   */
  export type EducationRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a EducationRecord.
     */
    data: XOR<EducationRecordUpdateInput, EducationRecordUncheckedUpdateInput>
    /**
     * Choose, which EducationRecord to update.
     */
    where: EducationRecordWhereUniqueInput
  }

  /**
   * EducationRecord updateMany
   */
  export type EducationRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EducationRecords.
     */
    data: XOR<EducationRecordUpdateManyMutationInput, EducationRecordUncheckedUpdateManyInput>
    /**
     * Filter which EducationRecords to update
     */
    where?: EducationRecordWhereInput
  }

  /**
   * EducationRecord upsert
   */
  export type EducationRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the EducationRecord to update in case it exists.
     */
    where: EducationRecordWhereUniqueInput
    /**
     * In case the EducationRecord found by the `where` argument doesn't exist, create a new EducationRecord with this data.
     */
    create: XOR<EducationRecordCreateInput, EducationRecordUncheckedCreateInput>
    /**
     * In case the EducationRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EducationRecordUpdateInput, EducationRecordUncheckedUpdateInput>
  }

  /**
   * EducationRecord delete
   */
  export type EducationRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
    /**
     * Filter which EducationRecord to delete.
     */
    where: EducationRecordWhereUniqueInput
  }

  /**
   * EducationRecord deleteMany
   */
  export type EducationRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EducationRecords to delete
     */
    where?: EducationRecordWhereInput
  }

  /**
   * EducationRecord without action
   */
  export type EducationRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationRecord
     */
    select?: EducationRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationRecordInclude<ExtArgs> | null
  }


  /**
   * Model WorkRecord
   */

  export type AggregateWorkRecord = {
    _count: WorkRecordCountAggregateOutputType | null
    _min: WorkRecordMinAggregateOutputType | null
    _max: WorkRecordMaxAggregateOutputType | null
  }

  export type WorkRecordMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    organizationId: string | null
    positionTitle: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type WorkRecordMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    organizationId: string | null
    positionTitle: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type WorkRecordCountAggregateOutputType = {
    id: number
    profileId: number
    organizationId: number
    positionTitle: number
    startedAt: number
    endedAt: number
    metadata: number
    _all: number
  }


  export type WorkRecordMinAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    positionTitle?: true
    startedAt?: true
    endedAt?: true
  }

  export type WorkRecordMaxAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    positionTitle?: true
    startedAt?: true
    endedAt?: true
  }

  export type WorkRecordCountAggregateInputType = {
    id?: true
    profileId?: true
    organizationId?: true
    positionTitle?: true
    startedAt?: true
    endedAt?: true
    metadata?: true
    _all?: true
  }

  export type WorkRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkRecord to aggregate.
     */
    where?: WorkRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkRecords to fetch.
     */
    orderBy?: WorkRecordOrderByWithRelationInput | WorkRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkRecords
    **/
    _count?: true | WorkRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkRecordMaxAggregateInputType
  }

  export type GetWorkRecordAggregateType<T extends WorkRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkRecord[P]>
      : GetScalarType<T[P], AggregateWorkRecord[P]>
  }




  export type WorkRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkRecordWhereInput
    orderBy?: WorkRecordOrderByWithAggregationInput | WorkRecordOrderByWithAggregationInput[]
    by: WorkRecordScalarFieldEnum[] | WorkRecordScalarFieldEnum
    having?: WorkRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkRecordCountAggregateInputType | true
    _min?: WorkRecordMinAggregateInputType
    _max?: WorkRecordMaxAggregateInputType
  }

  export type WorkRecordGroupByOutputType = {
    id: string
    profileId: string
    organizationId: string | null
    positionTitle: string | null
    startedAt: Date | null
    endedAt: Date | null
    metadata: JsonValue
    _count: WorkRecordCountAggregateOutputType | null
    _min: WorkRecordMinAggregateOutputType | null
    _max: WorkRecordMaxAggregateOutputType | null
  }

  type GetWorkRecordGroupByPayload<T extends WorkRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkRecordGroupByOutputType[P]>
            : GetScalarType<T[P], WorkRecordGroupByOutputType[P]>
        }
      >
    >


  export type WorkRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    positionTitle?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workRecord"]>

  export type WorkRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    positionTitle?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workRecord"]>

  export type WorkRecordSelectScalar = {
    id?: boolean
    profileId?: boolean
    organizationId?: boolean
    positionTitle?: boolean
    startedAt?: boolean
    endedAt?: boolean
    metadata?: boolean
  }

  export type WorkRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type WorkRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $WorkRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkRecord"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      organizationId: string | null
      positionTitle: string | null
      startedAt: Date | null
      endedAt: Date | null
      metadata: Prisma.JsonValue
    }, ExtArgs["result"]["workRecord"]>
    composites: {}
  }

  type WorkRecordGetPayload<S extends boolean | null | undefined | WorkRecordDefaultArgs> = $Result.GetResult<Prisma.$WorkRecordPayload, S>

  type WorkRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkRecordCountAggregateInputType | true
    }

  export interface WorkRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkRecord'], meta: { name: 'WorkRecord' } }
    /**
     * Find zero or one WorkRecord that matches the filter.
     * @param {WorkRecordFindUniqueArgs} args - Arguments to find a WorkRecord
     * @example
     * // Get one WorkRecord
     * const workRecord = await prisma.workRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkRecordFindUniqueArgs>(args: SelectSubset<T, WorkRecordFindUniqueArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkRecordFindUniqueOrThrowArgs} args - Arguments to find a WorkRecord
     * @example
     * // Get one WorkRecord
     * const workRecord = await prisma.workRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordFindFirstArgs} args - Arguments to find a WorkRecord
     * @example
     * // Get one WorkRecord
     * const workRecord = await prisma.workRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkRecordFindFirstArgs>(args?: SelectSubset<T, WorkRecordFindFirstArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordFindFirstOrThrowArgs} args - Arguments to find a WorkRecord
     * @example
     * // Get one WorkRecord
     * const workRecord = await prisma.workRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkRecords
     * const workRecords = await prisma.workRecord.findMany()
     * 
     * // Get first 10 WorkRecords
     * const workRecords = await prisma.workRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workRecordWithIdOnly = await prisma.workRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkRecordFindManyArgs>(args?: SelectSubset<T, WorkRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkRecord.
     * @param {WorkRecordCreateArgs} args - Arguments to create a WorkRecord.
     * @example
     * // Create one WorkRecord
     * const WorkRecord = await prisma.workRecord.create({
     *   data: {
     *     // ... data to create a WorkRecord
     *   }
     * })
     * 
     */
    create<T extends WorkRecordCreateArgs>(args: SelectSubset<T, WorkRecordCreateArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkRecords.
     * @param {WorkRecordCreateManyArgs} args - Arguments to create many WorkRecords.
     * @example
     * // Create many WorkRecords
     * const workRecord = await prisma.workRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkRecordCreateManyArgs>(args?: SelectSubset<T, WorkRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkRecords and returns the data saved in the database.
     * @param {WorkRecordCreateManyAndReturnArgs} args - Arguments to create many WorkRecords.
     * @example
     * // Create many WorkRecords
     * const workRecord = await prisma.workRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkRecords and only return the `id`
     * const workRecordWithIdOnly = await prisma.workRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkRecord.
     * @param {WorkRecordDeleteArgs} args - Arguments to delete one WorkRecord.
     * @example
     * // Delete one WorkRecord
     * const WorkRecord = await prisma.workRecord.delete({
     *   where: {
     *     // ... filter to delete one WorkRecord
     *   }
     * })
     * 
     */
    delete<T extends WorkRecordDeleteArgs>(args: SelectSubset<T, WorkRecordDeleteArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkRecord.
     * @param {WorkRecordUpdateArgs} args - Arguments to update one WorkRecord.
     * @example
     * // Update one WorkRecord
     * const workRecord = await prisma.workRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkRecordUpdateArgs>(args: SelectSubset<T, WorkRecordUpdateArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkRecords.
     * @param {WorkRecordDeleteManyArgs} args - Arguments to filter WorkRecords to delete.
     * @example
     * // Delete a few WorkRecords
     * const { count } = await prisma.workRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkRecordDeleteManyArgs>(args?: SelectSubset<T, WorkRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkRecords
     * const workRecord = await prisma.workRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkRecordUpdateManyArgs>(args: SelectSubset<T, WorkRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkRecord.
     * @param {WorkRecordUpsertArgs} args - Arguments to update or create a WorkRecord.
     * @example
     * // Update or create a WorkRecord
     * const workRecord = await prisma.workRecord.upsert({
     *   create: {
     *     // ... data to create a WorkRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkRecord we want to update
     *   }
     * })
     */
    upsert<T extends WorkRecordUpsertArgs>(args: SelectSubset<T, WorkRecordUpsertArgs<ExtArgs>>): Prisma__WorkRecordClient<$Result.GetResult<Prisma.$WorkRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordCountArgs} args - Arguments to filter WorkRecords to count.
     * @example
     * // Count the number of WorkRecords
     * const count = await prisma.workRecord.count({
     *   where: {
     *     // ... the filter for the WorkRecords we want to count
     *   }
     * })
    **/
    count<T extends WorkRecordCountArgs>(
      args?: Subset<T, WorkRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WorkRecordAggregateArgs>(args: Subset<T, WorkRecordAggregateArgs>): Prisma.PrismaPromise<GetWorkRecordAggregateType<T>>

    /**
     * Group by WorkRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkRecordGroupByArgs} args - Group by arguments.
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
      T extends WorkRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkRecordGroupByArgs['orderBy'] }
        : { orderBy?: WorkRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WorkRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkRecord model
   */
  readonly fields: WorkRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the WorkRecord model
   */ 
  interface WorkRecordFieldRefs {
    readonly id: FieldRef<"WorkRecord", 'String'>
    readonly profileId: FieldRef<"WorkRecord", 'String'>
    readonly organizationId: FieldRef<"WorkRecord", 'String'>
    readonly positionTitle: FieldRef<"WorkRecord", 'String'>
    readonly startedAt: FieldRef<"WorkRecord", 'DateTime'>
    readonly endedAt: FieldRef<"WorkRecord", 'DateTime'>
    readonly metadata: FieldRef<"WorkRecord", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * WorkRecord findUnique
   */
  export type WorkRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter, which WorkRecord to fetch.
     */
    where: WorkRecordWhereUniqueInput
  }

  /**
   * WorkRecord findUniqueOrThrow
   */
  export type WorkRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter, which WorkRecord to fetch.
     */
    where: WorkRecordWhereUniqueInput
  }

  /**
   * WorkRecord findFirst
   */
  export type WorkRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter, which WorkRecord to fetch.
     */
    where?: WorkRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkRecords to fetch.
     */
    orderBy?: WorkRecordOrderByWithRelationInput | WorkRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkRecords.
     */
    cursor?: WorkRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkRecords.
     */
    distinct?: WorkRecordScalarFieldEnum | WorkRecordScalarFieldEnum[]
  }

  /**
   * WorkRecord findFirstOrThrow
   */
  export type WorkRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter, which WorkRecord to fetch.
     */
    where?: WorkRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkRecords to fetch.
     */
    orderBy?: WorkRecordOrderByWithRelationInput | WorkRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkRecords.
     */
    cursor?: WorkRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkRecords.
     */
    distinct?: WorkRecordScalarFieldEnum | WorkRecordScalarFieldEnum[]
  }

  /**
   * WorkRecord findMany
   */
  export type WorkRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter, which WorkRecords to fetch.
     */
    where?: WorkRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkRecords to fetch.
     */
    orderBy?: WorkRecordOrderByWithRelationInput | WorkRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkRecords.
     */
    cursor?: WorkRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkRecords.
     */
    skip?: number
    distinct?: WorkRecordScalarFieldEnum | WorkRecordScalarFieldEnum[]
  }

  /**
   * WorkRecord create
   */
  export type WorkRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkRecord.
     */
    data: XOR<WorkRecordCreateInput, WorkRecordUncheckedCreateInput>
  }

  /**
   * WorkRecord createMany
   */
  export type WorkRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkRecords.
     */
    data: WorkRecordCreateManyInput | WorkRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkRecord createManyAndReturn
   */
  export type WorkRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkRecords.
     */
    data: WorkRecordCreateManyInput | WorkRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkRecord update
   */
  export type WorkRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkRecord.
     */
    data: XOR<WorkRecordUpdateInput, WorkRecordUncheckedUpdateInput>
    /**
     * Choose, which WorkRecord to update.
     */
    where: WorkRecordWhereUniqueInput
  }

  /**
   * WorkRecord updateMany
   */
  export type WorkRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkRecords.
     */
    data: XOR<WorkRecordUpdateManyMutationInput, WorkRecordUncheckedUpdateManyInput>
    /**
     * Filter which WorkRecords to update
     */
    where?: WorkRecordWhereInput
  }

  /**
   * WorkRecord upsert
   */
  export type WorkRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkRecord to update in case it exists.
     */
    where: WorkRecordWhereUniqueInput
    /**
     * In case the WorkRecord found by the `where` argument doesn't exist, create a new WorkRecord with this data.
     */
    create: XOR<WorkRecordCreateInput, WorkRecordUncheckedCreateInput>
    /**
     * In case the WorkRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkRecordUpdateInput, WorkRecordUncheckedUpdateInput>
  }

  /**
   * WorkRecord delete
   */
  export type WorkRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
    /**
     * Filter which WorkRecord to delete.
     */
    where: WorkRecordWhereUniqueInput
  }

  /**
   * WorkRecord deleteMany
   */
  export type WorkRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkRecords to delete
     */
    where?: WorkRecordWhereInput
  }

  /**
   * WorkRecord without action
   */
  export type WorkRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkRecord
     */
    select?: WorkRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkRecordInclude<ExtArgs> | null
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


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    displayName: 'displayName',
    firstName: 'firstName',
    lastName: 'lastName',
    phoneNumber: 'phoneNumber',
    phoneNumberVerifiedAt: 'phoneNumberVerifiedAt',
    organisation: 'organisation',
    birthDate: 'birthDate',
    gender: 'gender',
    country: 'country',
    address: 'address',
    preferredLanguage: 'preferredLanguage',
    completionStatus: 'completionStatus',
    verifiedAt: 'verifiedAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const ProfileVerificationScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    status: 'status',
    type: 'type',
    rejectedReason: 'rejectedReason',
    reviewedBy: 'reviewedBy',
    reviewedAt: 'reviewedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileVerificationScalarFieldEnum = (typeof ProfileVerificationScalarFieldEnum)[keyof typeof ProfileVerificationScalarFieldEnum]


  export const ProfileDocumentScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    type: 'type',
    name: 'name',
    storageKey: 'storageKey',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    status: 'status',
    uploadedAt: 'uploadedAt'
  };

  export type ProfileDocumentScalarFieldEnum = (typeof ProfileDocumentScalarFieldEnum)[keyof typeof ProfileDocumentScalarFieldEnum]


  export const ProfileAuditLogScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    userId: 'userId',
    actorUserId: 'actorUserId',
    action: 'action',
    before: 'before',
    after: 'after',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type ProfileAuditLogScalarFieldEnum = (typeof ProfileAuditLogScalarFieldEnum)[keyof typeof ProfileAuditLogScalarFieldEnum]


  export const ProfileLocationScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    regionId: 'regionId',
    districtId: 'districtId',
    address: 'address',
    isPrimary: 'isPrimary',
    createdAt: 'createdAt'
  };

  export type ProfileLocationScalarFieldEnum = (typeof ProfileLocationScalarFieldEnum)[keyof typeof ProfileLocationScalarFieldEnum]


  export const EducationRecordScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    organizationId: 'organizationId',
    schoolId: 'schoolId',
    classId: 'classId',
    level: 'level',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    metadata: 'metadata'
  };

  export type EducationRecordScalarFieldEnum = (typeof EducationRecordScalarFieldEnum)[keyof typeof EducationRecordScalarFieldEnum]


  export const WorkRecordScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    organizationId: 'organizationId',
    positionTitle: 'positionTitle',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    metadata: 'metadata'
  };

  export type WorkRecordScalarFieldEnum = (typeof WorkRecordScalarFieldEnum)[keyof typeof WorkRecordScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    userId?: StringFilter<"UserProfile"> | string
    displayName?: StringNullableFilter<"UserProfile"> | string | null
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phoneNumber?: StringNullableFilter<"UserProfile"> | string | null
    phoneNumberVerifiedAt?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    organisation?: StringNullableFilter<"UserProfile"> | string | null
    birthDate?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    gender?: StringNullableFilter<"UserProfile"> | string | null
    country?: StringNullableFilter<"UserProfile"> | string | null
    address?: StringNullableFilter<"UserProfile"> | string | null
    preferredLanguage?: StringNullableFilter<"UserProfile"> | string | null
    completionStatus?: StringNullableFilter<"UserProfile"> | string | null
    verifiedAt?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    metadata?: JsonFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    locations?: ProfileLocationListRelationFilter
    education?: EducationRecordListRelationFilter
    workHistory?: WorkRecordListRelationFilter
    verifications?: ProfileVerificationListRelationFilter
    documents?: ProfileDocumentListRelationFilter
    auditLogs?: ProfileAuditLogListRelationFilter
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    phoneNumberVerifiedAt?: SortOrderInput | SortOrder
    organisation?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrderInput | SortOrder
    completionStatus?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locations?: ProfileLocationOrderByRelationAggregateInput
    education?: EducationRecordOrderByRelationAggregateInput
    workHistory?: WorkRecordOrderByRelationAggregateInput
    verifications?: ProfileVerificationOrderByRelationAggregateInput
    documents?: ProfileDocumentOrderByRelationAggregateInput
    auditLogs?: ProfileAuditLogOrderByRelationAggregateInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    displayName?: StringNullableFilter<"UserProfile"> | string | null
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phoneNumber?: StringNullableFilter<"UserProfile"> | string | null
    phoneNumberVerifiedAt?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    organisation?: StringNullableFilter<"UserProfile"> | string | null
    birthDate?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    gender?: StringNullableFilter<"UserProfile"> | string | null
    country?: StringNullableFilter<"UserProfile"> | string | null
    address?: StringNullableFilter<"UserProfile"> | string | null
    preferredLanguage?: StringNullableFilter<"UserProfile"> | string | null
    completionStatus?: StringNullableFilter<"UserProfile"> | string | null
    verifiedAt?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    metadata?: JsonFilter<"UserProfile">
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    locations?: ProfileLocationListRelationFilter
    education?: EducationRecordListRelationFilter
    workHistory?: WorkRecordListRelationFilter
    verifications?: ProfileVerificationListRelationFilter
    documents?: ProfileDocumentListRelationFilter
    auditLogs?: ProfileAuditLogListRelationFilter
  }, "id" | "userId">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    phoneNumberVerifiedAt?: SortOrderInput | SortOrder
    organisation?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrderInput | SortOrder
    completionStatus?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    userId?: StringWithAggregatesFilter<"UserProfile"> | string
    displayName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    phoneNumberVerifiedAt?: DateTimeNullableWithAggregatesFilter<"UserProfile"> | Date | string | null
    organisation?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    birthDate?: DateTimeNullableWithAggregatesFilter<"UserProfile"> | Date | string | null
    gender?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    country?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    address?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    preferredLanguage?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    completionStatus?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"UserProfile"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"UserProfile">
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type ProfileVerificationWhereInput = {
    AND?: ProfileVerificationWhereInput | ProfileVerificationWhereInput[]
    OR?: ProfileVerificationWhereInput[]
    NOT?: ProfileVerificationWhereInput | ProfileVerificationWhereInput[]
    id?: StringFilter<"ProfileVerification"> | string
    profileId?: StringFilter<"ProfileVerification"> | string
    status?: StringFilter<"ProfileVerification"> | string
    type?: StringFilter<"ProfileVerification"> | string
    rejectedReason?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedBy?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedAt?: DateTimeNullableFilter<"ProfileVerification"> | Date | string | null
    createdAt?: DateTimeFilter<"ProfileVerification"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileVerification"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type ProfileVerificationOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    rejectedReason?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type ProfileVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileVerificationWhereInput | ProfileVerificationWhereInput[]
    OR?: ProfileVerificationWhereInput[]
    NOT?: ProfileVerificationWhereInput | ProfileVerificationWhereInput[]
    profileId?: StringFilter<"ProfileVerification"> | string
    status?: StringFilter<"ProfileVerification"> | string
    type?: StringFilter<"ProfileVerification"> | string
    rejectedReason?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedBy?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedAt?: DateTimeNullableFilter<"ProfileVerification"> | Date | string | null
    createdAt?: DateTimeFilter<"ProfileVerification"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileVerification"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type ProfileVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    rejectedReason?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileVerificationCountOrderByAggregateInput
    _max?: ProfileVerificationMaxOrderByAggregateInput
    _min?: ProfileVerificationMinOrderByAggregateInput
  }

  export type ProfileVerificationScalarWhereWithAggregatesInput = {
    AND?: ProfileVerificationScalarWhereWithAggregatesInput | ProfileVerificationScalarWhereWithAggregatesInput[]
    OR?: ProfileVerificationScalarWhereWithAggregatesInput[]
    NOT?: ProfileVerificationScalarWhereWithAggregatesInput | ProfileVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileVerification"> | string
    profileId?: StringWithAggregatesFilter<"ProfileVerification"> | string
    status?: StringWithAggregatesFilter<"ProfileVerification"> | string
    type?: StringWithAggregatesFilter<"ProfileVerification"> | string
    rejectedReason?: StringNullableWithAggregatesFilter<"ProfileVerification"> | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"ProfileVerification"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"ProfileVerification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProfileVerification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProfileVerification"> | Date | string
  }

  export type ProfileDocumentWhereInput = {
    AND?: ProfileDocumentWhereInput | ProfileDocumentWhereInput[]
    OR?: ProfileDocumentWhereInput[]
    NOT?: ProfileDocumentWhereInput | ProfileDocumentWhereInput[]
    id?: StringFilter<"ProfileDocument"> | string
    profileId?: StringFilter<"ProfileDocument"> | string
    type?: StringFilter<"ProfileDocument"> | string
    name?: StringFilter<"ProfileDocument"> | string
    storageKey?: StringFilter<"ProfileDocument"> | string
    mimeType?: StringFilter<"ProfileDocument"> | string
    sizeBytes?: IntFilter<"ProfileDocument"> | number
    status?: StringFilter<"ProfileDocument"> | string
    uploadedAt?: DateTimeFilter<"ProfileDocument"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type ProfileDocumentOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    status?: SortOrder
    uploadedAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type ProfileDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileDocumentWhereInput | ProfileDocumentWhereInput[]
    OR?: ProfileDocumentWhereInput[]
    NOT?: ProfileDocumentWhereInput | ProfileDocumentWhereInput[]
    profileId?: StringFilter<"ProfileDocument"> | string
    type?: StringFilter<"ProfileDocument"> | string
    name?: StringFilter<"ProfileDocument"> | string
    storageKey?: StringFilter<"ProfileDocument"> | string
    mimeType?: StringFilter<"ProfileDocument"> | string
    sizeBytes?: IntFilter<"ProfileDocument"> | number
    status?: StringFilter<"ProfileDocument"> | string
    uploadedAt?: DateTimeFilter<"ProfileDocument"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type ProfileDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    status?: SortOrder
    uploadedAt?: SortOrder
    _count?: ProfileDocumentCountOrderByAggregateInput
    _avg?: ProfileDocumentAvgOrderByAggregateInput
    _max?: ProfileDocumentMaxOrderByAggregateInput
    _min?: ProfileDocumentMinOrderByAggregateInput
    _sum?: ProfileDocumentSumOrderByAggregateInput
  }

  export type ProfileDocumentScalarWhereWithAggregatesInput = {
    AND?: ProfileDocumentScalarWhereWithAggregatesInput | ProfileDocumentScalarWhereWithAggregatesInput[]
    OR?: ProfileDocumentScalarWhereWithAggregatesInput[]
    NOT?: ProfileDocumentScalarWhereWithAggregatesInput | ProfileDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileDocument"> | string
    profileId?: StringWithAggregatesFilter<"ProfileDocument"> | string
    type?: StringWithAggregatesFilter<"ProfileDocument"> | string
    name?: StringWithAggregatesFilter<"ProfileDocument"> | string
    storageKey?: StringWithAggregatesFilter<"ProfileDocument"> | string
    mimeType?: StringWithAggregatesFilter<"ProfileDocument"> | string
    sizeBytes?: IntWithAggregatesFilter<"ProfileDocument"> | number
    status?: StringWithAggregatesFilter<"ProfileDocument"> | string
    uploadedAt?: DateTimeWithAggregatesFilter<"ProfileDocument"> | Date | string
  }

  export type ProfileAuditLogWhereInput = {
    AND?: ProfileAuditLogWhereInput | ProfileAuditLogWhereInput[]
    OR?: ProfileAuditLogWhereInput[]
    NOT?: ProfileAuditLogWhereInput | ProfileAuditLogWhereInput[]
    id?: StringFilter<"ProfileAuditLog"> | string
    profileId?: StringFilter<"ProfileAuditLog"> | string
    userId?: StringFilter<"ProfileAuditLog"> | string
    actorUserId?: StringFilter<"ProfileAuditLog"> | string
    action?: StringFilter<"ProfileAuditLog"> | string
    before?: JsonFilter<"ProfileAuditLog">
    after?: JsonFilter<"ProfileAuditLog">
    ipAddress?: StringNullableFilter<"ProfileAuditLog"> | string | null
    userAgent?: StringNullableFilter<"ProfileAuditLog"> | string | null
    createdAt?: DateTimeFilter<"ProfileAuditLog"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type ProfileAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    userId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    before?: SortOrder
    after?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type ProfileAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileAuditLogWhereInput | ProfileAuditLogWhereInput[]
    OR?: ProfileAuditLogWhereInput[]
    NOT?: ProfileAuditLogWhereInput | ProfileAuditLogWhereInput[]
    profileId?: StringFilter<"ProfileAuditLog"> | string
    userId?: StringFilter<"ProfileAuditLog"> | string
    actorUserId?: StringFilter<"ProfileAuditLog"> | string
    action?: StringFilter<"ProfileAuditLog"> | string
    before?: JsonFilter<"ProfileAuditLog">
    after?: JsonFilter<"ProfileAuditLog">
    ipAddress?: StringNullableFilter<"ProfileAuditLog"> | string | null
    userAgent?: StringNullableFilter<"ProfileAuditLog"> | string | null
    createdAt?: DateTimeFilter<"ProfileAuditLog"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type ProfileAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    userId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    before?: SortOrder
    after?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProfileAuditLogCountOrderByAggregateInput
    _max?: ProfileAuditLogMaxOrderByAggregateInput
    _min?: ProfileAuditLogMinOrderByAggregateInput
  }

  export type ProfileAuditLogScalarWhereWithAggregatesInput = {
    AND?: ProfileAuditLogScalarWhereWithAggregatesInput | ProfileAuditLogScalarWhereWithAggregatesInput[]
    OR?: ProfileAuditLogScalarWhereWithAggregatesInput[]
    NOT?: ProfileAuditLogScalarWhereWithAggregatesInput | ProfileAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileAuditLog"> | string
    profileId?: StringWithAggregatesFilter<"ProfileAuditLog"> | string
    userId?: StringWithAggregatesFilter<"ProfileAuditLog"> | string
    actorUserId?: StringWithAggregatesFilter<"ProfileAuditLog"> | string
    action?: StringWithAggregatesFilter<"ProfileAuditLog"> | string
    before?: JsonWithAggregatesFilter<"ProfileAuditLog">
    after?: JsonWithAggregatesFilter<"ProfileAuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"ProfileAuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"ProfileAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProfileAuditLog"> | Date | string
  }

  export type ProfileLocationWhereInput = {
    AND?: ProfileLocationWhereInput | ProfileLocationWhereInput[]
    OR?: ProfileLocationWhereInput[]
    NOT?: ProfileLocationWhereInput | ProfileLocationWhereInput[]
    id?: StringFilter<"ProfileLocation"> | string
    profileId?: StringFilter<"ProfileLocation"> | string
    regionId?: StringNullableFilter<"ProfileLocation"> | string | null
    districtId?: StringNullableFilter<"ProfileLocation"> | string | null
    address?: StringNullableFilter<"ProfileLocation"> | string | null
    isPrimary?: BoolFilter<"ProfileLocation"> | boolean
    createdAt?: DateTimeFilter<"ProfileLocation"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type ProfileLocationOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type ProfileLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileLocationWhereInput | ProfileLocationWhereInput[]
    OR?: ProfileLocationWhereInput[]
    NOT?: ProfileLocationWhereInput | ProfileLocationWhereInput[]
    profileId?: StringFilter<"ProfileLocation"> | string
    regionId?: StringNullableFilter<"ProfileLocation"> | string | null
    districtId?: StringNullableFilter<"ProfileLocation"> | string | null
    address?: StringNullableFilter<"ProfileLocation"> | string | null
    isPrimary?: BoolFilter<"ProfileLocation"> | boolean
    createdAt?: DateTimeFilter<"ProfileLocation"> | Date | string
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type ProfileLocationOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    regionId?: SortOrderInput | SortOrder
    districtId?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    _count?: ProfileLocationCountOrderByAggregateInput
    _max?: ProfileLocationMaxOrderByAggregateInput
    _min?: ProfileLocationMinOrderByAggregateInput
  }

  export type ProfileLocationScalarWhereWithAggregatesInput = {
    AND?: ProfileLocationScalarWhereWithAggregatesInput | ProfileLocationScalarWhereWithAggregatesInput[]
    OR?: ProfileLocationScalarWhereWithAggregatesInput[]
    NOT?: ProfileLocationScalarWhereWithAggregatesInput | ProfileLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileLocation"> | string
    profileId?: StringWithAggregatesFilter<"ProfileLocation"> | string
    regionId?: StringNullableWithAggregatesFilter<"ProfileLocation"> | string | null
    districtId?: StringNullableWithAggregatesFilter<"ProfileLocation"> | string | null
    address?: StringNullableWithAggregatesFilter<"ProfileLocation"> | string | null
    isPrimary?: BoolWithAggregatesFilter<"ProfileLocation"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ProfileLocation"> | Date | string
  }

  export type EducationRecordWhereInput = {
    AND?: EducationRecordWhereInput | EducationRecordWhereInput[]
    OR?: EducationRecordWhereInput[]
    NOT?: EducationRecordWhereInput | EducationRecordWhereInput[]
    id?: StringFilter<"EducationRecord"> | string
    profileId?: StringFilter<"EducationRecord"> | string
    organizationId?: StringNullableFilter<"EducationRecord"> | string | null
    schoolId?: StringNullableFilter<"EducationRecord"> | string | null
    classId?: StringNullableFilter<"EducationRecord"> | string | null
    level?: StringNullableFilter<"EducationRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    metadata?: JsonFilter<"EducationRecord">
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type EducationRecordOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    schoolId?: SortOrderInput | SortOrder
    classId?: SortOrderInput | SortOrder
    level?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type EducationRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EducationRecordWhereInput | EducationRecordWhereInput[]
    OR?: EducationRecordWhereInput[]
    NOT?: EducationRecordWhereInput | EducationRecordWhereInput[]
    profileId?: StringFilter<"EducationRecord"> | string
    organizationId?: StringNullableFilter<"EducationRecord"> | string | null
    schoolId?: StringNullableFilter<"EducationRecord"> | string | null
    classId?: StringNullableFilter<"EducationRecord"> | string | null
    level?: StringNullableFilter<"EducationRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    metadata?: JsonFilter<"EducationRecord">
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type EducationRecordOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    schoolId?: SortOrderInput | SortOrder
    classId?: SortOrderInput | SortOrder
    level?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    _count?: EducationRecordCountOrderByAggregateInput
    _max?: EducationRecordMaxOrderByAggregateInput
    _min?: EducationRecordMinOrderByAggregateInput
  }

  export type EducationRecordScalarWhereWithAggregatesInput = {
    AND?: EducationRecordScalarWhereWithAggregatesInput | EducationRecordScalarWhereWithAggregatesInput[]
    OR?: EducationRecordScalarWhereWithAggregatesInput[]
    NOT?: EducationRecordScalarWhereWithAggregatesInput | EducationRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EducationRecord"> | string
    profileId?: StringWithAggregatesFilter<"EducationRecord"> | string
    organizationId?: StringNullableWithAggregatesFilter<"EducationRecord"> | string | null
    schoolId?: StringNullableWithAggregatesFilter<"EducationRecord"> | string | null
    classId?: StringNullableWithAggregatesFilter<"EducationRecord"> | string | null
    level?: StringNullableWithAggregatesFilter<"EducationRecord"> | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"EducationRecord"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"EducationRecord"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"EducationRecord">
  }

  export type WorkRecordWhereInput = {
    AND?: WorkRecordWhereInput | WorkRecordWhereInput[]
    OR?: WorkRecordWhereInput[]
    NOT?: WorkRecordWhereInput | WorkRecordWhereInput[]
    id?: StringFilter<"WorkRecord"> | string
    profileId?: StringFilter<"WorkRecord"> | string
    organizationId?: StringNullableFilter<"WorkRecord"> | string | null
    positionTitle?: StringNullableFilter<"WorkRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    metadata?: JsonFilter<"WorkRecord">
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }

  export type WorkRecordOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    positionTitle?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
  }

  export type WorkRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkRecordWhereInput | WorkRecordWhereInput[]
    OR?: WorkRecordWhereInput[]
    NOT?: WorkRecordWhereInput | WorkRecordWhereInput[]
    profileId?: StringFilter<"WorkRecord"> | string
    organizationId?: StringNullableFilter<"WorkRecord"> | string | null
    positionTitle?: StringNullableFilter<"WorkRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    metadata?: JsonFilter<"WorkRecord">
    profile?: XOR<UserProfileRelationFilter, UserProfileWhereInput>
  }, "id">

  export type WorkRecordOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    positionTitle?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    metadata?: SortOrder
    _count?: WorkRecordCountOrderByAggregateInput
    _max?: WorkRecordMaxOrderByAggregateInput
    _min?: WorkRecordMinOrderByAggregateInput
  }

  export type WorkRecordScalarWhereWithAggregatesInput = {
    AND?: WorkRecordScalarWhereWithAggregatesInput | WorkRecordScalarWhereWithAggregatesInput[]
    OR?: WorkRecordScalarWhereWithAggregatesInput[]
    NOT?: WorkRecordScalarWhereWithAggregatesInput | WorkRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkRecord"> | string
    profileId?: StringWithAggregatesFilter<"WorkRecord"> | string
    organizationId?: StringNullableWithAggregatesFilter<"WorkRecord"> | string | null
    positionTitle?: StringNullableWithAggregatesFilter<"WorkRecord"> | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"WorkRecord"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"WorkRecord"> | Date | string | null
    metadata?: JsonWithAggregatesFilter<"WorkRecord">
  }

  export type UserProfileCreateInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateManyInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileVerificationCreateInput = {
    id?: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: UserProfileCreateNestedOneWithoutVerificationsInput
  }

  export type ProfileVerificationUncheckedCreateInput = {
    id?: string
    profileId: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneRequiredWithoutVerificationsNestedInput
  }

  export type ProfileVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileVerificationCreateManyInput = {
    id?: string
    profileId: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentCreateInput = {
    id?: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
    profile: UserProfileCreateNestedOneWithoutDocumentsInput
  }

  export type ProfileDocumentUncheckedCreateInput = {
    id?: string
    profileId: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
  }

  export type ProfileDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type ProfileDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentCreateManyInput = {
    id?: string
    profileId: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
  }

  export type ProfileDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogCreateInput = {
    id?: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    profile: UserProfileCreateNestedOneWithoutAuditLogsInput
  }

  export type ProfileAuditLogUncheckedCreateInput = {
    id?: string
    profileId: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ProfileAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type ProfileAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogCreateManyInput = {
    id?: string
    profileId: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ProfileAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileLocationCreateInput = {
    id?: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
    profile: UserProfileCreateNestedOneWithoutLocationsInput
  }

  export type ProfileLocationUncheckedCreateInput = {
    id?: string
    profileId: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type ProfileLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type ProfileLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileLocationCreateManyInput = {
    id?: string
    profileId: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type ProfileLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationRecordCreateInput = {
    id?: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    profile: UserProfileCreateNestedOneWithoutEducationInput
  }

  export type EducationRecordUncheckedCreateInput = {
    id?: string
    profileId: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    profile?: UserProfileUpdateOneRequiredWithoutEducationNestedInput
  }

  export type EducationRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordCreateManyInput = {
    id?: string
    profileId: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordCreateInput = {
    id?: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    profile: UserProfileCreateNestedOneWithoutWorkHistoryInput
  }

  export type WorkRecordUncheckedCreateInput = {
    id?: string
    profileId: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    profile?: UserProfileUpdateOneRequiredWithoutWorkHistoryNestedInput
  }

  export type WorkRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordCreateManyInput = {
    id?: string
    profileId: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
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

  export type ProfileLocationListRelationFilter = {
    every?: ProfileLocationWhereInput
    some?: ProfileLocationWhereInput
    none?: ProfileLocationWhereInput
  }

  export type EducationRecordListRelationFilter = {
    every?: EducationRecordWhereInput
    some?: EducationRecordWhereInput
    none?: EducationRecordWhereInput
  }

  export type WorkRecordListRelationFilter = {
    every?: WorkRecordWhereInput
    some?: WorkRecordWhereInput
    none?: WorkRecordWhereInput
  }

  export type ProfileVerificationListRelationFilter = {
    every?: ProfileVerificationWhereInput
    some?: ProfileVerificationWhereInput
    none?: ProfileVerificationWhereInput
  }

  export type ProfileDocumentListRelationFilter = {
    every?: ProfileDocumentWhereInput
    some?: ProfileDocumentWhereInput
    none?: ProfileDocumentWhereInput
  }

  export type ProfileAuditLogListRelationFilter = {
    every?: ProfileAuditLogWhereInput
    some?: ProfileAuditLogWhereInput
    none?: ProfileAuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProfileLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EducationRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileVerificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phoneNumber?: SortOrder
    phoneNumberVerifiedAt?: SortOrder
    organisation?: SortOrder
    birthDate?: SortOrder
    gender?: SortOrder
    country?: SortOrder
    address?: SortOrder
    preferredLanguage?: SortOrder
    completionStatus?: SortOrder
    verifiedAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phoneNumber?: SortOrder
    phoneNumberVerifiedAt?: SortOrder
    organisation?: SortOrder
    birthDate?: SortOrder
    gender?: SortOrder
    country?: SortOrder
    address?: SortOrder
    preferredLanguage?: SortOrder
    completionStatus?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phoneNumber?: SortOrder
    phoneNumberVerifiedAt?: SortOrder
    organisation?: SortOrder
    birthDate?: SortOrder
    gender?: SortOrder
    country?: SortOrder
    address?: SortOrder
    preferredLanguage?: SortOrder
    completionStatus?: SortOrder
    verifiedAt?: SortOrder
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

  export type UserProfileRelationFilter = {
    is?: UserProfileWhereInput
    isNot?: UserProfileWhereInput
  }

  export type ProfileVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    rejectedReason?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    rejectedReason?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    status?: SortOrder
    type?: SortOrder
    rejectedReason?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProfileDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    status?: SortOrder
    uploadedAt?: SortOrder
  }

  export type ProfileDocumentAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type ProfileDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    status?: SortOrder
    uploadedAt?: SortOrder
  }

  export type ProfileDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    status?: SortOrder
    uploadedAt?: SortOrder
  }

  export type ProfileDocumentSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ProfileAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    userId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    before?: SortOrder
    after?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    userId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    userId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProfileLocationCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    address?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    address?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileLocationMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    regionId?: SortOrder
    districtId?: SortOrder
    address?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EducationRecordCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    level?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    metadata?: SortOrder
  }

  export type EducationRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    level?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type EducationRecordMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    level?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type WorkRecordCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    positionTitle?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    metadata?: SortOrder
  }

  export type WorkRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    positionTitle?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type WorkRecordMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    organizationId?: SortOrder
    positionTitle?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ProfileLocationCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput> | ProfileLocationCreateWithoutProfileInput[] | ProfileLocationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileLocationCreateOrConnectWithoutProfileInput | ProfileLocationCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileLocationCreateManyProfileInputEnvelope
    connect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
  }

  export type EducationRecordCreateNestedManyWithoutProfileInput = {
    create?: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput> | EducationRecordCreateWithoutProfileInput[] | EducationRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationRecordCreateOrConnectWithoutProfileInput | EducationRecordCreateOrConnectWithoutProfileInput[]
    createMany?: EducationRecordCreateManyProfileInputEnvelope
    connect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
  }

  export type WorkRecordCreateNestedManyWithoutProfileInput = {
    create?: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput> | WorkRecordCreateWithoutProfileInput[] | WorkRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: WorkRecordCreateOrConnectWithoutProfileInput | WorkRecordCreateOrConnectWithoutProfileInput[]
    createMany?: WorkRecordCreateManyProfileInputEnvelope
    connect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
  }

  export type ProfileVerificationCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput> | ProfileVerificationCreateWithoutProfileInput[] | ProfileVerificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileVerificationCreateOrConnectWithoutProfileInput | ProfileVerificationCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileVerificationCreateManyProfileInputEnvelope
    connect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
  }

  export type ProfileDocumentCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput> | ProfileDocumentCreateWithoutProfileInput[] | ProfileDocumentUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileDocumentCreateOrConnectWithoutProfileInput | ProfileDocumentCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileDocumentCreateManyProfileInputEnvelope
    connect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
  }

  export type ProfileAuditLogCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput> | ProfileAuditLogCreateWithoutProfileInput[] | ProfileAuditLogUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileAuditLogCreateOrConnectWithoutProfileInput | ProfileAuditLogCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileAuditLogCreateManyProfileInputEnvelope
    connect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
  }

  export type ProfileLocationUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput> | ProfileLocationCreateWithoutProfileInput[] | ProfileLocationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileLocationCreateOrConnectWithoutProfileInput | ProfileLocationCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileLocationCreateManyProfileInputEnvelope
    connect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
  }

  export type EducationRecordUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput> | EducationRecordCreateWithoutProfileInput[] | EducationRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationRecordCreateOrConnectWithoutProfileInput | EducationRecordCreateOrConnectWithoutProfileInput[]
    createMany?: EducationRecordCreateManyProfileInputEnvelope
    connect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
  }

  export type WorkRecordUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput> | WorkRecordCreateWithoutProfileInput[] | WorkRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: WorkRecordCreateOrConnectWithoutProfileInput | WorkRecordCreateOrConnectWithoutProfileInput[]
    createMany?: WorkRecordCreateManyProfileInputEnvelope
    connect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
  }

  export type ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput> | ProfileVerificationCreateWithoutProfileInput[] | ProfileVerificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileVerificationCreateOrConnectWithoutProfileInput | ProfileVerificationCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileVerificationCreateManyProfileInputEnvelope
    connect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
  }

  export type ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput> | ProfileDocumentCreateWithoutProfileInput[] | ProfileDocumentUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileDocumentCreateOrConnectWithoutProfileInput | ProfileDocumentCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileDocumentCreateManyProfileInputEnvelope
    connect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
  }

  export type ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput> | ProfileAuditLogCreateWithoutProfileInput[] | ProfileAuditLogUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileAuditLogCreateOrConnectWithoutProfileInput | ProfileAuditLogCreateOrConnectWithoutProfileInput[]
    createMany?: ProfileAuditLogCreateManyProfileInputEnvelope
    connect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProfileLocationUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput> | ProfileLocationCreateWithoutProfileInput[] | ProfileLocationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileLocationCreateOrConnectWithoutProfileInput | ProfileLocationCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileLocationUpsertWithWhereUniqueWithoutProfileInput | ProfileLocationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileLocationCreateManyProfileInputEnvelope
    set?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    disconnect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    delete?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    connect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    update?: ProfileLocationUpdateWithWhereUniqueWithoutProfileInput | ProfileLocationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileLocationUpdateManyWithWhereWithoutProfileInput | ProfileLocationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileLocationScalarWhereInput | ProfileLocationScalarWhereInput[]
  }

  export type EducationRecordUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput> | EducationRecordCreateWithoutProfileInput[] | EducationRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationRecordCreateOrConnectWithoutProfileInput | EducationRecordCreateOrConnectWithoutProfileInput[]
    upsert?: EducationRecordUpsertWithWhereUniqueWithoutProfileInput | EducationRecordUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EducationRecordCreateManyProfileInputEnvelope
    set?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    disconnect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    delete?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    connect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    update?: EducationRecordUpdateWithWhereUniqueWithoutProfileInput | EducationRecordUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EducationRecordUpdateManyWithWhereWithoutProfileInput | EducationRecordUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EducationRecordScalarWhereInput | EducationRecordScalarWhereInput[]
  }

  export type WorkRecordUpdateManyWithoutProfileNestedInput = {
    create?: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput> | WorkRecordCreateWithoutProfileInput[] | WorkRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: WorkRecordCreateOrConnectWithoutProfileInput | WorkRecordCreateOrConnectWithoutProfileInput[]
    upsert?: WorkRecordUpsertWithWhereUniqueWithoutProfileInput | WorkRecordUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: WorkRecordCreateManyProfileInputEnvelope
    set?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    disconnect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    delete?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    connect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    update?: WorkRecordUpdateWithWhereUniqueWithoutProfileInput | WorkRecordUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: WorkRecordUpdateManyWithWhereWithoutProfileInput | WorkRecordUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: WorkRecordScalarWhereInput | WorkRecordScalarWhereInput[]
  }

  export type ProfileVerificationUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput> | ProfileVerificationCreateWithoutProfileInput[] | ProfileVerificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileVerificationCreateOrConnectWithoutProfileInput | ProfileVerificationCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileVerificationUpsertWithWhereUniqueWithoutProfileInput | ProfileVerificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileVerificationCreateManyProfileInputEnvelope
    set?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    disconnect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    delete?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    connect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    update?: ProfileVerificationUpdateWithWhereUniqueWithoutProfileInput | ProfileVerificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileVerificationUpdateManyWithWhereWithoutProfileInput | ProfileVerificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileVerificationScalarWhereInput | ProfileVerificationScalarWhereInput[]
  }

  export type ProfileDocumentUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput> | ProfileDocumentCreateWithoutProfileInput[] | ProfileDocumentUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileDocumentCreateOrConnectWithoutProfileInput | ProfileDocumentCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileDocumentUpsertWithWhereUniqueWithoutProfileInput | ProfileDocumentUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileDocumentCreateManyProfileInputEnvelope
    set?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    disconnect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    delete?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    connect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    update?: ProfileDocumentUpdateWithWhereUniqueWithoutProfileInput | ProfileDocumentUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileDocumentUpdateManyWithWhereWithoutProfileInput | ProfileDocumentUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileDocumentScalarWhereInput | ProfileDocumentScalarWhereInput[]
  }

  export type ProfileAuditLogUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput> | ProfileAuditLogCreateWithoutProfileInput[] | ProfileAuditLogUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileAuditLogCreateOrConnectWithoutProfileInput | ProfileAuditLogCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileAuditLogUpsertWithWhereUniqueWithoutProfileInput | ProfileAuditLogUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileAuditLogCreateManyProfileInputEnvelope
    set?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    disconnect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    delete?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    connect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    update?: ProfileAuditLogUpdateWithWhereUniqueWithoutProfileInput | ProfileAuditLogUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileAuditLogUpdateManyWithWhereWithoutProfileInput | ProfileAuditLogUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileAuditLogScalarWhereInput | ProfileAuditLogScalarWhereInput[]
  }

  export type ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput> | ProfileLocationCreateWithoutProfileInput[] | ProfileLocationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileLocationCreateOrConnectWithoutProfileInput | ProfileLocationCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileLocationUpsertWithWhereUniqueWithoutProfileInput | ProfileLocationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileLocationCreateManyProfileInputEnvelope
    set?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    disconnect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    delete?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    connect?: ProfileLocationWhereUniqueInput | ProfileLocationWhereUniqueInput[]
    update?: ProfileLocationUpdateWithWhereUniqueWithoutProfileInput | ProfileLocationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileLocationUpdateManyWithWhereWithoutProfileInput | ProfileLocationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileLocationScalarWhereInput | ProfileLocationScalarWhereInput[]
  }

  export type EducationRecordUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput> | EducationRecordCreateWithoutProfileInput[] | EducationRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationRecordCreateOrConnectWithoutProfileInput | EducationRecordCreateOrConnectWithoutProfileInput[]
    upsert?: EducationRecordUpsertWithWhereUniqueWithoutProfileInput | EducationRecordUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EducationRecordCreateManyProfileInputEnvelope
    set?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    disconnect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    delete?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    connect?: EducationRecordWhereUniqueInput | EducationRecordWhereUniqueInput[]
    update?: EducationRecordUpdateWithWhereUniqueWithoutProfileInput | EducationRecordUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EducationRecordUpdateManyWithWhereWithoutProfileInput | EducationRecordUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EducationRecordScalarWhereInput | EducationRecordScalarWhereInput[]
  }

  export type WorkRecordUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput> | WorkRecordCreateWithoutProfileInput[] | WorkRecordUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: WorkRecordCreateOrConnectWithoutProfileInput | WorkRecordCreateOrConnectWithoutProfileInput[]
    upsert?: WorkRecordUpsertWithWhereUniqueWithoutProfileInput | WorkRecordUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: WorkRecordCreateManyProfileInputEnvelope
    set?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    disconnect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    delete?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    connect?: WorkRecordWhereUniqueInput | WorkRecordWhereUniqueInput[]
    update?: WorkRecordUpdateWithWhereUniqueWithoutProfileInput | WorkRecordUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: WorkRecordUpdateManyWithWhereWithoutProfileInput | WorkRecordUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: WorkRecordScalarWhereInput | WorkRecordScalarWhereInput[]
  }

  export type ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput> | ProfileVerificationCreateWithoutProfileInput[] | ProfileVerificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileVerificationCreateOrConnectWithoutProfileInput | ProfileVerificationCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileVerificationUpsertWithWhereUniqueWithoutProfileInput | ProfileVerificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileVerificationCreateManyProfileInputEnvelope
    set?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    disconnect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    delete?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    connect?: ProfileVerificationWhereUniqueInput | ProfileVerificationWhereUniqueInput[]
    update?: ProfileVerificationUpdateWithWhereUniqueWithoutProfileInput | ProfileVerificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileVerificationUpdateManyWithWhereWithoutProfileInput | ProfileVerificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileVerificationScalarWhereInput | ProfileVerificationScalarWhereInput[]
  }

  export type ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput> | ProfileDocumentCreateWithoutProfileInput[] | ProfileDocumentUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileDocumentCreateOrConnectWithoutProfileInput | ProfileDocumentCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileDocumentUpsertWithWhereUniqueWithoutProfileInput | ProfileDocumentUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileDocumentCreateManyProfileInputEnvelope
    set?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    disconnect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    delete?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    connect?: ProfileDocumentWhereUniqueInput | ProfileDocumentWhereUniqueInput[]
    update?: ProfileDocumentUpdateWithWhereUniqueWithoutProfileInput | ProfileDocumentUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileDocumentUpdateManyWithWhereWithoutProfileInput | ProfileDocumentUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileDocumentScalarWhereInput | ProfileDocumentScalarWhereInput[]
  }

  export type ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput> | ProfileAuditLogCreateWithoutProfileInput[] | ProfileAuditLogUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProfileAuditLogCreateOrConnectWithoutProfileInput | ProfileAuditLogCreateOrConnectWithoutProfileInput[]
    upsert?: ProfileAuditLogUpsertWithWhereUniqueWithoutProfileInput | ProfileAuditLogUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProfileAuditLogCreateManyProfileInputEnvelope
    set?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    disconnect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    delete?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    connect?: ProfileAuditLogWhereUniqueInput | ProfileAuditLogWhereUniqueInput[]
    update?: ProfileAuditLogUpdateWithWhereUniqueWithoutProfileInput | ProfileAuditLogUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProfileAuditLogUpdateManyWithWhereWithoutProfileInput | ProfileAuditLogUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProfileAuditLogScalarWhereInput | ProfileAuditLogScalarWhereInput[]
  }

  export type UserProfileCreateNestedOneWithoutVerificationsInput = {
    create?: XOR<UserProfileCreateWithoutVerificationsInput, UserProfileUncheckedCreateWithoutVerificationsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutVerificationsInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserProfileUpdateOneRequiredWithoutVerificationsNestedInput = {
    create?: XOR<UserProfileCreateWithoutVerificationsInput, UserProfileUncheckedCreateWithoutVerificationsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutVerificationsInput
    upsert?: UserProfileUpsertWithoutVerificationsInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutVerificationsInput, UserProfileUpdateWithoutVerificationsInput>, UserProfileUncheckedUpdateWithoutVerificationsInput>
  }

  export type UserProfileCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<UserProfileCreateWithoutDocumentsInput, UserProfileUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutDocumentsInput
    connect?: UserProfileWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserProfileUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<UserProfileCreateWithoutDocumentsInput, UserProfileUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutDocumentsInput
    upsert?: UserProfileUpsertWithoutDocumentsInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutDocumentsInput, UserProfileUpdateWithoutDocumentsInput>, UserProfileUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserProfileCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserProfileCreateWithoutAuditLogsInput, UserProfileUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutAuditLogsInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserProfileUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<UserProfileCreateWithoutAuditLogsInput, UserProfileUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutAuditLogsInput
    upsert?: UserProfileUpsertWithoutAuditLogsInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutAuditLogsInput, UserProfileUpdateWithoutAuditLogsInput>, UserProfileUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserProfileCreateNestedOneWithoutLocationsInput = {
    create?: XOR<UserProfileCreateWithoutLocationsInput, UserProfileUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutLocationsInput
    connect?: UserProfileWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserProfileUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<UserProfileCreateWithoutLocationsInput, UserProfileUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutLocationsInput
    upsert?: UserProfileUpsertWithoutLocationsInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutLocationsInput, UserProfileUpdateWithoutLocationsInput>, UserProfileUncheckedUpdateWithoutLocationsInput>
  }

  export type UserProfileCreateNestedOneWithoutEducationInput = {
    create?: XOR<UserProfileCreateWithoutEducationInput, UserProfileUncheckedCreateWithoutEducationInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutEducationInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserProfileUpdateOneRequiredWithoutEducationNestedInput = {
    create?: XOR<UserProfileCreateWithoutEducationInput, UserProfileUncheckedCreateWithoutEducationInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutEducationInput
    upsert?: UserProfileUpsertWithoutEducationInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutEducationInput, UserProfileUpdateWithoutEducationInput>, UserProfileUncheckedUpdateWithoutEducationInput>
  }

  export type UserProfileCreateNestedOneWithoutWorkHistoryInput = {
    create?: XOR<UserProfileCreateWithoutWorkHistoryInput, UserProfileUncheckedCreateWithoutWorkHistoryInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutWorkHistoryInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserProfileUpdateOneRequiredWithoutWorkHistoryNestedInput = {
    create?: XOR<UserProfileCreateWithoutWorkHistoryInput, UserProfileUncheckedCreateWithoutWorkHistoryInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutWorkHistoryInput
    upsert?: UserProfileUpsertWithoutWorkHistoryInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutWorkHistoryInput, UserProfileUpdateWithoutWorkHistoryInput>, UserProfileUncheckedUpdateWithoutWorkHistoryInput>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProfileLocationCreateWithoutProfileInput = {
    id?: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type ProfileLocationUncheckedCreateWithoutProfileInput = {
    id?: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type ProfileLocationCreateOrConnectWithoutProfileInput = {
    where: ProfileLocationWhereUniqueInput
    create: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput>
  }

  export type ProfileLocationCreateManyProfileInputEnvelope = {
    data: ProfileLocationCreateManyProfileInput | ProfileLocationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type EducationRecordCreateWithoutProfileInput = {
    id?: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUncheckedCreateWithoutProfileInput = {
    id?: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordCreateOrConnectWithoutProfileInput = {
    where: EducationRecordWhereUniqueInput
    create: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput>
  }

  export type EducationRecordCreateManyProfileInputEnvelope = {
    data: EducationRecordCreateManyProfileInput | EducationRecordCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type WorkRecordCreateWithoutProfileInput = {
    id?: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUncheckedCreateWithoutProfileInput = {
    id?: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordCreateOrConnectWithoutProfileInput = {
    where: WorkRecordWhereUniqueInput
    create: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput>
  }

  export type WorkRecordCreateManyProfileInputEnvelope = {
    data: WorkRecordCreateManyProfileInput | WorkRecordCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileVerificationCreateWithoutProfileInput = {
    id?: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileVerificationUncheckedCreateWithoutProfileInput = {
    id?: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileVerificationCreateOrConnectWithoutProfileInput = {
    where: ProfileVerificationWhereUniqueInput
    create: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput>
  }

  export type ProfileVerificationCreateManyProfileInputEnvelope = {
    data: ProfileVerificationCreateManyProfileInput | ProfileVerificationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileDocumentCreateWithoutProfileInput = {
    id?: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
  }

  export type ProfileDocumentUncheckedCreateWithoutProfileInput = {
    id?: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
  }

  export type ProfileDocumentCreateOrConnectWithoutProfileInput = {
    where: ProfileDocumentWhereUniqueInput
    create: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput>
  }

  export type ProfileDocumentCreateManyProfileInputEnvelope = {
    data: ProfileDocumentCreateManyProfileInput | ProfileDocumentCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileAuditLogCreateWithoutProfileInput = {
    id?: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ProfileAuditLogUncheckedCreateWithoutProfileInput = {
    id?: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ProfileAuditLogCreateOrConnectWithoutProfileInput = {
    where: ProfileAuditLogWhereUniqueInput
    create: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput>
  }

  export type ProfileAuditLogCreateManyProfileInputEnvelope = {
    data: ProfileAuditLogCreateManyProfileInput | ProfileAuditLogCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileLocationUpsertWithWhereUniqueWithoutProfileInput = {
    where: ProfileLocationWhereUniqueInput
    update: XOR<ProfileLocationUpdateWithoutProfileInput, ProfileLocationUncheckedUpdateWithoutProfileInput>
    create: XOR<ProfileLocationCreateWithoutProfileInput, ProfileLocationUncheckedCreateWithoutProfileInput>
  }

  export type ProfileLocationUpdateWithWhereUniqueWithoutProfileInput = {
    where: ProfileLocationWhereUniqueInput
    data: XOR<ProfileLocationUpdateWithoutProfileInput, ProfileLocationUncheckedUpdateWithoutProfileInput>
  }

  export type ProfileLocationUpdateManyWithWhereWithoutProfileInput = {
    where: ProfileLocationScalarWhereInput
    data: XOR<ProfileLocationUpdateManyMutationInput, ProfileLocationUncheckedUpdateManyWithoutProfileInput>
  }

  export type ProfileLocationScalarWhereInput = {
    AND?: ProfileLocationScalarWhereInput | ProfileLocationScalarWhereInput[]
    OR?: ProfileLocationScalarWhereInput[]
    NOT?: ProfileLocationScalarWhereInput | ProfileLocationScalarWhereInput[]
    id?: StringFilter<"ProfileLocation"> | string
    profileId?: StringFilter<"ProfileLocation"> | string
    regionId?: StringNullableFilter<"ProfileLocation"> | string | null
    districtId?: StringNullableFilter<"ProfileLocation"> | string | null
    address?: StringNullableFilter<"ProfileLocation"> | string | null
    isPrimary?: BoolFilter<"ProfileLocation"> | boolean
    createdAt?: DateTimeFilter<"ProfileLocation"> | Date | string
  }

  export type EducationRecordUpsertWithWhereUniqueWithoutProfileInput = {
    where: EducationRecordWhereUniqueInput
    update: XOR<EducationRecordUpdateWithoutProfileInput, EducationRecordUncheckedUpdateWithoutProfileInput>
    create: XOR<EducationRecordCreateWithoutProfileInput, EducationRecordUncheckedCreateWithoutProfileInput>
  }

  export type EducationRecordUpdateWithWhereUniqueWithoutProfileInput = {
    where: EducationRecordWhereUniqueInput
    data: XOR<EducationRecordUpdateWithoutProfileInput, EducationRecordUncheckedUpdateWithoutProfileInput>
  }

  export type EducationRecordUpdateManyWithWhereWithoutProfileInput = {
    where: EducationRecordScalarWhereInput
    data: XOR<EducationRecordUpdateManyMutationInput, EducationRecordUncheckedUpdateManyWithoutProfileInput>
  }

  export type EducationRecordScalarWhereInput = {
    AND?: EducationRecordScalarWhereInput | EducationRecordScalarWhereInput[]
    OR?: EducationRecordScalarWhereInput[]
    NOT?: EducationRecordScalarWhereInput | EducationRecordScalarWhereInput[]
    id?: StringFilter<"EducationRecord"> | string
    profileId?: StringFilter<"EducationRecord"> | string
    organizationId?: StringNullableFilter<"EducationRecord"> | string | null
    schoolId?: StringNullableFilter<"EducationRecord"> | string | null
    classId?: StringNullableFilter<"EducationRecord"> | string | null
    level?: StringNullableFilter<"EducationRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"EducationRecord"> | Date | string | null
    metadata?: JsonFilter<"EducationRecord">
  }

  export type WorkRecordUpsertWithWhereUniqueWithoutProfileInput = {
    where: WorkRecordWhereUniqueInput
    update: XOR<WorkRecordUpdateWithoutProfileInput, WorkRecordUncheckedUpdateWithoutProfileInput>
    create: XOR<WorkRecordCreateWithoutProfileInput, WorkRecordUncheckedCreateWithoutProfileInput>
  }

  export type WorkRecordUpdateWithWhereUniqueWithoutProfileInput = {
    where: WorkRecordWhereUniqueInput
    data: XOR<WorkRecordUpdateWithoutProfileInput, WorkRecordUncheckedUpdateWithoutProfileInput>
  }

  export type WorkRecordUpdateManyWithWhereWithoutProfileInput = {
    where: WorkRecordScalarWhereInput
    data: XOR<WorkRecordUpdateManyMutationInput, WorkRecordUncheckedUpdateManyWithoutProfileInput>
  }

  export type WorkRecordScalarWhereInput = {
    AND?: WorkRecordScalarWhereInput | WorkRecordScalarWhereInput[]
    OR?: WorkRecordScalarWhereInput[]
    NOT?: WorkRecordScalarWhereInput | WorkRecordScalarWhereInput[]
    id?: StringFilter<"WorkRecord"> | string
    profileId?: StringFilter<"WorkRecord"> | string
    organizationId?: StringNullableFilter<"WorkRecord"> | string | null
    positionTitle?: StringNullableFilter<"WorkRecord"> | string | null
    startedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"WorkRecord"> | Date | string | null
    metadata?: JsonFilter<"WorkRecord">
  }

  export type ProfileVerificationUpsertWithWhereUniqueWithoutProfileInput = {
    where: ProfileVerificationWhereUniqueInput
    update: XOR<ProfileVerificationUpdateWithoutProfileInput, ProfileVerificationUncheckedUpdateWithoutProfileInput>
    create: XOR<ProfileVerificationCreateWithoutProfileInput, ProfileVerificationUncheckedCreateWithoutProfileInput>
  }

  export type ProfileVerificationUpdateWithWhereUniqueWithoutProfileInput = {
    where: ProfileVerificationWhereUniqueInput
    data: XOR<ProfileVerificationUpdateWithoutProfileInput, ProfileVerificationUncheckedUpdateWithoutProfileInput>
  }

  export type ProfileVerificationUpdateManyWithWhereWithoutProfileInput = {
    where: ProfileVerificationScalarWhereInput
    data: XOR<ProfileVerificationUpdateManyMutationInput, ProfileVerificationUncheckedUpdateManyWithoutProfileInput>
  }

  export type ProfileVerificationScalarWhereInput = {
    AND?: ProfileVerificationScalarWhereInput | ProfileVerificationScalarWhereInput[]
    OR?: ProfileVerificationScalarWhereInput[]
    NOT?: ProfileVerificationScalarWhereInput | ProfileVerificationScalarWhereInput[]
    id?: StringFilter<"ProfileVerification"> | string
    profileId?: StringFilter<"ProfileVerification"> | string
    status?: StringFilter<"ProfileVerification"> | string
    type?: StringFilter<"ProfileVerification"> | string
    rejectedReason?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedBy?: StringNullableFilter<"ProfileVerification"> | string | null
    reviewedAt?: DateTimeNullableFilter<"ProfileVerification"> | Date | string | null
    createdAt?: DateTimeFilter<"ProfileVerification"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileVerification"> | Date | string
  }

  export type ProfileDocumentUpsertWithWhereUniqueWithoutProfileInput = {
    where: ProfileDocumentWhereUniqueInput
    update: XOR<ProfileDocumentUpdateWithoutProfileInput, ProfileDocumentUncheckedUpdateWithoutProfileInput>
    create: XOR<ProfileDocumentCreateWithoutProfileInput, ProfileDocumentUncheckedCreateWithoutProfileInput>
  }

  export type ProfileDocumentUpdateWithWhereUniqueWithoutProfileInput = {
    where: ProfileDocumentWhereUniqueInput
    data: XOR<ProfileDocumentUpdateWithoutProfileInput, ProfileDocumentUncheckedUpdateWithoutProfileInput>
  }

  export type ProfileDocumentUpdateManyWithWhereWithoutProfileInput = {
    where: ProfileDocumentScalarWhereInput
    data: XOR<ProfileDocumentUpdateManyMutationInput, ProfileDocumentUncheckedUpdateManyWithoutProfileInput>
  }

  export type ProfileDocumentScalarWhereInput = {
    AND?: ProfileDocumentScalarWhereInput | ProfileDocumentScalarWhereInput[]
    OR?: ProfileDocumentScalarWhereInput[]
    NOT?: ProfileDocumentScalarWhereInput | ProfileDocumentScalarWhereInput[]
    id?: StringFilter<"ProfileDocument"> | string
    profileId?: StringFilter<"ProfileDocument"> | string
    type?: StringFilter<"ProfileDocument"> | string
    name?: StringFilter<"ProfileDocument"> | string
    storageKey?: StringFilter<"ProfileDocument"> | string
    mimeType?: StringFilter<"ProfileDocument"> | string
    sizeBytes?: IntFilter<"ProfileDocument"> | number
    status?: StringFilter<"ProfileDocument"> | string
    uploadedAt?: DateTimeFilter<"ProfileDocument"> | Date | string
  }

  export type ProfileAuditLogUpsertWithWhereUniqueWithoutProfileInput = {
    where: ProfileAuditLogWhereUniqueInput
    update: XOR<ProfileAuditLogUpdateWithoutProfileInput, ProfileAuditLogUncheckedUpdateWithoutProfileInput>
    create: XOR<ProfileAuditLogCreateWithoutProfileInput, ProfileAuditLogUncheckedCreateWithoutProfileInput>
  }

  export type ProfileAuditLogUpdateWithWhereUniqueWithoutProfileInput = {
    where: ProfileAuditLogWhereUniqueInput
    data: XOR<ProfileAuditLogUpdateWithoutProfileInput, ProfileAuditLogUncheckedUpdateWithoutProfileInput>
  }

  export type ProfileAuditLogUpdateManyWithWhereWithoutProfileInput = {
    where: ProfileAuditLogScalarWhereInput
    data: XOR<ProfileAuditLogUpdateManyMutationInput, ProfileAuditLogUncheckedUpdateManyWithoutProfileInput>
  }

  export type ProfileAuditLogScalarWhereInput = {
    AND?: ProfileAuditLogScalarWhereInput | ProfileAuditLogScalarWhereInput[]
    OR?: ProfileAuditLogScalarWhereInput[]
    NOT?: ProfileAuditLogScalarWhereInput | ProfileAuditLogScalarWhereInput[]
    id?: StringFilter<"ProfileAuditLog"> | string
    profileId?: StringFilter<"ProfileAuditLog"> | string
    userId?: StringFilter<"ProfileAuditLog"> | string
    actorUserId?: StringFilter<"ProfileAuditLog"> | string
    action?: StringFilter<"ProfileAuditLog"> | string
    before?: JsonFilter<"ProfileAuditLog">
    after?: JsonFilter<"ProfileAuditLog">
    ipAddress?: StringNullableFilter<"ProfileAuditLog"> | string | null
    userAgent?: StringNullableFilter<"ProfileAuditLog"> | string | null
    createdAt?: DateTimeFilter<"ProfileAuditLog"> | Date | string
  }

  export type UserProfileCreateWithoutVerificationsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutVerificationsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutVerificationsInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutVerificationsInput, UserProfileUncheckedCreateWithoutVerificationsInput>
  }

  export type UserProfileUpsertWithoutVerificationsInput = {
    update: XOR<UserProfileUpdateWithoutVerificationsInput, UserProfileUncheckedUpdateWithoutVerificationsInput>
    create: XOR<UserProfileCreateWithoutVerificationsInput, UserProfileUncheckedCreateWithoutVerificationsInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutVerificationsInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutVerificationsInput, UserProfileUncheckedUpdateWithoutVerificationsInput>
  }

  export type UserProfileUpdateWithoutVerificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutVerificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateWithoutDocumentsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutDocumentsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutDocumentsInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutDocumentsInput, UserProfileUncheckedCreateWithoutDocumentsInput>
  }

  export type UserProfileUpsertWithoutDocumentsInput = {
    update: XOR<UserProfileUpdateWithoutDocumentsInput, UserProfileUncheckedUpdateWithoutDocumentsInput>
    create: XOR<UserProfileCreateWithoutDocumentsInput, UserProfileUncheckedCreateWithoutDocumentsInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutDocumentsInput, UserProfileUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserProfileUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateWithoutAuditLogsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutAuditLogsInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutAuditLogsInput, UserProfileUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserProfileUpsertWithoutAuditLogsInput = {
    update: XOR<UserProfileUpdateWithoutAuditLogsInput, UserProfileUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserProfileCreateWithoutAuditLogsInput, UserProfileUncheckedCreateWithoutAuditLogsInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutAuditLogsInput, UserProfileUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserProfileUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateWithoutLocationsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutLocationsInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutLocationsInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutLocationsInput, UserProfileUncheckedCreateWithoutLocationsInput>
  }

  export type UserProfileUpsertWithoutLocationsInput = {
    update: XOR<UserProfileUpdateWithoutLocationsInput, UserProfileUncheckedUpdateWithoutLocationsInput>
    create: XOR<UserProfileCreateWithoutLocationsInput, UserProfileUncheckedCreateWithoutLocationsInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutLocationsInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutLocationsInput, UserProfileUncheckedUpdateWithoutLocationsInput>
  }

  export type UserProfileUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateWithoutEducationInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutEducationInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    workHistory?: WorkRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutEducationInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutEducationInput, UserProfileUncheckedCreateWithoutEducationInput>
  }

  export type UserProfileUpsertWithoutEducationInput = {
    update: XOR<UserProfileUpdateWithoutEducationInput, UserProfileUncheckedUpdateWithoutEducationInput>
    create: XOR<UserProfileCreateWithoutEducationInput, UserProfileUncheckedCreateWithoutEducationInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutEducationInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutEducationInput, UserProfileUncheckedUpdateWithoutEducationInput>
  }

  export type UserProfileUpdateWithoutEducationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutEducationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    workHistory?: WorkRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileCreateWithoutWorkHistoryInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationCreateNestedManyWithoutProfileInput
    education?: EducationRecordCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogCreateNestedManyWithoutProfileInput
  }

  export type UserProfileUncheckedCreateWithoutWorkHistoryInput = {
    id?: string
    userId: string
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    phoneNumberVerifiedAt?: Date | string | null
    organisation?: string | null
    birthDate?: Date | string | null
    gender?: string | null
    country?: string | null
    address?: string | null
    preferredLanguage?: string | null
    completionStatus?: string | null
    verifiedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: ProfileLocationUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationRecordUncheckedCreateNestedManyWithoutProfileInput
    verifications?: ProfileVerificationUncheckedCreateNestedManyWithoutProfileInput
    documents?: ProfileDocumentUncheckedCreateNestedManyWithoutProfileInput
    auditLogs?: ProfileAuditLogUncheckedCreateNestedManyWithoutProfileInput
  }

  export type UserProfileCreateOrConnectWithoutWorkHistoryInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutWorkHistoryInput, UserProfileUncheckedCreateWithoutWorkHistoryInput>
  }

  export type UserProfileUpsertWithoutWorkHistoryInput = {
    update: XOR<UserProfileUpdateWithoutWorkHistoryInput, UserProfileUncheckedUpdateWithoutWorkHistoryInput>
    create: XOR<UserProfileCreateWithoutWorkHistoryInput, UserProfileUncheckedCreateWithoutWorkHistoryInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutWorkHistoryInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutWorkHistoryInput, UserProfileUncheckedUpdateWithoutWorkHistoryInput>
  }

  export type UserProfileUpdateWithoutWorkHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUpdateManyWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutWorkHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumberVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organisation?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: ProfileLocationUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationRecordUncheckedUpdateManyWithoutProfileNestedInput
    verifications?: ProfileVerificationUncheckedUpdateManyWithoutProfileNestedInput
    documents?: ProfileDocumentUncheckedUpdateManyWithoutProfileNestedInput
    auditLogs?: ProfileAuditLogUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileLocationCreateManyProfileInput = {
    id?: string
    regionId?: string | null
    districtId?: string | null
    address?: string | null
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type EducationRecordCreateManyProfileInput = {
    id?: string
    organizationId?: string | null
    schoolId?: string | null
    classId?: string | null
    level?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordCreateManyProfileInput = {
    id?: string
    organizationId?: string | null
    positionTitle?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ProfileVerificationCreateManyProfileInput = {
    id?: string
    status: string
    type: string
    rejectedReason?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileDocumentCreateManyProfileInput = {
    id?: string
    type: string
    name: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    status: string
    uploadedAt?: Date | string
  }

  export type ProfileAuditLogCreateManyProfileInput = {
    id?: string
    userId: string
    actorUserId: string
    action: string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ProfileLocationUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileLocationUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileLocationUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    regionId?: NullableStringFieldUpdateOperationsInput | string | null
    districtId?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationRecordUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type EducationRecordUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    schoolId?: NullableStringFieldUpdateOperationsInput | string | null
    classId?: NullableStringFieldUpdateOperationsInput | string | null
    level?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type WorkRecordUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    positionTitle?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ProfileVerificationUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileVerificationUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileVerificationUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileDocumentUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileAuditLogUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: JsonNullValueInput | InputJsonValue
    after?: JsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserProfileCountOutputTypeDefaultArgs instead
     */
    export type UserProfileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserProfileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserProfileDefaultArgs instead
     */
    export type UserProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileVerificationDefaultArgs instead
     */
    export type ProfileVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileVerificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileDocumentDefaultArgs instead
     */
    export type ProfileDocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileDocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileAuditLogDefaultArgs instead
     */
    export type ProfileAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileAuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileLocationDefaultArgs instead
     */
    export type ProfileLocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileLocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EducationRecordDefaultArgs instead
     */
    export type EducationRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EducationRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkRecordDefaultArgs instead
     */
    export type WorkRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkRecordDefaultArgs<ExtArgs>

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