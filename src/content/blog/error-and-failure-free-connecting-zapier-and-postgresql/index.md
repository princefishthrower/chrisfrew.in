---
title: Error and Failure Free - Connecting Zapier and PostgreSQL
description: A Five-Step Tutorial as an Antidote to Incorrect Documentation
date: "2020-04-14"
draft: false
starID: 4
tags: zapier,postgresql
---

### A Five-Step Tutorial as an Antidote to Incorrect Documentation

_Or my angry sub-subtitle: ‘Yet again, an issue with documentation...’_

[_This post is mirrored on my Medium account._](https://medium.com/@frewin.christopher/properly-connecting-zapier-and-postgresql-998c998db4d9)

## Google Sheets + PostgreSQL — Nice!

I’m working on an app that currently needs a lot of database maintenance as we are in the data collection and cleaning phase. I had heard about Zapier many times, and even had an account for the longest time, but never had used it. So, when I heard that they have a ‘Zap’ to connect Google Sheets to PostgreSQL, creating and editing rows and writing them to the database, I figured I would give it a try.

However, I was quickly led astray by incomplete and simple wrong Zapier documentation and Stack Overflow answers.

In the end, the correct configuration is five simple steps. I hope these steps can spare you from the pain I experienced, because there aren’t many things that frustrate me more than poor documentation, which just wastes everyone else’s time.

\*\*\*As of April 2020, those were the steps I took to get a working connection, with the newest version of PostgreSQL at the time, 12.2. I assume these steps are basic enough that they are backwards-compatible to the oldest currently supported PostgreSQL version, which is 9.5. (Supported until [February 11, 2021](https://www.postgresql.org/support/versioning/))

## 1. Edit Your postgresql.conf File to Listen on All Addresses

On normal Linux machines, the `postgresql.conf` file should be located at the following location:

`/etc/postgresql/12/main/postgresql.conf`

or, for example, if you have an older version like 9.5:

`/etc/postgresql/9.5/main/postgresql.conf`

You can also find this file path from inside a PostgreSQL command line with:

`SHOW config_file;`

In the `postgresql.conf` file, uncomment the `listen_addresses` line (the first setting in that file) such that it reads:

`listen_addresses = '*'`

This ensures PostgreSQL is listening for connections on all ports.

\*\*\*Note that you have a tool like Uncomplicated Firewall, aka command-line command `ufw` (or any firewall for that matter), you will need to allow connections on port 5432. (With `ufw` for example, that is `ufw allow 5432` ). You can check if your port is open with this handy [Open Port Check Tool](https://www.yougetsignal.com/tools/open-ports/).

## 2. Create Your PostgreSQL User and Grant Permissions

Considering this user would be used by Zapier, I named the PostgreSQL user `zapier` as well. Makes sense right? Note that you do NOT need to create a Linux user for this connection to work. (In the background, Zapier is using `psycopg2` — a [PostgreSQL database adapter for Python](https://www.psycopg.org/docs/), which connects directly via a PostgreSQL URI, skipping the SSH layer entirely)

Note that the specified PostgreSQL command in the [Zapier documentation](https://zapier.com/apps/mysql/help) (which you need to venture all the way to the MySQL portion anyway just to find) does _not_ work! The `'user'@'localhost'` (or whatever host or IP) syntax does not work in PostgreSQL! The correct commands are as follows:

Login in as the `postgres` user (or whatever your root PostgreSQL user is):

`psql -U postgres`

If you haven’t created the user yet, do so now:

```sql
CREATE USER zapier WITH PASSWORD 'somesuperstrongpasswordhere'
```

Connect to the database your target table is in:

```sql
\connect your_database_here
```

Grant the proper permissions to the Zapier user you just created — in my case, user `zapier` :

```sql
GRANT INSERT, UPDATE, SELECT ON your_table_here TO zapier;
```

## 3. Add a Custom Entry to Your pg_hba.conf File

This is where the documentation fails. Zapier simply states:

> For PostgreSQL, you’ll need to configure the server to accept logins from remote IPs (in `pg_hba.conf`), and create a user for Zapier to use.

Ok, great thanks guys. 😞 No help at all.

They of course don’t provide an example. Well, I will!

First off, your `pg_hba.conf` file should be located in the same folder, for version 12 again, as an example:

`/etc/postgresql/12/main/pg_hba.conf`

or for 9.5 as an example:

`/etc/postgresql/9.5/main/pg_hba.conf`

again, you can always get this file directly from a PostgreSQL command-line connection by issuing:

```sql
SHOW hba_file;
```

As we see in the `pg_hba.conf`file, the order of the elements is written in a commented line as such:

`# TYPE DATABASE USER ADDRESS METHOD`

Zapier at least tells us the IP at which it will always access the database from, `54.86.9.50`

If you know the name of the table you want Zapier to access, we can compose the line we need in `pg_hba.conf`. However, there is a critical step here that you need to include. We want _exactly_ this IP and this IP only, so we must at a `/32` to the end of the IP. See the [PostgreSQL pg\_hba.conf documentation](https://www.postgresql.org/docs/9.1/auth-pg-hba-conf.html) under `address` for more details. So our `pg_hba.conf` line appears as follows:

```
# Access for zapier user  
host     your_table_here     zapier     54.86.9.50/32    md5
```

Note here that `host` is literally the word `host`. You only need to modify the table name `your_table_here` , and `zapier` if you’ve defined a different user for Zapier to use.

## 4. Restart your PostgreSQL instance

Issue

`sudo service postgresql restart`

for the changes we made in `postgresql.conf` and `pg_hba.conf` to take effect.

## 5. Fill Out Information in Zapier PostgreSQL Form

Once arriving at the form that Zapier prompts you with for your PostgreSQL information, you should be able to enter all the server information and user credentials, and the connection should work right away! No cryptic error messages.

🍺 Cheers all,

-Chris