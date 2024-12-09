import express, { Request, Response, NextFunction } from 'express';
import logger from './utils/logger';
import jwt from 'jsonwebtoken';
import authRoutes from './routes';

const app = express();
const port = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  res.on('finish', () => {
    logger.info(`${req.method} ${res.statusCode} ${req.url}`);
  });
  next();
});
app.use(express.json());

app.use('/auth', authRoutes);

const secretKey = 'your_secret_key';

// Middleware to verify JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Login route to generate JWT
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  // This is a mock user authentication
  if (username === 'user' && password === 'password') {
    const user = { username };
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

app.get('/', (req: Request, res: Response) => {
  const data = {
    message: 'Hello, world!',
  };
  res.json(data);
});

// Protect the /api/items route with JWT authentication
app.get('/api/items', authenticateJWT, (req: Request, res: Response) => {
  const data = [
    { id: 1, name: 'item1' },
    { id: 2, name: 'item2' },
    { id: 3, name: 'item3' },
  ];
  res.json(data);
});

// Protect the /api/items POST route with JWT authentication
app.post('/api/items', authenticateJWT, (req: Request, res: Response) => {
  const newItem = req.body.item;
  res.status(201).json({ message: 'Item created', item: newItem });
});

// Middleware to log errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
