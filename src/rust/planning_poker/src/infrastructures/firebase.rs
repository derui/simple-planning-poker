use std::{
    mem::MaybeUninit,
    sync::{Arc, Once},
};

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
        pub async fn update(this: &Reference, values: &Object);

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn remove(this: &Reference);

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub async fn set_value(this: &Reference, values: &JsValue);

        #[wasm_bindgen(js_namespace = firebaseDatabase)]
        pub fn val(this: &JsValue) -> JsValue;
    }
}

pub mod auth {
    use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

    #[wasm_bindgen]
    extern "C" {
        pub type Auth;

        #[wasm_bindgen(js_namespace = firebaseAuth, js_name = "create")]
        pub fn new() -> Auth;

        #[wasm_bindgen(js_namespace = firebaseAuth, js_name = "signInWithEmailAndPassword")]
        pub async fn sign_in_with_email_and_password(
            auth: &Auth,
            name: &str,
            password: &str,
        ) -> JsValue;

        #[wasm_bindgen(js_namespace = firebaseAuth, js_name = "createUserWithEmailAndPassword")]
        pub async fn create_user_with_email_and_password(
            auth: &Auth,
            name: &str,
            password: &str,
        ) -> JsValue;

        pub fn signed_in_user_id(cred: &JsValue) -> String;
    }
}

pub struct Auth {
    pub auth: Arc<auth::Auth>,
}

impl Default for Auth {
    fn default() -> Self {
        Self::new()
    }
}

impl Auth {
    pub fn new() -> Self {
        static mut AUTH: MaybeUninit<Auth> = MaybeUninit::uninit();
        static mut ONCE: Once = Once::new();
        unsafe {
            ONCE.call_once(|| {
                let auth = Auth {
                    auth: Arc::new(auth::new()),
                };
                AUTH.write(auth);
            });

            AUTH.assume_init_ref().clone()
        }
    }
}

impl Clone for Auth {
    fn clone(&self) -> Self {
        Self {
            auth: Arc::clone(&self.auth),
        }
    }
}

pub struct Database {
    pub database: Arc<database::Database>,
}

impl Default for Database {
    fn default() -> Self {
        Self::new()
    }
}

impl Database {
    pub fn new() -> Self {
        static mut DATABASE: MaybeUninit<Database> = MaybeUninit::uninit();
        static mut ONCE: Once = Once::new();
        unsafe {
            ONCE.call_once(|| {
                let instance = Database {
                    database: Arc::new(database::new()),
                };

                DATABASE.write(instance);
            });
            DATABASE.assume_init_ref().clone()
        }
    }
}

impl Clone for Database {
    fn clone(&self) -> Self {
        Self {
            database: Arc::clone(&self.database),
        }
    }
}
