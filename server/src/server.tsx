// Server
import express from "express";
import path from "node:path";
import fs from "node:fs";
import webpackDevMiddleWare from "webpack-dev-middleware";
// import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import serverConfig from "../webpack.config";
import { Renderer } from "../../common/src/BootstrapServer";

type ServerOptions = {
	isDevelopment: boolean;
	port: number;
	applicationRenderer: Renderer;
};

const getHeadTags = ({
	manifestFile,
}: {
	manifestFile: string;
}): { scripts: string[]; css: string[] } => {
	const scripts: string[] = [];
	const css: string[] = [];
	let manifest: Record<string, string> = {};

	try {
		const fileContents = fs.readFileSync(manifestFile).toString();
		manifest = JSON.parse(fileContents);
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : String(error));
	}

	for (const file of Object.keys(manifest)) {
		if (file.endsWith(".js")) {
			scripts.push(manifest[file]);
		}
		if (file.endsWith(".css")) {
			css.push(manifest[file]);
		}
	}

	return { scripts, css };
};

const server = ({
	isDevelopment,
	port,
	applicationRenderer,
}: ServerOptions): { serve: () => void } => {
	const { scripts, css } = getHeadTags({
		manifestFile: path.resolve(path.join(__dirname, "../client/manifest.json")),
	});

	const app = express();

	if (isDevelopment) {
		// configure devServer
		const compiler = webpack(serverConfig);
		app.use(webpackDevMiddleWare(compiler));
		// app.use(webpackHotMiddleware(compiler));
	}

	app.use(express.static(path.resolve(path.join(__dirname, "..", "client"))));

	app.get("*", async (req, res) => {
		const { status, html } = await applicationRenderer({
			requestUrl: req.url,
			scripts,
			css,
		});

		res.status(status).send(html);
	});

	const serve = (): void => {
		app
			.listen(port, () => {
				console.log(`Listening on port ${port}`);
			})
			.on("error", (error) => {
				throw error;
			});
	};

	return { serve };
};

export { server };
