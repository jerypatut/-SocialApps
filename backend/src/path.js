// aliases.ts
import 'module-alias/register';
import { addAliases } from 'module-alias';
import path from 'path';

addAliases({
  '@controllers': path.resolve(__dirname, 'controllers'),
  '@routes': path.resolve(__dirname, 'routes'),
  '@utils': path.resolve(__dirname, 'utils'),
  '@middlewares': path.resolve(__dirname, 'middlewares'),
  '@config': path.resolve(__dirname, 'config'),
  '@models': path.resolve(__dirname, 'models'),
  '@migrations': path.resolve(__dirname, 'migrations'),
  '@helper': path.resolve(__dirname, 'helper'),
  '@errors': path.resolve(__dirname, 'errors'),
  '@services': path.resolve(__dirname, 'services'),
    '@dtos': path.resolve(__dirname, 'dtos'),
  
});
