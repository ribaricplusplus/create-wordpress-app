type MaybePromise< T > = Promise< T > | T;

export default interface LocalServer {
	isStarted: () => MaybePromise< boolean >;
	getWpRoot: () => MaybePromise< string >;
	importDatabaseDump: ( dbDumpName: string ) => any;
	searchReplace: ( oldPath: string, newPath: string ) => any;
}
