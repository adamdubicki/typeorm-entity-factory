/** Helper interface for classes taken as reference */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}
