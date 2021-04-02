export interface Loader {
  load(address: string, current: string): [string, () => Promise<string>]
}
