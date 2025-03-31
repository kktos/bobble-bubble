export type TupleToUnion<T extends unknown[]> = T[number];
/*
	let action : TupleToUnion<[5,9]>;
	menu= 6;
	// error : Type '6' is not assignable to type '5,9'.
*/
