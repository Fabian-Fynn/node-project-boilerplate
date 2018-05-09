import 'babel-polyfill'; // eslint-disable-line
import bodyParser from 'body-parser';
import express from 'express';
import { createServer } from 'http';
import passport from 'passport';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import mapRoutes from 'express-routes-mapper';
import exphbs from 'express-handlebars';
import socketio from 'socket.io';

import config from './config';
import helpers from './views/helpers';
import publicRoutes from './config/public.routes';
import adminRoutes from './config/admin.routes';
import adminPolicy from './policies/admin.policy';
import authPolicy from './policies/auth.policy';
import chatService from './services/chat.service';


var promise = mongoose.connect(config.db);

mongoose.Promise = global.Promise;

const app = express();

app.use(cookieParser());
app.use(passport.initialize());
passport.use('default-policy', authPolicy);
passport.use('admin-policy', adminPolicy);

const server = createServer(app);

chatService(server);

const env = process.env.NODE_ENV || 'production';

const mappedPublicRoutes = mapRoutes(publicRoutes, 'app/controllers/');
const mappedAdminRoutes = mapRoutes(adminRoutes, 'app/controllers/');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', `${__dirname}/views`);
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers,
  partialsDir: `${__dirname}/views/partials`,
  layoutsDir: `${__dirname}/views/layouts`,
}));
app.use(express.static('app/public'));

app.set('view engine', 'handlebars');

app.use('/public', mappedPublicRoutes);
app.use('/admin', passport.authenticate('admin-policy', { session: false }), mappedAdminRoutes);

app.get('/', (req, res, next) => {
  passport.authenticate('default-policy', { session: true }, (err, authenticatedUser) => {
    if (authenticatedUser) {
      if (authenticatedUser.roles[0] === 'provisional') {
        return res.render('index', { page: 'index', env, roles: authenticatedUser.roles });
      }
      return res.render('home', { page: 'home', env, roles: authenticatedUser.roles, userMail: authenticatedUser.local.email, userName: authenticatedUser.name });
    } else {
      return res.render('index', { page: 'index', env });
    }
    return null;
  })(req, res, next);
});



app.use((req, res) => {
  res.status(404);
  res.render('404', { css: 'index', page: '404', env });
});

server.listen(config.port, (err) => {
  if (err) {
    throw new Error(err);
  }

  console.info('There we go ♕');
  console.info(`Gladly listening on http://127.0.0.1:${config.port}`);
});
