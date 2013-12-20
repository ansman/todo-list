(Not so) Super Todo list
===

Requirements
---
The only dependencies not managed by PIP is Postgresql.

Per default the database `sudo` on `localhost:5432` using username `sudo` and
password `p4ssw0rd` is used.

If you want to change that simply set the `HEROKU_POSTGRESQL_WHITE_URL` locally
to something else.
Example:
```shell
$ export HEROKU_POSTGRESQL_WHITE_URL="postgresql://foo:bar@localhost:4711/other_database"
```

Running locally
---
```shell
$ pip install -r requirements.txt
$ python server.py
```

Running tests
---
```shell
$ nosetests
```
