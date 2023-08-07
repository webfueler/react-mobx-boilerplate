import React from "react";
import type { ICartStore } from "../../lib/stores/CartStore";
import { withModule } from "../../../../common/src/container/WithModule";
import { identifiers } from "../../container/constants";

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
