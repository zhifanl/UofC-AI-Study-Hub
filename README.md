# UofC-Study-Hub 🤖

Welcome to `UofC Study Hub 🤖`! This README.md file provides you with instructions on how to set up, run, and access the application, how this app is deployed, as well as an overview of the project's design.

## URL to application

[UofC Study Hub 🤖](https://uofc-study-hub.vercel.app/)

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  
- [Application URL](#application-url)
- [Design of the Project](#design-of-the-project)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow the instructions below to set up and run the application on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= v18.0.0)
- [npm](https://www.npmjs.com/) (>= v6.0.0)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/zhifanl/UofC-Study-Hub.git
```

### Running the Application

1. Installation & Run the application:

How to run it locally:

run

```bash
cd frontend
npm install
npm start
```

run

```bash
cd backend
npm install
npm start
```

## Application URL

[UofC Study Hub Frontend 🤖](https://uofc-study-hub.vercel.app/)

[UofC Study Hub Backend 🤖](https://uofc-study-hub-backend-dev.us-west-2.elasticbeanstalk.com/)


## Design of the Project

1. Data privacy: Data is kept private by encrypting sensitive user information
2. Ease of use: The application is very easy to use, with an intuitive GUI and helpful text prompts throughout the application. The app requires minimal training, so anyone can use it.
3. Aesthetic: GUI interface was designed using Material UI, which is a library used by facebook, specific to the React frontend framework. This allowed for components with similar elements throughout the application
4. Accessibility: our application can be accessed from anywhere in the world, with minimal downtime. This is possible since we are hosting our database and server on the cloud.
5. User authentication: Only authenticated users can access this application


## Deployment

1. Frontend is deployed on Vercel.
    ### Deploying Frontend to Vercel
    
        To deploy a GitHub repository to Vercel, first, connect GitHub account to your Vercel account. Then, select the repository you wish to deploy from the Vercel dashboard. Vercel automatically detects the framework and builds your project. Finally, your application is deployed, and Vercel provides a URL to access it. Vercel also has a automated CI/CD pipeline so every change on the branch it is watching will trigger the Vercel to build your project and deploy the updated version.
2. Backend Server is deployed on AWS ElasticBeanStalk with the ability to scale up to handler heavy network traffic.

    ### Initialize  Elastic Beanstalk Application

    1. Navigate to backend:

        ```bash
        cd path/to/your/project

        eb init -p [platform] [application-name]
        ```

        - Replace [platform] with your application's platform (e.g., node.js, python) and [application-name] with the name of your application.

    2. Create an Environment and Deploy
        Create a new environment and deploy your application:

        ```bash
        eb create [environment-name]
        ```

        - Replace [environment-name] with a name for your environment.
    3. Configure Environment Variables

        Set environment variables:

        ```bash
        eb setenv VAR_NAME=value ANOTHER_VAR=another_value
        ```

    4. Deploying Application Updates

        ```bash
        eb deploy
        ```

    5. Open and Monitor Your Application
        eb open
        For monitoring, use:
        eb status
        eb health
        Step 6: Cleaning Up
        To terminate your environment and clean up resources:
        eb terminate [environment-name]
        To view logs:
        eb logs
        For more detailed information on a specific command, use the --help flag, like eb create --help.


### Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

[MIT](https://choosealicense.com/licenses/mit/)
