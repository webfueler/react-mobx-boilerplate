import React, { Children, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HEAD_SELECTOR } from "../constants";

type ClientHeadProps = {
	title: string;
};

const ClientHead = ({ title }: ClientHeadProps): React.ReactNode => {
	const location = useLocation();

	useEffect(() => {
		if (title !== "") document.title = title;
	}, [title, location]);

	return null;
};

export const Head = ({
	children,
}: React.PropsWithChildren): React.ReactNode => {
	// workaround to remove error during server side rendering
	// `title` tag can only have 1 node as child, and `renderToString` creates multiple nodes
	const title: string = useMemo(() => {
		const titleTag = Children.toArray(children).find(
			(child) => React.isValidElement(child) && child.type === "title",
		);

		if (!React.isValidElement(titleTag)) return "";

		return Array.isArray(titleTag.props.children)
			? titleTag.props.children.join("")
			: titleTag.props.children.toString();
	}, [children]);

	const otherTags = useMemo(
		() =>
			Children.toArray(children).filter(
				(child) => React.isValidElement(child) && child.type !== "title",
			),
		[children],
	);

	// early return
	if (__isBrowser__) return <ClientHead title={title} />;

	return (
		<div id={HEAD_SELECTOR}>
			{title && <title>{title}</title>}
			{otherTags}
		</div>
	);
};
