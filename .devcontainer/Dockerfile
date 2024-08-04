# .devcontainer/Dockerfile

FROM mcr.microsoft.com/devcontainers/typescript-node:dev-18-bookworm

# Install and clean dependencies
RUN apt-get update && apt-get install -y \
      curl \
      git \
      vim \
      && apt-get clean -y && rm -rf /var/lib/apt/lists/*

RUN npm i -g npm@latest

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

RUN groupadd --gid ${USER_GID} ${USERNAME} \
  && useradd --gid ${USER_GID} --uid ${USER_UID} -m ${USERNAME} \
  && apt-get install -y sudo \
  && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
  && chmod 0440 /etc/sudoers.d/${USERNAME}

USER ${USERNAME}
