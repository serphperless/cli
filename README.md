# Serphperless CLI

_Functions_ (FaaS, Functions-as-a-service) are the future of rapid prototype deployment. 
This open-source command line tool, based on the [Serverless framework](https://serverless.com), helps you to deploy your Symfony application within seconds.

[Watch a demo](https://youtu.be/oX7nJW3WfwE)

- [Installation](#installation)
- [Usage](#usage)

## Installation

#### 1. Install the CLI tool.

```
npm install -g serphperless
```

#### 2. Configure your credentials

For now, serphperless only supports OpenWhisk as a target. OpenWhisk is an open-source, multi-language, scallable function platform, backed by the Apache fundation. You can install OpenWhisk on your infrastructure but **we definitely recommend IBM Cloud Functions** that is a managed OpenWhisk. You don't even need a credit card to use up to 400,000 GB-seconds for free every month.

1. Sign up for your free account on IBM Cloud
2. [Install IBM Cloud command line tool](https://console.bluemix.net/docs/cli/reference/bluemix_cli/download_cli.html#installers)
3. Authenticate against IBM Cloud with IBM's command line tool, using the [documentation example](https://console.bluemix.net/openwhisk/learn/cli).
```
bluemix login -a api.eu-gb.bluemix.net -o [organisation-name] -s [your-space-name]
```

5. Install IBM's cloud functions 
```
bluemix plugin install cloud-functions
```
4. Export the following environment variables with the corresponding values from [IBM Cloud Functions' dashboard](https://console.bluemix.net/openwhisk/learn/cli) (click on "Looking for the wsk CLI?" to get these details from the `wsk property set ...` example):
```
export OW_APIHOST=openwhisk.eu-gb.bluemix.net
export OW_AUTH=37bc78ae-[...]

# From the field `IAMToken` of your `~/.bluemix/config.json` file
export OW_APIGW_ACCESS_TOKEN=ey[...]
```

## Usage

Within your application folder, run the following command:

```
serphperless deploy
```

**It doesn't work?** Add the `--debug` flag to see the underlying magic and much more details.

## How it works

In the given order, serphperless will:
1. Ensure the [Serverless framework](https://github.com/serverless/serverless) is installed in your project.
2. Create the Symfony configuration for Serverless if it do not exists
3. Run the deployment with the Serverless framework


