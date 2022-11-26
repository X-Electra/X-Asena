FROM node:latest
ENV TZ=Asia/Kolkata
RUN npm install supervisor -g
RUN apt -y update && apt -y upgrade && apt -y install ffmpeg git imagemagick python graphicsmagick sudo npm yarn curl && curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && apt -y update && apt -y install yarn && apt autoremove -y && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=noninteractive
CMD ["bash"]
