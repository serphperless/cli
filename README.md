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
2. Authenticate against IBM Cloud with IBM's `wsk` command line tool
```
wsk bluemix login
```
3. Export the following environment variables (the values should be generated in the `.wskprops` file)
```
export OW_APIHOST=openwhisk.eu-gb.bluemix.net
export OW_AUTH=37bc78ae-[...]

export APIGW_ACCESS_TOKEN=ey[...]
```

## Usage

Within your application folder, run the following command:

```
serphperless deploy
```

## How it works


