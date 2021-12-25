use crate::domains::game::{Game, GameId, GameRepository};
use crate::domains::invitation::InvitationSignature;
use crate::utils::types::LocalBoxFuture;

use super::database::Database;

impl GameRepository for Database {
    fn save(&self, _game: &Game) -> LocalBoxFuture<'static, ()> {
        todo!()
    }

    fn find_by(&self, _id: GameId) -> LocalBoxFuture<'static, Option<Game>> {
        todo!()
    }

    fn find_by_invitation_signature(
        &self,
        _signature: InvitationSignature,
    ) -> LocalBoxFuture<'static, Option<Game>> {
        todo!()
    }
}
