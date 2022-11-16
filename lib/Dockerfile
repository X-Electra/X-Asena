FROM quay.io/sampandey001/secktor
RUN git clone https://github.com/SamPandey001/X-Asena /xasena
WORKDIR /xasena
RUN yarn install --network-concurrency 1
CMD ["node", "bot.js"] 
