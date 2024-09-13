namespace _ {
  type AnyFn = (...params: any) => any;
  type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

  type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;

  type Curried<P extends any[], R, PrevParams extends any[] = []> = P extends [
    infer Head,
    ...infer Tail
  ]
    ? HasTail<P> extends true
      ? ((...params: [...PrevParams, Head]) => Curried<Tail, R>) & // 커링된 함수를 리턴.
          Curried<Tail, R, [...PrevParams, Head]> // 커링 없이 실행한 함수 리턴
      : (...params: [...PrevParams, Head]) => R // Arg가 1개 남았을 경우 모든 Prams를 넣어서 실행하는 함수
    : never;

  export function curry<T extends (...params: any[]) => any>(fn: T): Curry<T>;
  export function curry(fn: any) {
    return function curried(...params) {
      if (fn.length === params.length) {
        return fn(...params);
      }

      return curried.bind(null, ...params);
    };
  }
}

namespace Util {
  export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

  export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
    T
  >() => T extends Y ? 1 : 2
    ? true
    : false;

  export type Case<A extends true> = A;
}

namespace 조건문 {
  type User = {
    name: string;
    email: string;
  };

  type IsHasField<T, FieldName extends string> = FieldName extends keyof T
    ? true
    : false;

  type HasEmailField = IsHasField<User, 'email'>; // true
}

namespace 반복문 {
  type IsAllNumber<T extends unknown[]> = T extends [infer First, ...infer Rest]
    ? First extends number
      ? IsAllNumber<Rest>
      : false
    : true;

  type A = IsAllNumber<[1, 2, 3]>; // true
  type B = IsAllNumber<[1, 2, 'knowre']>; // false
}

namespace 유틸타입 {
  type AnyFn = (...params: any) => any;
  // type Parameters<T extends AnyFn> = T extends (...params: infer P) => any
  //   ? P
  //   : never;
  // Parameters<(a: string, b: number) => boolean> // [a: string, b: number]

  type Head<T extends any[]> = T extends [infer First, ...any[]]
    ? First
    : never;

  // type A1 = Head<[1, 2, 3, 4, 5]> // 1

  type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;
  // type A2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]

  type Length<T extends any[]> = T['length'];
  // type A3 = Length<[1, 2, 3, 4, 5]> // 5
}

namespace 단순화하여_생각하기_length_2 {
  const add = (a: number, b: number) => a + b;

  /**
   * ((a, b) => a + b) &
   * ((a) => (b) => a + b)
   */
  const curried = _.curry(add);
  const a = curried(5, 3); // 8

  const addFive = curried(5); // (b) => a + b
  addFive(3); // 8

  type AnyFn = (...params: any[]) => any;

  type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

  type Curried<P extends any[], R> = P extends [infer Head, ...infer Rest]
    ? HasTail<P> extends true
      ? ((a: Head, ...b: Rest) => R) & ((a: Head) => Curried<Rest, R>)
      : (a: Head) => R // head 하나만 넘어옴
    : never;

  type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;

  declare function curry<T extends AnyFn>(fn: T): Curry<T>;

  const curriedAdd = curry(add); // ((a: number, b: number) => number) & ((a: number) => (last: number) => number)
  const five = curriedAdd(2, 3); // number
  const addTwo = curriedAdd(2); // (last: number) => number
}

namespace 본격적인_커리_length_3_이상 {
  type HasTail<T extends any[]> = T extends [] | [any] ? false : true;
  type AnyFn = (...params: any) => any;

  const foo = (a: number, b: string, c: boolean) => true;

  /**
   * (
   *   (params_0: number) => (
   *     (params_0: string) => (params_0: boolean) => boolean) &
   *     ((params_0: string, params_1: boolean) => boolean)
   *   )
   * ) &
   * ((params_0: number, params_1: string) => (params_0: boolean) => boolean) &
   * ((params_0: number, params_1: string, params_2: boolean) => boolean)
   */
  const curriedFoo = _.curry(foo);

  const a = curriedFoo(3, 'knowre'); // (params_0: boolean) => boolean
  const b = curriedFoo(3, 'knowre', false); // true

  /**
   *  ((params_0: string) => (params_0: boolean) => boolean) &
   *  ((params_0: string, params_1: boolean) => boolean)
   */
  const c = curriedFoo(3);

  type Curried<P extends any[], R, PrevParams extends any[] = []> = P extends [
    infer Head,
    ...infer Tail
  ]
    ? HasTail<P> extends true
      ? ((...params: [...PrevParams, Head]) => Curried<Tail, R>) & // 커링된 함수를 리턴.
          Curried<Tail, R, [...PrevParams, Head]> // 커링 없이 실행한 함수 리턴
      : (...params: [...PrevParams, Head]) => R // Arg가 1개 남았을 경우 모든 Prams를 넣어서 실행하는 함수
    : never;

  type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;

  type TestA = Curried<[1 , 2], true>
  type TestB = Curried<[2], true, [1]>
}
