type MaybePromise<T> = Promise<T> | T

export default interface LocalServer {
	start: () => MaybePromise<void>;
	isStarted: () => MaybePromise<boolean>;
}
