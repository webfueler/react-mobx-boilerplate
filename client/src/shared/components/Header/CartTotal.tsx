import React from "react";
import { ICartStore } from "../../../cart";
import { identifiers } from "../../../container";
import { withModule } from "../../../../../lib/src/container/WithModule";

type Modules = {
	cartStore: ICartStore;
};

type Props = Modules;

const CartTotalComponent = ({ cartStore }: Props): React.ReactElement => (
	<div className="header__total">Cart total: ${cartStore.total.toFixed(2)}</div>
);

const CartTotal = withModule<Modules>({ cartStore: identifiers.ICartStore })(
	CartTotalComponent,
);
export { CartTotal };
