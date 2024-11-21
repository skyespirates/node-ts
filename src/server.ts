import express, { Request, Response, NextFunction } from "express";
import logger from "./utils/logger";

const app = express();
const port = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  res.on("finish", () => {
    logger.info(`${req.method} ${res.statusCode} ${req.url}`);
  });
  next();
});
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  const data = {
    message: "Hello, world!",
  };
  res.json(data);
});

app.get("/api/items", (req: Request, res: Response) => {
  const data = [
    { id: 1, name: "item1" },
    { id: 2, name: "item2" },
    { id: 3, name: "item3" },
  ];
  res.json(data);
});

app.post("/api/items", (req: Request, res: Response) => {
  const newItem = req.body.item;
  res.status(201).json({ message: "Item created", item: newItem });
});

// Middleware to log errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
