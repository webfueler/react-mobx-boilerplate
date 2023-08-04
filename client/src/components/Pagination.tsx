import React from "react";
import { Link } from "react-router-dom";

type Props = {
	currentPage: number;
};

const Pagination = ({ currentPage }: Props): React.ReactElement => {
	return (
		<div className="pagination">
			{currentPage > 1 && (
				<Link to={`/users/${currentPage - 1}`}>Previous Page</Link>
			)}
			{currentPage}
			<Link to={`/users/${currentPage + 1}`}>Next Page</Link>
		</div>
	);
};

export { Pagination };
