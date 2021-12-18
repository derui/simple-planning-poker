use proc_macro::TokenStream;
use syn;
use quote::quote;

extern crate proc_macro;

#[proc_macro_derive(IdLike)]
pub fn id_like_derive(input: TokenStream) -> TokenStream {

    let ast = syn::parse(input).unwrap();

    impl_id_like_derive(&ast)
}

fn impl_id_like_derive(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl IdLike for #name {
            fn new (uuid_factory: &UuidFactory) -> Self {
                let v = uuid_factory.create();

                Self(Id::new(v))
            }
        }

        impl ToString for #name {
            fn to_string(&self) -> String {
                format!("{}", self.0. to_string())
            }
        }
    };

    gen.into()
}
