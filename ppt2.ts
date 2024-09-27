import { log } from './log.ts';

{
  /** Currying 이란..? */
  function curry(fn) {
    return function curried(...params) {
      if (fn.length === params.length) {
        return fn(...params);
      }

      return curried.bind(this, ...params);
    };
  }

  const add = (a: number, b: number) => a + b;

  const curriedAdd = curry(add);

  const addFive = curriedAdd(5);

  log(curriedAdd(2, 3)); // 5
  log(curriedAdd(2)(4)); // 6
  log(addFive(3)); // 8
}

{
  /**
   * Level.1 Curring
   * 인자가 2개인 케이스
   */

  const add = (a: number, b: number) => a + b;

  try {
    const curry = (() => {}) as any;

    /**
     * 기대하는 타입 값
     * `((a, b) => a + b) & ((a) => (b) => a + b)`
     */
    const curried = curry(add);

    const addFive = curried(5); // (b: number) => a + b
    const eight = curried(5, 3); // number
  } catch (_) {}

  type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;

  type Curried<P extends any[], R> = P extends [infer Head, ...infer Rest]
    ? HasTail<P> extends true
      ? ((a: Head, ...b: Rest) => R) & ((a: Head) => Curried<Rest, R>)
      : (a: Head) => R // head 하나만 넘어옴
    : never;

  type AnyFn = (...params: any[]) => any;
  type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

  try {
    function curry<T extends AnyFn>(fn: T): Curry<T>;
    function curry() {}

    /**
     * 기대하는 타입 값
     * `((a, b) => a + b) & ((a) => (b) => a + b)`
     */
    const curried = curry(add);

    const addFive = curried(5); // (b: number) => a + b
    const eight = curried(5, 3); // number
  } catch (_) {}
}

/**
 * Level.2 Curring
 * 인자가 3개 이상인 케이스
 */

{
  type AnyFn = (...params: any[]) => any;
  type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

  try {
    const curry = (() => {}) as any;

    const foo = (a: number, b: string, c: boolean) => true;

    /**
     * 기대하는 타입값
     * (
     *   (a: number) => (
     *     (b: string) => (c: boolean) => boolean) &
     *     ((b: string, c: boolean) => boolean)
     *   )
     * ) &
     * ((a: number, b: string) => (c: boolean) => boolean) &
     * ((a: number, b: string, c: boolean) => boolean)
     */
    const curriedFoo = curry(foo);

    /**
     * (c: boolean) => boolean
     */
    const a = curriedFoo(3, 'knowre');

    /**
     * true
     */
    const b = curriedFoo(3, 'knowre', false); // true

    /**
     *  ((b: string) => (c: boolean) => boolean) &
     *  ((b: string, c: boolean) => boolean)
     */
    const c = curriedFoo(3);
  } catch (_) {}

  {
    type Curried<
      P extends any[],
      R,
      PrevParams extends any[] = [] // 모든 params를 저장하기위해서 앞전에 커링된 인자를 보관하기 위한 값
    > = P extends [infer Head, ...infer Tail]
      ? HasTail<P> extends true
        ? ((...params: [...PrevParams, Head]) => Curried<Tail, R>) & // 커링된 함수를 리턴.
            Curried<Tail, R, [...PrevParams, Head]> // 커링 없이 실행한 함수 리턴
        : (...params: [...PrevParams, Head]) => R // Arg가 1개 남았을 경우 모든 Prams를 넣어서 실행하는 함수
      : never;

    type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;

    type TestA = Curried<[1, 2], true>;
    type TestB = Curried<[2], true, [1]>;

		// ---
    function curry<T extends AnyFn>(fn: T): Curry<T>;
    function curry(fn) {
      return function curried(...params) {
        if (fn.length === params.length) {
          return fn(...params);
        }

        return curried.bind(this, ...params);
      };
    }

    const foo = (a: number, b: string, c: boolean) => true;

    /**
     * 기대하는 타입값
     * (
     *   (a: number) => (
     *     (b: string) => (c: boolean) => boolean) &
     *     ((b: string, c: boolean) => boolean)
     *   )
     * ) &
     * ((a: number, b: string) => (c: boolean) => boolean) &
     * ((a: number, b: string, c: boolean) => boolean)
     */
    const curriedFoo = curry(foo);

    /**
     * (c: boolean) => boolean
     */
    const a = curriedFoo(3, 'knowre');
		log(a)

    /**
     * true
     */
    const b = curriedFoo(3, 'knowre', false); // true
		log(b)

    /**
     *  ((b: string) => (c: boolean) => boolean) &
     *  ((b: string, c: boolean) => boolean)
     */
    const c = curriedFoo(3);

		log(c)
		log(c('knowre')(false))
		// log(c('knowre')('type error!'))
		// curriedFoo('type error!')
  }
}
