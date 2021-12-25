use proc_macro::TokenStream;
use quote::quote;
use syn;

extern crate proc_macro;

#[proc_macro_derive(DomainId)]
pub fn domain_id_derive(input: TokenStream) -> TokenStream {
    let ast = syn::parse(input).unwrap();

    impl_domain_id_derive(&ast)
}

fn impl_domain_id_derive(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {

            impl DomainId for #name {
                fn new (uuid: Uuid) -> Self {
                    Self(Id::new(uuid))
                }
            }

            impl ToString for #name {
                fn to_string(&self) -> String {
                    format!("{}", self.0. to_string())
                }
            }

    impl From<String> for #name {
        fn from(v: String) -> Self {
            Self(Id::new(
                Uuid::parse_str(&v).expect("should be parse as UUID"),
            ))
        }
    }

        };

    gen.into()
}
