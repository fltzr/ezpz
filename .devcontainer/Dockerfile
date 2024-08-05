# .devcontainer/Dockerfile

FROM mcr.microsoft.com/devcontainers/typescript-node:dev-18-bookworm

# Install and clean dependencies
RUN apt-get update && apt-get install -y \
      curl \
      git \
      vim \
      && apt-get clean -y && rm -rf /var/lib/apt/lists/*

RUN npm i -g npm@latest

USER ezpz
