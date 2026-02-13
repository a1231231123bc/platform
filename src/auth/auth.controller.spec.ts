import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call service.register with dto', async () => {
      const dto = { email: 'test@test.com', password: '123456', name: 'Test' };
      const expected = { id: 'uuid-1', email: 'test@test.com', name: 'Test' };
      (service.register as jest.Mock).mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('login', () => {
    it('should return user from request', () => {
      const user = { id: 'uuid-1', email: 'test@test.com', name: 'Test' };
      const req = { user } as any;

      const result = controller.login(req);

      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should call req.logOut', () => {
      const logOut = jest.fn((cb) => cb(null));
      const req = { logOut } as any;

      const result = controller.logout(req);

      expect(logOut).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logged out' });
    });
  });

  describe('me', () => {
    it('should return user from request', () => {
      const user = { id: 'uuid-1', email: 'test@test.com', name: 'Test' };
      const req = { user } as any;

      const result = controller.me(req);

      expect(result).toEqual(user);
    });
  });
});
