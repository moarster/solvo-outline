FROM dockerreg.solvo.ru/solvo/reg/node:22-slim AS base

ARG APP_PATH
ARG HTTP_PROXY
ARG CDN_URL
ARG APP_PATH=/opt/outline

ENV PORT=3000
ENV URL=https://outline.solvo.ru

WORKDIR $APP_PATH

COPY ./package.json ./yarn.lock ./
COPY ./patches ./patches

RUN if [ -n "$HTTP_PROXY" ]; then \
    yarn config set https-proxy $HTTP_PROXY -g && \
    yarn config set http-proxy $HTTP_PROXY -g && \
    echo "Acquire::http::Proxy \"$HTTP_PROXY\";" > /etc/apt/apt.conf.d/80_proxy && \
    echo "Acquire::https::Proxy \"$HTTP_PROXY\";" >> /etc/apt/apt.conf.d/80_proxy && \
    echo "Acquire::ftp::Proxy \"$HTTP_PROXY\";" >> /etc/apt/apt.conf.d/80_proxy \
; fi

RUN yarn install --no-optional --network-timeout 1000000 && \
  yarn cache clean

COPY . .

RUN yarn build

RUN rm -rf node_modules

RUN yarn install --production=true --network-timeout 1000000 && \
  yarn cache clean

# ---
FROM dockerreg.solvo.ru/solvo/reg/node:22-slim AS runner

LABEL org.opencontainers.image.source="https://gitlab.solvo.ru/solvo/tool-forks/outline"

ARG APP_PATH=/opt/outline
ENV NODE_ENV=production
ENV FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data

WORKDIR $APP_PATH

COPY --from=base $APP_PATH/build ./build
COPY --from=base $APP_PATH/server ./server
COPY --from=base $APP_PATH/public ./public
COPY --from=base $APP_PATH/.sequelizerc ./.sequelizerc
COPY --from=base $APP_PATH/node_modules ./node_modules
COPY --from=base $APP_PATH/package.json ./package.json

# Install wget to healthcheck the server
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

# Create a non-root user compatible with Debian and BusyBox based images
RUN addgroup --gid 1001 nodejs && \
  adduser --uid 1001 --ingroup nodejs nodejs && \
  chown -R nodejs:nodejs $APP_PATH/build && \
  mkdir -p /var/lib/outline && \
  chown -R nodejs:nodejs /var/lib/outline

RUN mkdir -p "$FILE_STORAGE_LOCAL_ROOT_DIR" && \
  chown -R nodejs:nodejs "$FILE_STORAGE_LOCAL_ROOT_DIR" && \
  chmod 1777 "$FILE_STORAGE_LOCAL_ROOT_DIR"

VOLUME /var/lib/outline/data

USER nodejs

HEALTHCHECK --interval=1m CMD wget -qO- "http://localhost:${PORT:-3000}/_health" | grep -q "OK" || exit 1

EXPOSE 3000
CMD ["yarn", "start"]
