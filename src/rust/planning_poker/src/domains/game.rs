use std::{collections::HashMap, ops::Add, vec};

use domain_macro::DomainId;
use uuid::Uuid;

use super::{
    base::Entity,
    card::Card,
    event::DomainEventKind,
    game_player::GamePlayerId,
    id::{DomainId, Id},
    invitation::Invitation,
    selectable_cards::SelectableCards,
    story_point::StoryPoint,
};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct AveragePoint(f32);

impl AveragePoint {
    fn as_f32(&self) -> f32 {
        self.0
    }
}

#[derive(PartialEq, Debug, DomainId, Clone, Copy)]
pub struct GameId(Id<Uuid>);

#[derive(PartialEq, Debug, Clone)]
struct PlayerHand {
    player: GamePlayerId,
    card: Card,
}

#[derive(PartialEq, Debug, Clone)]
pub struct Game {
    id: GameId,
    name: String,
    _showed_down: bool,
    players: Vec<GamePlayerId>,
    cards: SelectableCards,
    hands: Vec<PlayerHand>,
}

impl Entity<GameId> for Game {
    fn id(&self) -> GameId {
        self.id
    }
}

impl Game {
    pub fn new(
        id: GameId,
        name: String,
        players: &Vec<GamePlayerId>,
        cards: &SelectableCards,
    ) -> Self {
        if players.is_empty() {
            panic!("Least one players need");
        }

        Self {
            id,
            name,
            _showed_down: false,
            players: players.clone(),
            cards: cards.clone(),
            hands: vec![],
        }
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn showed_down(&self) -> bool {
        self._showed_down
    }

    pub fn players(&self) -> &Vec<GamePlayerId> {
        &self.players
    }

    pub fn cards(&self) -> &SelectableCards {
        &self.cards
    }

    pub fn make_invitation(&self) -> Invitation {
        Invitation::new(self.id)
    }

    pub fn can_show_down(&self) -> bool {
        !self.hands.is_empty() && !self._showed_down
    }

    pub fn show_down<F>(&mut self, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
        if !self.can_show_down() {
            return;
        }

        self._showed_down = true;
        receiver(DomainEventKind::GameShowedDown { game_id: self.id })
    }

    pub fn calculate_average(&self) -> Result<AveragePoint, String> {
        if !self.showed_down() {
            return Err(String::from("can not calculate if did not show down yet"));
        }

        let hands = self
            .hands
            .iter()
            .filter_map(|v| v.card.as_story_point())
            .collect::<Vec<StoryPoint>>();

        if hands.len() == 0 {
            return Ok(AveragePoint(0.0));
        }

        let average = hands.iter().fold(0, |accum, v| accum + v.as_u32());
        let average = average as f32 / hands.len() as f32;

        Ok(AveragePoint(average))
    }

    pub fn change_name(&mut self, name: &str) {
        if name.len() == 0 {
            panic!("Can not change name to empty");
        }

        self.name = String::from(name)
    }

    pub fn can_change_name(name: &str) -> bool {
        name.len() > 0
    }

    pub fn next_game<F>(&mut self, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
        if !self.showed_down() {
            return;
        }

        self._showed_down = false;

        receiver(DomainEventKind::NewGameStarted { game_id: self.id })
    }

    pub fn give_player_hand(&mut self, player_id: GamePlayerId, card: &Card) {
        if !self.players.contains(&player_id) {
            panic!("Can not give player");
        }
        if !self.cards.contains(card) {
            panic!("Can not give incorrect card");
        }

        let mut map: HashMap<GamePlayerId, &Card> = HashMap::new();
        self.hands.iter().for_each(|v| {
            map.insert(v.player, &v.card);
        });

        map.insert(player_id, card);
        self.hands = map
            .iter()
            .map(|(k, v)| PlayerHand {
                player: *k,
                card: (*v).clone(),
            })
            .collect();
    }
}
