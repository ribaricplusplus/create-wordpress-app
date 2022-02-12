export default interface RemoteServer {
	isConnected: boolean;

	connect: ( config: any ) => Promise< void >;
	disconnect: () => Promise< void >;

	execScript: (
		script: string,
		options?: ExecScriptOptions
	) => Promise< { output: string; code: number } >;

	download: ( source: string, destination: string ) => Promise< void >;
}

interface ExecScriptOptions {
	logOutput?: boolean;
}
