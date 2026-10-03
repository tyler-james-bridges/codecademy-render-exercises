# Render deployment exercises — prepared locally

Both course examples are ready for review. Nothing has been published, forked, pushed, or created in Render. `render.yaml` is a proposed configuration only.

## Sources and changes

- `simple/`: [Render Express Hello World](https://github.com/render-examples/express-hello-world), preserving the original page. Added a lockfile, Node version, and configurable local/cloud binding.
- `full-stack/`: [Codecademy activity app](https://github.com/Codecademy-Curriculum/deploying-full-stack-with-render-sample), preserving the React interface. Corrected the unavailable Bored API URL to the [App Brewery random activity API](https://bored-api.appbrewery.com/), rebuilt the UI with react-scripts 5, updated old runtime dependencies, and fixed database errors and clear/save sequencing. Suggestions remain an actual external API request. The provider documents 100 requests per 15 minutes.

`full-stack/schema.sql` defines the required `my_activities(activity TEXT)` table. Startup applies this idempotent schema before accepting requests. Saving “Sounds fun!” uses PostgreSQL; reloading reads the persisted activities and count. Clear Activities waits for deletion. The app is a shared public course demo without accounts; all visitors would share its saved list.

## Run locally

Use Node **24.21.0**, pinned in each `.node-version` and bounded in `package.json`. It is Render’s [current default](https://render.com/docs/node-version) and Node 24 is [LTS](https://nodejs.org/en/about/previous-releases) as checked October 2, 2026.

```sh
cd simple
npm ci
cp .env.example .env
npm start
```

Simple app: http://127.0.0.1:3012.

For the full-stack app, create a dedicated local PostgreSQL database named `render_course`, copy `full-stack/.env.example` to `.env`, and fill in your local credentials. Then:

```sh
cd full-stack
npm ci
npm --prefix client ci
npm run build
npm start
```

Full-stack app: http://127.0.0.1:3013. This session’s private connection file exists only in the temporary runtime copy, not this deliverable. The runtime uses local PostgreSQL 17 on port 55432. No secrets are in source or YAML.

## Proposed Render settings

The root `render.yaml` describes one repository containing both folders. Separate repositories also work: use each folder as its repository root and omit `rootDir` when configuring manually.

| Setting | Simple service | Full-stack service |
| --- | --- | --- |
| Type / runtime | Web Service / Node | Web Service / Node |
| Plan / region | Free / Oregon | Free / Oregon |
| Root directory | `simple` | `full-stack` |
| Build | `npm ci` | `npm ci && npm --prefix client ci && npm run build` |
| Start | `npm start` | `npm start` |
| Bind address | `HOST=0.0.0.0` | `HOST=0.0.0.0` |
| Port | Render-provided `PORT` | Render-provided `PORT` |
| Database | None | `DATABASE_URL` from the new database’s internal URL |
| Automatic deployment | Off | Off |

The proposed database is Free PostgreSQL 17 in Oregon, database name `render_course`, with external connections disabled. The two resources must share a region for the [internal connection URL](https://render.com/docs/postgresql-creating-connecting). The app honors PostgreSQL connection-string SSL settings; local example disables SSL, while Render’s internal private-network connection permits its default. The YAML references the internal URL rather than storing credentials. Schema setup runs at startup, so the first deployment has a connected database and table.

Render’s [Express guide](https://render.com/docs/deploy-node-express-app) supports Node build/start commands, and the [Blueprint specification](https://render.com/docs/blueprint-spec) defines the fields used here.

## Free-tier corrections

As checked October 2, 2026, [Render’s free-tier documentation](https://render.com/docs/free) says:

- Free PostgreSQL expires after **30 days**, with a further **14-day upgrade grace period** before deletion. The course’s 90-day statement is outdated.
- A workspace can have one active Free PostgreSQL database, limited to 1 GB, without backups.
- Free web services sleep after 15 idle minutes and can take about a minute to restart. The workspace shares 750 running hours per month.

Free compute does not guarantee no other charges: Render’s [FAQ](https://render.com/docs/faq) says bandwidth/build overages can be billed if a payment method is present; without one, affected services are disabled instead. No paid upgrade or payment-method addition is included in this proposal.

## Approval still required

The remaining external work is to choose a GitHub destination and publish these source folders (or approve forks), authorize Render access only to the chosen repository/repositories, and create **two public Free web services plus one Free PostgreSQL database** using the reviewed settings. Review any existing Free database before creation. Account creation/sign-in, GitHub app installation or permission changes, public deployment, and any cost remain pending approval. No intentionally broken intermediate deployment is needed.
