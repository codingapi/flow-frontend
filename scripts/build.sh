#!/usr/bin/env bash

cd ../
pnpm i
pnpm build
pnpm build:app-pc
pnpm build:app-mobile