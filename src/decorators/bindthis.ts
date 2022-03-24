//Input decorator
export function BindThis(
  _: any,
  _2: string | symbol,
  descriptor: PropertyDescriptor
) {
  //binds "this" to a function
  //submitHandler
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}
export function ProjectInputLogger(logString: string): Function {
  return function (constructor: Function) {};
}
