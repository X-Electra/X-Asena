FROM quay.io/lyfe00011/md:beta
RUN git clone https://github.com/Neeraj-x0/x-asena.git/xasena
WORKDIR /xasena
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]