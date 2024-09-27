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

type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type Case<A extends true> = A;
