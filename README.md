# GP-rest

cd goodparty
npm i

copy .env.example into .env and fill with personal openai api key, and directly copy the db url found in .env.example

make sure you have docker desktop downloaded and open so we can run local postgres

run:
npm run db:img:create
npm run db:push

(optional for studio view: 'npm run db:studio' then nav to https://local.drizzle.studio)

Once DB is up and running, you can test the endpoints via:
npm run test
