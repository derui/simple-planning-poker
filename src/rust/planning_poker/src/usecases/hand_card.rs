use crate::{
    domains::{
        card::Card,
        game_player::{GamePlayer, GamePlayerId, GamePlayerRepository, HaveGamePlayerRepository},
        user::UserRepository,
    },
    infrastructures::event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
    utils::types::LocalBoxFuture,
};

pub trait HandCardDependency: HaveGamePlayerRepository + HaveEventDispatcher {}

pub enum HandCardOutput {
    NotFound,
}

pub trait HandCard {
    fn execute(
        &self,
        player_id: GamePlayerId,
        card: &Card,
    ) -> LocalBoxFuture<'_, Result<GamePlayer, HandCardOutput>>;
}

impl<T: HandCardDependency> HandCard for T {
    fn execute(
        &self,
        player_id: GamePlayerId,
        card: &Card,
    ) -> LocalBoxFuture<'_, Result<GamePlayer, HandCardOutput>> {
        let repository = self.get_game_player_repository();
        let dispatcher = self.get_event_dispatcher();
        let card = card.clone();

        let fut = async move {
            let player = repository.find_by(player_id).await;

            match player {
                None => Err(HandCardOutput::NotFound),
                Some(mut player) => {
                    let event = player.take_hand(card);
                    dispatcher.dispatch(&event);

                    repository.save(&player).await;

                    Ok(player)
                }
            }
        };

        Box::pin(fut)
    }
}
