/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-array-reduce */
const compose = <FuncType extends (...args: any) => any>(
	...funcs: FuncType[]
) =>
	funcs.reduce(
		(a, b) =>
			(...args: any) =>
				a(b(...args)),
		(arg: any) => arg,
	);

export { compose };
