use crate::{
    domains::{
        event::DomainEvent,
        game::{Game, GameRepository, HaveGameRepository},
        id::Id,
        selectable_cards::SelectableCards,
        story_point::StoryPoint,
        user::UserId,
    },
    infrastructures::event::event_dispatcher::HaveEventDispatcher,
    utils::{types::LocalBoxFuture, uuid_factory::HaveUuidFactory},
};

pub trait CreateGameDependency: HaveGameRepository + HaveUuidFactory + HaveEventDispatcher {}

pub enum CreateGameOutput {
    InvalidStoryPoints,
}

pub trait CreateGame {
    fn execute<'a>(
        &'a self,
        name: &'a str,
        created_by: UserId,
        points: &'a [u32],
    ) -> LocalBoxFuture<'a, Result<Game, CreateGameOutput>>;
}

impl<T: CreateGameDependency> CreateGame for T {
    fn execute<'a>(
        &'a self,
        name: &'a str,
        created_by: UserId,
        points: &'a [u32],
    ) -> LocalBoxFuture<'a, Result<Game, CreateGameOutput>> {
        let repository = self.get_game_repository();
        let factory = self.get_uuid_factory();
        let dispatcher = self.get_event_dispatcher();

        let fut = async move {
            let story_points = points
                .iter()
                .map(|v| StoryPoint::new(*v))
                .collect::<Vec<StoryPoint>>();

            if !SelectableCards::is_valid_storypoints(&story_points) {
                return Err(CreateGameOutput::InvalidStoryPoints);
            }

            let cards = SelectableCards::new(&story_points);
            let id = Id::create(factory);
            let player_id = Id::create(factory);

            let game = Game::new(id, name, &[player_id], &cards);
            repository.save(&game).await;
            let event = DomainEvent::new(
                factory,
                crate::domains::event::DomainEventKind::GameCreated {
                    game_id: game.id(),
                    name: game.name().to_owned(),
                    created_game_player_id: player_id,
                    created_user_id: created_by,
                    selectable_cards: cards.clone(),
                },
            );
            dispatcher.dispatch(&event);

            Ok(game)
        };

        Box::pin(fut)
    }
}
