// app.js
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path'
import { errorHandler } from './middlewares/errorHandler.js';
import likesRouter from './routes/Likes.js';
import commentsRouter from './routes/Comments.js';
import postRouter from './routes/Post.js';
import usersRouter from './routes/User.js';
import { notFound } from './middlewares/Notfound.js';
import { logger } from './middlewares/MiddlewareLogger.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
// === Security Headers ===
app.use(
  helmet({
    contentSecurityPolicy: false, // nonaktifkan sementara CSP kalau perlu
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // <-- ini penting
    crossOriginResourcePolicy: false, // <-- biar image gak diblok
  })
);
app.use(logger)
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  methods: ['GET', 'POST','PUT','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(cookieParser());
app.use(compression());
app.use('/assets',express.static(path.join(process.cwd(), "src","assets")));
app.use(express.json());

// Load file YAML
const swaggerDocument = YAML.load('./src/config/swagger.yaml');
// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', usersRouter);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);


app.use(notFound);
app.use(errorHandler);

export default app;


