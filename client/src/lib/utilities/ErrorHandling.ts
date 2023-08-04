class ErrorHandling {
	public static parseError(error: unknown): Error {
		if (error instanceof Error) {
			return error;
		}

		return new Error(String(error));
	}
}

export { ErrorHandling };
