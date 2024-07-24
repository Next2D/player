export interface ObjectImpl {
    [key: string]: { value: number | ObjectImpl }
}