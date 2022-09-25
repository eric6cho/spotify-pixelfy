# react-node-template

Description:
Barebones file structure of a Node.js server and React app project.

to start node server:
npm start

to start react server:
cd client 
npm start

Notes:

File structure notes:
Below is a description of any notes and notable difference from a standard react/node project.

react-node-template:
 - client: directory containing React app
   - public: directory containing public assets
     - index.html: file containing stylesheet references for google icons and font
   - src: directory containing code for React components
     - components: directory containing code for a sample component
     - scripts: directory containing a utils file
     - styles: directory containing stylesheets for components and general mixins
       - mixins: directory containing a mixins file
         - mixins.scss: file containing scss functions and default styling for the app
       - comp-sample.scss: file containing scss for the sample component
       - main.scss: file containing global style and calls default functions from mixins.scss
     - App.js: file containing the main component of the React app
     - SetupProxy.js: file defining a local proxy to the Node.js server.
 - server: directory containing the Node.js server
   - index,js: file that defines the server and the api routes
     - scripts: directory containing a utils file
 - .env.example: example of .env
 - .gitignore: ignores .env and node_modules directory
 - README.md: project description
 - package.lock.json: created by package.json
 - package.json: contains project info, packages, dependencies, and scripts

Heroku Deployment:
As of Sept 2022,
As long as the Heroku App is connected to the GitHub repository, this configuration can deploy heroku with no extra buildpacks.
Any configs on prod envs will require configuring key/env variables, as seen in the .env.example file.

General:
The template below is created for a project specific readme.
This is just a general readme to explain the template.

# project-title

Description:


Guide:
To start node server:
npm start

To start react server:
cd client
npm start

Notes:
Local server is hosted on http://localhost:8888
Local react app is hosted on http://localhost:3000
