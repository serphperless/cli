# 2. Initialization will happen automatically

Date: 28/10/2017

## Status

Accepted

## Context

Based on its purpose (simplifying as much as possible the deployment of PHP applications) and its complex nature (i.e. 
using [serverless](https://github.com/serverless/serverless) under the hood), our tool require some initialization
steps.

## Decision

The initialization of a project can happen in any command of the CLI tool, if necessary.

## Consequences

For now, I can only foresee great outcomes such as:
- The getting started process is literally just one command
- BC-compatible configuration and initialization is a must
