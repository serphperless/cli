# 3. Can use serphperless directly in the application folder

Date: 28/10/2017

## Status

Accepted

## Context

At this very moment, it's tricky for us to see the full picture of the various use cases. But we need to get started 
with something; a use case.

## Decision

We will get started with the simplest use-case: I manually create a Symfony application, and `serphperless deploy` need
to be able to do the rest for me.

## Consequences

This forces us to keep it simple for now. A notion of "modules" to be able to have multiple applications using 
cross-resources might appear later but for now, we don't need to.
