//Input decorator
export function BindThis(_, _2, descriptor) {
    //binds "this" to a function
    //submitHandler
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjustedDescriptor;
}
export function ProjectInputLogger(logString) {
    return function (constructor) { };
}
