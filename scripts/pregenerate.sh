#!/usr/bin/env bash

# Write out repo metadata
node ./scripts/write-repo-metadata > content/repo-metadata.json

# Fetch EVM networks metadata
node ./scripts/write-networks-metadata > content/networks-metadata.json