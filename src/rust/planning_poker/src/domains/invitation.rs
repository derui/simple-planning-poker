use super::game::GameId;

#[cfg(test)]
mod tests;

#[derive(PartialEq)]
pub struct InvitationSignature(String);

#[derive(PartialEq)]
pub struct Invitation {
    game_id: GameId,
    signature: InvitationSignature,
}

impl InvitationSignature {
    pub fn new(game_id: GameId) -> Self {
        let hash = sha256::digest(game_id.to_string());
        InvitationSignature(hash)
    }
}

impl ToString for InvitationSignature {
    fn to_string(&self) -> String {
        self.0.to_string()
    }
}

impl Invitation {
    pub fn new(game_id: GameId) -> Self {
        let signature = InvitationSignature::new(game_id);
        Self { game_id, signature }
    }

    pub fn game_id(&self) -> &GameId {
        &self.game_id
    }

    pub fn signature(&self) -> &InvitationSignature {
        &self.signature
    }
}
