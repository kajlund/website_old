# WebSite kajlund.com

Personal website built using Node.js, Express and Mongoose.

## Running

```bash
npm install
npm start
```

The server by default runs on port 3000. It expects some environment variables that can be provided by adding them to a file called `.env` in the root directory. The following variables are expected:

```bash
NODE_ENV=     # development|production
PORT=         # 3000
SECRET=       # Long random string for seeding session cookie
MONGO_URI=    # URI to your mongodb database
```

## Development

- This project uses EditorConfig to standardize text editor configuration. Visit https://editorconfig.org for details.

- This project uses [ESLint](https://eslint.org/) for code linting and formatting. Read more about how to configure ESLint [here](https://eslint.org/docs/user-guide/configuring).

- The server was implemented using the [Express](https://expressjs.com/) framework

- Database support and ODM provided by [Mongoose](https://mongoosejs.com/)

- Traditional server-side rendering was implemented using [Nunjucks](https://mozilla.github.io/nunjucks/) templating language.

- UI implemented using [Bootstrap 5](https://getbootstrap.com/docs/5.1/) and  [Bootstrap Icons](https://icons.getbootstrap.com/)
- For serv er-side validation I usewd [Validator](https://github.com/validatorjs/validator.js)
- [Academind - NodeJS The complete guide](https://www.udemy.com/course/nodejs-the-complete-guide/l) among other courses inspired to build this site.

### Testing

The project uses Jest for testing. Check it out at [jestjs.io](https://jestjs.io).

To execute the tests run `npm t` or `npx jest`.

