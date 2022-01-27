- [Remarks](#remarks)
- [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
    - [All environments](#all-environments)
    - [On Windows](#on-windows)
    - [On Linux](#on-linux)
- [Starting with this template](#starting-with-this-template)
- [Template architecture](#template-architecture)
  - [Angular 10](#angular-10)
    - [Angular services & providers](#angular-services--providers)
    - [Angular components](#angular-components)
    - [Angular Universal (Server-Side-Rendering)](#angular-universal-server-side-rendering)
  - [NodeJS](#nodejs)
    - [Server entry-point (main.ts)](#server-entry-point-maints)
    - [NestJS App Module](#nestjs-app-module)
    - [How the API works](#how-the-api-works)
      - [Working with API params](#working-with-api-params)
    - [Database](#database)
    - [Logging](#logging)
    - [SSL (https support)](#ssl-https-support)
    - [Authentication and roles](#authentication-and-roles)
      - [Social Authentication](#social-authentication)
    - [Environment configurations](#environment-configurations)
      - [Use the configurations](#use-the-configurations)
    - [Testing (Unit Tests\API Tests)](#testing-unit-testsapi-tests)
        - [Test database](#test-database)
        - [Running the tests](#running-the-tests)
  - [Sharing code (models, interfaces, etc)](#sharing-code-models-interfaces-etc)
  - [Form validations](#form-validations)
- [Running on production](#running-on-production)
  - [Running Angular and NodeJS on the same server](#running-angular-and-nodejs-on-the-same-server)
    - [Docker\Docker-Compose](#dockerdocker-compose)
      - [Docker-compose](#docker-compose)
      - [Docker image build](#docker-image-build)
    - [The build script (build.sh)](#the-build-script-buildsh)
  - [Separating client and server](#separating-client-and-server)
    - [Server as standalone](#server-as-standalone)
    - [Angular as standalone](#angular-as-standalone)


# Remarks

> This is the new starter template, which is based on the deprecated ["nodejs-angular-starter"](https://github.com/shy2net/nodejs-angular-starter) which is built on [TS.ed](https://tsed.io/). The reason the old library was deprecated is because NestJS is more documented and popular library, which has very much the same approach as Angular.

> This template is based on the exact same code for Angular, and most of the original template node code was reused and refactored to suit NestJS approach.

> This library still uses the same config approach and database approach as the old one. The reason for this, is that in my opinion, NestJS approach for mongo database and environment configuration makes the development more complicated then it should.

# Introduction

This starter template\boilerplate comes with NodeJS (typescript) and Angular 10. It shares models between Angular
and NodeJS. Both of the NodeJS and and Angular 10 can run on the same webserver as the NodeJS exposes all of the
default routes to Angular and all of the known routes to the api.

Technologies used in this template:

- Angular 10 (with SSR) - including unit tests (based on Jasmine + Karma)
- NodeJS express typescript (with SSL support) based on [NestJS](https://nestjs.com/) - for easier express setup using decorators
- Mocha\Chai for backend testing + API tests
- Environment based configurations
- Mongoose (with basic user model)
- Logging (using [NestJS Logger](https://docs.nestjs.com/techniques/logger))
- Bootstrap v4 and SCSS by default
- [JWT](https://jwt.io/) and token authentication built-in (including user roles)
- Social Authentication (Google and Facebook)
- Form validations using ([class-validator](https://www.npmjs.com/package/class-validator)), shared between server and client
- Docker support based on alpine and node 12


## Prerequisites

In order to start with this template you have to set up the environment you are working on to suit the needs.

### All environments

Because this template uses mongo-db by default, if you want to run it easily out-of-the-box you must install docker,
then run the following command:

```bash
docker-compose up -d db # Loads up an instance of mongo-db locally with root\root (user\pass) and 'admin' database
```

This will create a simple mongo database with a username\password of 'root' and database named 'admin'.
The mongo-db instance will create a volume mounted at: `~/web_mongo` (inside your user home directory)
Optionally, you can connect to your own mongo-db instance by configuring it (read the config section for more).

### On Windows

Make sure to install [git bash](https://git-scm.com/downloads), this allows you to run `bash` commands which are essential for the build process. You can use any other bash for windows, as long as it can run the scripts this template relays on (`./install_all.sh, copy-essentials.sh, build.sh`).

**Make sure to add bash to your system 'PATH'.**

### On Linux

After cloning this repository, make sure to run the following command:
 ```bash
 chmod +x ./scripts/*
 ```

This will give permission to run all required scripts to work with this template.

# Starting with this template

To work with this template **locally (debug mode)**, follow these commands:

    npm i -g @angular/cli # Install angular globally (some scripts depend on ng to be globally installed)
    npm run install:all # Install all dependencies required for both NodeJS and Angular
    npm run start:dev # Run the NodeJS on debug mode
    npm run angular # Run Angular

We don't run the `npm start` command as it is reserved only for the compiled code to run on a production server.

In order to compile and build this template for your **production server** run the following:

    npm run install:all # Install all dependencies required for both NodeJS and Angular
    npm run build # Run the build.sh script to compile and NodeJS and Angular for production
    npm start

These list of commands will install, compile and run the output NodeJS.

# Template architecture

The template comes with a ready to go server and client integration, authentication and basic styling.

## Angular 10

Angular 10 comes with the following features:

- Bootstrap v4 with header and sticky footer.
- Built in SSR bundled with the api server.
- Built in toasty (ngx-toastr) which automatically pops up on HTTP errors obtained from the server API.
- Built in ngx-loading-bar (Youtube styled) when moving between routes.
- Built in auth-guard and authentication, saved on session cookie.
- Built in social authentication (Google and Facebook).
- Build in form validations using class-validator (https://github.com/typestack/class-validator) implemented using the `FormValidatorDirective`.

The code of Angular 10 is stored under the `angular-src` directory.

### Angular services & providers

This template comes with multiple services and proviers which can be used accross the template.

- `ApiService` - This service wraps the access to the server api. It should contain a 'mirror' of the functions that the server has.
- `AuthService` - This service exposes all of the authentication mechanisem and handles all of the login, including login to the api, obtaining the token and saving the token to a cookie for next refresh.
- `AuthGuardService` - An auth guard which used the `AuthService` to guard routes. It also comes with role checking by specifing the `typescript { roles: ['roleName'] }` data for your route.
- `AppHttpInterceptor` - This provider acts as an interceptor for all of the http requests ongoing. It adds the authentication token if provided by the `AuthService` to each request. Then it passes the request to the `RequestsService` to handle.
- `RequestsService` - This service handles all of the requests passing through using the `AppHttpInterceptor`. It shows an error toast if an error had occured in one of the requests.
- `AppService` - Holds information about the current user and app related data.
- `SocialLoginService` - This service is responsible for the whole social authentication (Google and Facebook), it uses `angularx-social-login` module to do so. This service can be found under `social-login` module which initializes all of the providers (which are the 3rd party social sites).

### Angular components

- `AppComponent` - The app component is the bootstrap component of this template. It contain the HTML of the app (such the header, router-oulet and footer). It contains logic to listen to routing changes and showing or hiding the slim loading bar (Youtube styled routing progress bar).

- `HeaderComponent` - The header part of the template. It shows a simple header based on bootstrap which is suitable for mobile as well.
- `FooterComponent` - A simple sticky footer that always appear at the bottom of the page.
- `LoginComponent` - A simple login with username and password which authenticates against the server.
- `UserPageComponent` - A simple page that shows information about the currently logged in user with option of logging out.
- `SocialLoginButton` - A simple container of social login buttons which also performs the social authentication itself.

### Angular Universal (Server-Side-Rendering)

By default this template comes ready with Angular Universal which allows search engines to crawl your website better.
It does this on the NodeJS side after running the `npm run build` command which bundles the angular code and create an angular universal express ready file called `out/src/dist/server.js` which our NodeJS simply imports and initializes in the `src/app.ts` file.

in the `src/misc/angular-mounter.ts` you have these two methods:

```typescript
/**
 * Mounts angular using Server-Side-Rendering (Recommended for SEO)
 */
export function mountAngularSSR(expressApp: express.Application): void {
  // The dist folder of compiled angular
  const DIST_FOLDER = path.join(process.cwd(), 'dist/angular');

  // The compiled server file (angular-src/server.ts) path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ngApp = require(path.join(DIST_FOLDER, 'server/main'));

  // Init the ng-app using SSR
  ngApp.init(expressApp, path.join(DIST_FOLDER, '/browser'));
}

/**
 * Mounts angular as is with no SSR.
 */
export function mountAngular(expressApp: express.Application): void {
  const DIST_FOLDER = path.join(process.cwd(), 'dist/angular/browser');
  // Point static path to Angular 2 distribution
  expressApp.use(express.static(DIST_FOLDER));

  // Deliver the Angular 2 distribution
  expressApp.get('*', function(req, res) {
    res.sendFile(path.join(DIST_FOLDER, 'index.html'));
  });
}
```

By default the mountAngular or mountAngularSSR is called in the init method of `src/main.ts`, in order
to disable or enable SSR, change the related config called `ANGULAR > USE_SSR` into true to enable SSR.

## NodeJS

Comes with built in typescript support and compilation.

It comes with the following features:

- [NestJS](https://nestjs.com/) - Easier express with typescript using decorators
- Authentication (including route-guards and token generation)
- Angular routes support (redirect to index.html of compiled Angular code), this means you can run you Angular app and API on the same container!
- Configuration according to environment (using [config npm package](https://www.npmjs.com/package/config)).
- Logging (using built-in NestJS logger).
- Social Authentication, which basically gets an access token from the client that logged into a service and then creates a user associated with it.
- Unit testing using Mocha\Chai.

The code of NodeJS is stored under the `src` directory.
Output directory of the compiled typescript will be available in the `dist` directory.

### Server entry-point (main.ts)

By default, NestJS creates a file called `src/main.ts`, this file is responsible of initializing the NestJS app.

First, lets take a look at the file:

```typescript
async function bootstrap() {
  // Create the app and allow cors and HTTPS support (if configured)
  const app = await NestFactory.create(AppModule, {
    cors: config.CORS_OPTIONS,
    // Will work only if SSH is configured on the related environment config, if not, normal HTTP will be used
    httpsOptions: getHttpsOptionsFromConfig(),
  });

  // Use '/api' for general prefix
  app.setGlobalPrefix('api');

  // Allow validation and transform of params
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // If we are running on production, mount angular
  if (config.ANGULAR.MOUNT) {
    const expressApp = app
      .getHttpAdapter()
      .getInstance() as express.Application;

    if (config.ANGULAR.USE_SSR) mountAngularSSR(expressApp);
    else mountAngular(expressApp);
  }

  // Start listening
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
```

The following code, does these 4 things:

- Create the Nest app itself, with CORS support and HTTPS support, HTTPS will only work if environment configured 'SSL_CERTIFICATE' config correctly. CORS will use the configurations specified in the environment config called 'CORS_OPTIONS'.
- Set the global prefix to `/api` to allow all requests to be transferred thorough there
- Mount validation pipe, to force forms to be validated using the `class-validator` package, [read about it here](https://docs.nestjs.com/techniques/validation#validation).
- Mount Angular (if required) to deliver the web interface, we will read about it later

After all of this is setup and ready, we can start listening to requests.

### NestJS App Module

The `src/app.module.ts` is the root level module which NestJS uses.

The file looks like this:

```typescript
@Module({
  imports: [
    DatabaseModule.register({ uri: config.DB_URI }),
    AuthModule,
    SocialAuthModule.register({
      socialAuthServices: config.SOCIAL_CREDENTIALS as SocialAuthServices,
    }),
    ConfigManagerModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
```

This module imports the following modules:

- `DatabaseModule` - Responsible of connecting to our mongo based database. It handles the connection on load, and relies on mongoose. This means you can use your mongoose schemas as usual.

- `AuthModule` - Responsible of authenticating requests to endpoints, it is based on `passport-local` and uses `JWT` strategy with the `Bearer` authentication header in order
to authenticate each user.

- `SocialAuthModule` - Responsible of communicating 3rd party oauth-2 providers using passport, for example: `passport-google-token` and `passport-facebook-token`.

- `ConfigManagerModule` - Responsible of managing and loading environment related configurations, and helps injecting the configurations to other services.


### How the API works

I would first recommend you to read the [introduction of NestJS](https://docs.nestjs.com/). As it will explain really the architecture and will help you make your express app easier to write, maintain and faster for development.

We will use the terms 'Module', 'Service' and other NestJS related stuff, so please make sure to
read about them before diving into this README. To sum it up, if you have experience with Angular,
NestJS is basically the same (just for server side).

Within this template, NodeJS comes with 2 working examples of a working api called `test` and `saySomething`,
which can be viewed under `src/controllers/api.controller`.

The way this template is built makes the whole code a-lot more readable, and easier for testing.

api.controller.ts:

```typescript
  @Get('/test') // This tells express to route on /api/test
  test(): TestResponse {
    return { status: 'ok' };
  }
```

When navigating to route: `http://localhost:3000/api/test`, it will return a simple JSON which returns:

```json
{
  "status": "ok"
}
```

You can test this api easily by running the express server:
> npm run start:dev

Now simply access your server in this url:
> [http://localhost:3000/api/test](http://localhost:3000/api/test)

#### Working with API params

Let's review the working example of saySomething:

api.controller.ts:

```typescript
  @Get('/say-something') // Route on /api/say-something
  saySomething(@Query('whatToSay') whatToSay: string): { said: string } { // Setting the @QueryParams decorator tells express to extract the request.query['whatToSay'] into the whatToSay param.
    return { said: whatToSay };
  }
```

Now simple open up your browser to the api url with a 'whatToSay' param:

> [http://localhost:3000/api/say-something?what=Hello](http://localhost:3000/api/say-something?what=Hello)

And you will get this output:

```json
{
  "said": "Hello"
}
```

### Database

This template uses mongo as the database, specifically mongoose as the api for communication with mongo. Currently, It has only one model called UserProfileModel which you can find in the `src/database/models` directory.
You can view the database code at the `src/database` directory, which basically is responsible for the communication to the database. It creates and exposes a NestJS `DatabaseModule`, which is responsible of handling the connection and database models.

In order to configure the database connection string, please review the `Environment configurations` part of this readme.

How do we use it? easy! lets take a look at how the `AuthService` accesses the database
to get a user from an email:

```typescript
  getUserFromDB(
    email: string,
  ): DocumentQuery<IUserProfileDbModel, IUserProfileDbModel, unknown> {
    /*
    Here we are using the normal schemas of mongoose, no magic is happening!
    Because we have already established the connection by importing the DatabaseModule,
    We can simply use the `findOne` method as we are used to on mongoose.
    */
    return UserProfileDbModel.findOne({ email });
  }
```

Let's take a look at the UserProfile schema (`src/database/models/user-profile.db.model.ts`):

```typescript
export const UserProfileSchema = new Schema({
  email: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  roles: [String],
});
```

Remarks: NestJS has it's own mongoose database module, which in my opinion is a lot more "complicated" as you should inject the schemas every-time with a service. I prefer using mongoose the old fashioned way, which led me to design my own database module, this allows using the normal schemas, and makes the usage of the models straight-forward as it should be.

If you still prefer the original mongoose database, you can simply remove this module and use theirs [https://docs.nestjs.com/techniques/mongodb](https://docs.nestjs.com/techniques/mongodb)


### Logging

This template comes ready with [NestJS Logger](https://docs.nestjs.com/techniques/logger). It is recommended to read on how to use the logger on the NestJS website.


### SSL (https support)

This template comes with SSL support right out of the box. The only things you need to configure in your configuration
file is the SSL_CERTIFICATE:

```typescript
  // ...Some code...
  SSL_CERTIFICATE: {
    KEY: string;
    CERT: string;
    CA: string;
  };
  // ...Some code...
```

Let's say we want to configure the production to enable HTTPS, simply open up the `src/config/production.json` file and configure it as followed:

```typescript
{
  // ...Some JSON props...
  "DB_URI": "production-mongo-uri",
  "CLIENT_URL": "http://yourwebsite.com",
  // You must create a certificate in order to enable SSL (you can use https://letsencrypt.org/ for a free certificate)
  "SSL": {
    "CA_PATH": "path/to/chain.pem",
    "PRIVATE_KEY_PATH": "path/to/privkey.pem",
    "CERTIFICATE_PATH": "path/to/cert.pem"
  }
  // ...Some JSON props...
}
```

Now when your server loads up, it will call this method in the `src/misc/utils.ts` file:

```typescript
/**
 * Returns the HTTPS options, if supported by the environment.
 */
export function getHttpsOptionsFromConfig(): HttpsOptions {
  const readFileIfExists = (filePath: string): Buffer => {
    if (filePath) return fs.readFileSync(filePath);
  };

  const sslConfig = config.SSL_CERTIFICATE;

  return (
    // If there are any SSL configurations
    sslConfig &&
    Object.keys(sslConfig).length > 0 && {
      key: readFileIfExists(config.SSL_CERTIFICATE.KEY),
      cert: readFileIfExists(config.SSL_CERTIFICATE.CERT),
      ca: readFileIfExists(config.SSL_CERTIFICATE.CA),
    }
  );
}
```

### Authentication and roles

This template comes prepacked with JWT authentication and associated route-guards to authenticate users.
in the `src/auth` directory you will be able to see how the authentication is implemented.
It is basically based on `passport-local` with `JWT` strategy.

When a login occurs, the user is being authenticated against a hashed password using bcrypt, if the passwords match, a token is being generated containing the user data within.

When accessing guarded routes (using the UserAuthGuard in the `src/auth/user-auth-guard.ts` file), the token will be decrypted and checked to see if it's valid. If so, the request will pass and a `req.user` property will be filled with currently logged on user.

For example, let's take a look at a guarded route, such as the `/api/profile`.

In the `auth.controller.ts` you can see the following code:

```typescript
  @UseGuards(UserAuthGuard)
  @Get('/profile')
  getProfile(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }
```

The `UseGuards(UserAuthGuard)` decorator will check if the user is authorized to login.

Simple isn't it? The token is being delivered in the Authorization header in the format of `Authorization: Bearer ${Token}`.

What about user roles? Each user profile has an array of `roles` which holds strings that contains the roles relevant for the user. For example, if you add the role `admin` to your user you should be able to access the `/api/admin` endpoint as it is guarded using the `UserAuthGuard`.

Let's see how it is implemented.

`src/controllers/api.controller.ts`:

```typescript
  @UseGuards(UserAuthGuard)
  @Roles('admin')
  @Get('/admin')
  admin(): string {
    return `You are an admin!`;
  }
```

#### Social Authentication

The procedure of social authentication takes place in the client side, after the client obtains an access token from the 3rd party (Google, Facebook), that access token
will be delieverd to the `social-login/provider` (replace provider with the 3rd party name), which will create a user from the token provided by accessing that specific
3rd party social network user profile information and map the user data into a data applicable for our website.

The authentication is implemented via the `passport` npm package with packages like `passport-facebook-token` and `passport-google-token`.
If A user with the provided email exists, it is returned with a new access token which is only relevant for our app (just like normal authentication).

Take a look at the `src/social-auth` implementation to see how the access token is being used.

### Environment configurations

This template is using the npm `config` package load configurations. You can read more about it here:
https://www.npmjs.com/package/config

All of the configurations are located at the `src/config` directory. The way it loads the configuration is by first loading the `default.json` files and then load the associated environment configuration (by default `development.json`).

In order to change the environment you must specify the `NODE_ENV` environment variable.

For example, if you run on production specify:
`NODE_ENV = production`.

There is a special configurations for the `test` environment as it starts up a test server on a different
port and different credentials.

#### Use the configurations

You have two options:

1. Simply default import `src/config.ts`, which exports all of the configurations:

```typescript
import config from './config';

console.log(`Hello your databse URI is: ${config.DB_URI});
```

2. You can use the 'NestJS' way by injecting the `ConfigService`:

```typescript
import { ConfigService } from '../config-manager/config.service.ts';

@Injectable()
export class MyDatabseService {
  constructor(private configService: ConfigService) {}

  connect() {
    this.database.connect(configService.getConfig().DB_URI);
  }
}

```


### Testing (Unit Tests\API Tests)

This template comes with Mocha\Chai integrated.

There are tests for all of the following:

- API tests
- Tests for services and guards
- General tests

Each file that has a test has a corresponding `.spec` file with the same name.
For example, for the api tests:

`/src/controllers/api.controller.spec.ts` - you can find all api tests.


##### Test database

When the unit tests are running, they relay on a database connection, especially
the API tests, as these tests write mock data to the database before running the tests.

In order to solve this, the `DatabaseTestService` was created which uses the `mongodb-memory-server`
to create the connection for each test suite.

This basically allows all of the tests to run in parallel without opening a real database.

##### Running the tests

In order to run the backend tests, simply enter the following command:

```bash
npm test
```

All configurations will be taken from the `/src/config/test.json` file.

## Sharing code (models, interfaces, etc)

You can use the `shared` directory in order for NodeJS and Angular to share the same code to be used on both sides
without the need of re-writing the models for each.

The already existing models are:

- ActionResponse - a simple response to a user action performed on the api. The server will send this response, and the client will read it.
- UserProfile - a simple user profile model to used for authentication.

## Form validations

This template comes with [class-validator](https://www.npmjs.com/package/class-validator) built in. Which makes it a-lot more easier to write form validations.
As this template shares code between Angular and NodeJS, validations will happen across both platforms.

Let's look at the `UserProfile` model for example:
```typescript
import { UserProfile } from './user-profile';
import { IsEmail, MinLength } from 'class-validator';

export class UserProfileModel implements UserProfile {
  @IsEmail()
  email: string;

  @MinLength(1)
  firstName: string;
  @MinLength(1)
  lastName: string;
  @MinLength(6)
  password: string;

  roles?: string[];
}
```

The decorators you see like `@IsEmail`, `@MinLength` are class-validator decorators and allows us to easily force fields to pass certain validations.

For example, when registering a user validations takes place in this way:
- Angular - checks that all fields are valid using the `FormValidatorDirective`, each field on your form will automatically show if it is valid or invalid
  according to the validation set on it.

  The `FormValidatorDirective` is a directive set on a form which simply checks each input and according to it's name assigns the validations relative to it.
  Take a look at this example:


  `angular-src/src/app/components/register/register.component.html`:

  ```html
    ...
    <form #form="ngForm" class="col-12 form" [appFormValidator]="userProfile" [appFormValidatorForce]="true">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" name="email" [(ngModel)]="userProfile.email" id="email"
                  aria-describedby="helpId" placeholder="mail@gmail.com">
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input type="text" class="form-control" name="password" [(ngModel)]="userProfile.password" id="password"
                  aria-describedby="helpId" placeholder="Password">
              </div>

            </div>
      ...
  ```

  See the `appFormValidator` directive? it associated with the `userProfile` object, which is an instance of `UserProfileModel`. This allows you to easily
  Forces validations on forms and errors to the user.


- NodeJS - on the server side validations are taken place in this way:
  `/src/auth/auth.controller.ts`:

  ```typescript
  @Post('/register')
  register(@Body() registerForm: RegisterForm): Promise<UserProfile> {
    // Hash the user password and create it afterwards
    return registerForm.getHashedPassword().then(hashedPassword => {
      return UserProfileDbModel.create({
        ...registerForm,
        password: hashedPassword,
      });
    });
  }
  ```

  The validation of class-validator will take place automatically using the class-validator, you can read about it here:
  [https://docs.nestjs.com/techniques/validation#validation](https://docs.nestjs.com/techniques/validation#validation).

# Running on production

In order to run this code on production, you must first compile it.
There a few things to take into consideration:

## Running Angular and NodeJS on the same server

This template comes with Angular and NodeJS bundled together and can
be up and running together on the same NodeJS server. This takes place using the `build.sh` bash script
that knows how to compile them together and bundle them.

How does it work? Well it simply compiles each one seperatly and then copies the angular-src output dist directory
into the NodeJS src directory and delievers them in the `src/server.ts` like this:

```typescript
// Point static path to Angular 2 distribution
this.express.use(express.static(path.join(__dirname, 'dist')));

// Deliever the Angular 2 distribution
this.express.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

**Take into consideration that it will not work on debug mode.**

When building your image for production it should contain the following commands:

    npm run build # Call the build.sh script to start the build (it also installs the deps required if they do not exist)

And to run this code simple:

    npm start


### Docker\Docker-Compose

This template comes ready with Dockerfile based on node:12.18.1-alpine3.11 docker image.

It also comes with a ready out of the box docker-compose.yml file which can be used
to start-up the database and the web interface.


#### Docker-compose

You can fire-up the database and the web interface using the following command:

```bash
# This will build web docker image automatically if it does not exist
docker-compose up -d
```



You can also build the web image manually like this:

```bash
docker-compose build web
```

The environment variable for communication using docker-compose is already included in the `.env` file.
This `.env` file contains the DB_URI of the database which the web will be able to to access.


#### Docker image build

In order to build the docker image without docker-compose, you can simply run the following command:

```bash
  docker build -t my-docker-image:0.0.0 .
```

And in order to run your docker on port 8080 simply run the following command:
```bash
docker run -p 8080:3000 -itd my-docker-image:0.0.0
```

Or you can simply use docker compose:

```bash
docker-compose up
```

This will run your container on port 3000.

### The build script (build.sh)

The build script called `build.sh` is a shell script provided with the template which by default will compile the typescript
NodeJS server side and Angular into one. This means when you run the server after the build you will have both on the same
node container.

Make sure to include the `NODE_ENV` environment variable (or else the build will be set to `development` environment) before calling this
script. The build will compile and copy all of the required configurations for the specified environment, and will generate the Angular
code according to that environment.

By default, when building to production, Server Side Rendering (SSR) is set to build as well:

```bash
# TODO: Remove this 'if' statment until the 'fi' if you don't want SSR at all
if [ $ENV == "production" ]; then
    echo "Building Angular app for SSR..."
    ./node_modules/.bin/ng run angular-src:server:production
    check_errcode "Failed to build Angular app for SSR! aborting script!"
else
    echo "Skipping build for SSR as environment is NOT production"
fi
```

You can remove this set of code if you don't want it to take place at all.


## Separating client and server

### Server as standalone

In order to run the server as standalone, simply compile it:

```bash
npm run build:nest
```

The output will be projected into the `dist` directory.

### Angular as standalone

In order to run angular as a standalone, simply compile it:
```bash
npm run build:angular
```

The output will be projected into the `angular-src/dist` directory.
