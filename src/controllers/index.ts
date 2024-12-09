import { Request, Response } from 'express';

const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // This is a mock user registration
  if (username && password) {
    res.json({ message: 'User registered' });
  } else {
    res.sendStatus(400);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // This is a mock user authentication
  if (username === 'user' && password === 'password') {
    res.json({ message: 'User authenticated' });
  } else {
    res.sendStatus(401);
  }
};

export default { registerUser, loginUser };
