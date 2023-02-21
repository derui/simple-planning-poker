// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!
import * as sinon from "sinon";

export const createMockedDispatcher = () => {
  return {
    dispatch: sinon.fake(),
  };
};

export const createMockedGameRepository = () => {
  return {
    save: sinon.fake(),
    findBy: sinon.fake(),
    findByInvitationSignature: sinon.fake(),
  };
};

export const createMockedUserRepository = () => {
  return {
    save: sinon.fake(),
    findBy: sinon.fake(),
  };
};

export const createMockedGamePlayerRepository = () => {
  return {
    save: sinon.fake(),
    findBy: sinon.fake(),
    findByUserAndGame: sinon.fake(),
    delete: sinon.fake(),
  };
};
