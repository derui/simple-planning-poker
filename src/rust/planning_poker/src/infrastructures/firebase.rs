// firebase binding

pub mod database {

    use js_sys::Map;
    use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

    #[wasm_bindgen]
    extern "C" {

        pub type Database;
        pub type Reference;
        pub type Snapshot;

        #[wasm_bindgen(js_namespace = firebaseDatabase, constructor)]
        pub fn new() -> Database;

        #[wasm_bindgen(js_namespace = firebaseDatabase, js_name = ref)]
        pub fn reference(this: &Database) -> Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase, js_name = ref)]
        pub fn reference_with_key(this: &Database, key: &str) -> Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn get(this: &Reference) -> JsValue;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn update(this: &Reference, values: Map);

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub fn val(this: &JsValue) -> JsValue;
    }
}
