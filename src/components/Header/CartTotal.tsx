import React from "react";
import type { ICartStore } from "../../lib/stores/CartStore";
import { withModule } from "../../container/hoc/WithModule";

type Props = {
	cartStore: ICartStore;
};

const CartTotalComponent = ({ cartStore }: Props): React.ReactElement => (
	<div className="header__total">Cart total: ${cartStore.total.toFixed(2)}</div>
);

const CartTotal = withModule(["cartStore"])(CartTotalComponent);
export { CartTotal };
