export default interface RemoteServer {
	execScript: (script: string) => Promise<string>;
}
