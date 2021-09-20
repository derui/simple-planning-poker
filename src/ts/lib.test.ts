// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!

export const createMockedDispatcher = () => {
  return {
    dispatch: jest.fn(),
  };
};

export const createMockedGameRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
    findByInvitationSignature: jest.fn(),
  };
};

export const createMockedUserRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
  };
};

export const createMockedGamePlayerRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
    findByUserAndGame: jest.fn(),
  };
};

// Avoid error
test("dummy", () => {});
