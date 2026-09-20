interface IUniformUpload {
    method: NonNullable<IUniformData["method"]>;
    array: Int32Array | Float32Array;
    bits: Uint32Array;
    uploaded: Uint32Array;
}

export interface IUniformData {
    method?: Function;
    array? : Int32Array | Float32Array;
    assign? : number;
    // Program-local snapshot; compare raw bits to preserve signed zero and NaN payloads.
    upload?: IUniformUpload;
}
