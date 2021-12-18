extern crate proc_macro;

#[proc_macro_derive(IdLike)]
pub fn id_like_derive(input: TokenStream) -> TokenStream {}
