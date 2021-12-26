// firebase binding

pub mod database {

    use js_sys::Object;
    use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

    #[wasm_bindgen]
    extern "C" {

        pub type Database;
        pub type Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub fn new() -> Database;

        #[wasm_bindgen(js_namespace = firebaseDatabase, js_name = ref)]
        pub fn reference(this: &Database) -> Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase, js_name = ref)]
        pub fn reference_with_key(this: &Database, key: &str) -> Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub fn child(this: &Reference, key: &str) -> Reference;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn get(this: &Reference) -> JsValue;

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn update(this: &Reference, values: Object);

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub fn val(this: &JsValue) -> JsValue;
    }
}
