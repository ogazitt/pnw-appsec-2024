# Fixing Broken Access Control
## PNW AppSec Vancouver BC 2024

* [Session URL](https://www.appsecpnw.org/speaker/omri_gazitt/)
* [Deck](https://docs.google.com/presentation/d/1vqPLbC_V0ShQF1XElZ8R9X5SMtpAcQgs/edit?usp=sharing&ouid=109956150494964141602&rtpof=true&sd=true)

## Overview

This monorepo contains three projects:
* a react frontend for a Todo application (./todo-application)
* a node.js backend for the Todo application (./todo-node-js)
* a harness for the Topaz authorizer, which itself includes three different variations of an authorization policy for the Todo backend: `policy-todo-roles`, `policy-todo-groups`, and `policy-todo-rebac`.

## Setting it up

**Requirements:**
* Docker running on your box (e.g. Docker desktop for Mac)
* `brew` (for mac or linux)
* `node` (we tested with v20 but it should work with anything >16)
* `yarn` (we tested with v1.22 but it should work with any v1)

**Steps:**

We'll first install and set up the Topaz authorizer locally, and then build and run the backend and frontend.

### Topaz

1. Install topaz and policy CLIs:

```sh
cd ./topaz

brew tap aserto-dev/tap && brew install topaz
brew tap opcr-io/tap && brew install policy
```

2. Run topaz install (gets the topaz container image):

```sh
make install
```

3. Create three Topaz configurations, one for each policy target:

```sh
make all
```

This command will do the following for each of the policy targets (`todo-roles`, `todo-groups`, `todo-rebac`):
* Build the policy
* Create a Topaz configurations for the policy
* Set the directory manifest
* Load the IDP data (users and groups)
* Run the test suite

The output should look like this:

```sh
make all
==> build-todo-roles

Created new image.
digest: sha256:ed40e022b2e77f121b8b4043c6902b98f2c9ca7a3f8f3a1d04ae307046bc75e0

Tagging image.
reference: ghcr.io/aserto-proj/pnw-appsec:roles
==> configure-todo-roles
>>> stopping topaz "pnw-appsec-groups"...
>>> configure policy
certs directory: /Users/ogazitt/.local/share/topaz/certs

  FILE            ACTION
  gateway.crt     skipped, file already exists
  gateway-ca.crt  skipped, file already exists
  gateway.key     skipped, file already exists
  grpc.crt        skipped, file already exists
  grpc-ca.crt     skipped, file already exists
  grpc.key        skipped, file already exists

A configuration file already exists.
Do you want to continue? (y/N) y
using local policy image: ghcr.io/aserto-proj/pnw-appsec:roles

Using configuration "pnw-appsec-roles"
>>> starting topaz "pnw-appsec-roles"...
fe74a14d5d3eb3c5f1f3da433f23f4565c53cd3702bb67e90ca4756796eea7a1

==> sleep-roles
==> manifest-roles
>>> set manifest to /Users/ogazitt/src/ogazitt/pnw-appsec-2024/topaz/model/manifest.yaml==> data-roles
>>> importing data from ./data
        objects 19
      relations 22
==> test-roles
0001 check            PASS  group:admin#member@user:rick@the-citadel.com [true] (79.982875ms)
0002 check            PASS  group:evil_genius#member@user:rick@the-citadel.com [true] (1.205375ms)
0003 check            PASS  group:editor#member@user:rick@the-citadel.com [true] (976.667µs)
0004 check            PASS  group:viewer#member@user:rick@the-citadel.com [true] (655.791µs)
0005 check            PASS  group:admin#member@user:morty@the-citadel.com [false] (910.25µs)
0006 check            PASS  group:evil_genius#member@user:morty@the-citadel.com [false] (855.375µs)
0007 check            PASS  group:editor#member@user:morty@the-citadel.com [true] (1.233417ms)
0008 check            PASS  group:viewer#member@user:morty@the-citadel.com [true] (715µs)
0009 check            PASS  group:admin#member@user:summer@the-smiths.com [false] (924.333µs)
0010 check            PASS  group:evil_genius#member@user:summer@the-smiths.com [false] (757.458µs)
0011 check            PASS  group:editor#member@user:summer@the-smiths.com [true] (524.166µs)
0012 check            PASS  group:viewer#member@user:summer@the-smiths.com [true] (696.375µs)
0013 check            PASS  group:admin#member@user:beth@the-smiths.com [false] (830.625µs)
0014 check            PASS  group:evil_genius#member@user:beth@the-smiths.com [false] (929.708µs)
0015 check            PASS  group:editor#member@user:beth@the-smiths.com [false] (998.292µs)
0016 check            PASS  group:viewer#member@user:beth@the-smiths.com [true] (689.041µs)
0017 check            PASS  group:admin#member@user:jerry@the-smiths.com [false] (618.959µs)
0018 check            PASS  group:evil_genius#member@user:jerry@the-smiths.com [false] (698.083µs)
0019 check            PASS  group:editor#member@user:jerry@the-smiths.com [false] (638.542µs)
0020 check            PASS  group:viewer#member@user:jerry@the-smiths.com [true] (636µs)
==> build-todo-groups

Created new image.
digest: sha256:cf881d4f62077cdeddc878b40b730ea9be924253f30f972a6cd743256d9861ca

Tagging image.
reference: ghcr.io/aserto-proj/pnw-appsec:groups
==> configure-todo-groups
>>> stopping topaz "pnw-appsec-roles"...
>>> configure policy
certs directory: /Users/ogazitt/.local/share/topaz/certs

  FILE            ACTION
  gateway.crt     skipped, file already exists
  gateway-ca.crt  skipped, file already exists
  gateway.key     skipped, file already exists
  grpc.crt        skipped, file already exists
  grpc-ca.crt     skipped, file already exists
  grpc.key        skipped, file already exists

A configuration file already exists.
Do you want to continue? (y/N) y
using local policy image: ghcr.io/aserto-proj/pnw-appsec:groups

Using configuration "pnw-appsec-groups"
>>> starting topaz "pnw-appsec-groups"...
51edb8298886c284526ddf7481550eec1f8e3299103b40f529259eb8fb27919a

==> sleep-groups
==> manifest-groups
>>> set manifest to /Users/ogazitt/src/ogazitt/pnw-appsec-2024/topaz/model/manifest.yaml==> data-groups
>>> importing data from ./data
        objects 19
      relations 22
==> test-groups
0001 check            PASS  group:admin#member@user:rick@the-citadel.com [true] (65.271125ms)
0002 check            PASS  group:evil_genius#member@user:rick@the-citadel.com [true] (905.041µs)
0003 check            PASS  group:editor#member@user:rick@the-citadel.com [true] (536µs)
0004 check            PASS  group:viewer#member@user:rick@the-citadel.com [true] (430.083µs)
0005 check            PASS  group:admin#member@user:morty@the-citadel.com [false] (450.667µs)
0006 check            PASS  group:evil_genius#member@user:morty@the-citadel.com [false] (604.167µs)
0007 check            PASS  group:editor#member@user:morty@the-citadel.com [true] (550.083µs)
0008 check            PASS  group:viewer#member@user:morty@the-citadel.com [true] (697.083µs)
0009 check            PASS  group:admin#member@user:summer@the-smiths.com [false] (568.291µs)
0010 check            PASS  group:evil_genius#member@user:summer@the-smiths.com [false] (600.375µs)
0011 check            PASS  group:editor#member@user:summer@the-smiths.com [true] (670.333µs)
0012 check            PASS  group:viewer#member@user:summer@the-smiths.com [true] (777.917µs)
0013 check            PASS  group:admin#member@user:beth@the-smiths.com [false] (1.013208ms)
0014 check            PASS  group:evil_genius#member@user:beth@the-smiths.com [false] (697.375µs)
0015 check            PASS  group:editor#member@user:beth@the-smiths.com [false] (800.125µs)
0016 check            PASS  group:viewer#member@user:beth@the-smiths.com [true] (858µs)
0017 check            PASS  group:admin#member@user:jerry@the-smiths.com [false] (538.959µs)
0018 check            PASS  group:evil_genius#member@user:jerry@the-smiths.com [false] (553.667µs)
0019 check            PASS  group:editor#member@user:jerry@the-smiths.com [false] (603.333µs)
0020 check            PASS  group:viewer#member@user:jerry@the-smiths.com [true] (939.334µs)
==> build-todo-rebac

Created new image.
digest: sha256:e7a95c6b7429165ec3d93b94ea6bf53043b45e434849d0e9ee9b4bf507b88f4e

Tagging image.
reference: ghcr.io/aserto-proj/pnw-appsec:rebac
==> configure-todo-rebac
>>> stopping topaz "pnw-appsec-groups"...
>>> configure policy
certs directory: /Users/ogazitt/.local/share/topaz/certs

  FILE            ACTION
  gateway.crt     skipped, file already exists
  gateway-ca.crt  skipped, file already exists
  gateway.key     skipped, file already exists
  grpc.crt        skipped, file already exists
  grpc-ca.crt     skipped, file already exists
  grpc.key        skipped, file already exists

A configuration file already exists.
Do you want to continue? (y/N) y
using local policy image: ghcr.io/aserto-proj/pnw-appsec:rebac

Using configuration "pnw-appsec-rebac"
>>> starting topaz "pnw-appsec-rebac"...
0da48b55acc2aa0b6888d960ded6d0f66bd37b5f84bbf366742063acddf98767

==> sleep-rebac
==> manifest-rebac
>>> set manifest to /Users/ogazitt/src/ogazitt/pnw-appsec-2024/topaz/model/manifest.yaml==> data-rebac
>>> importing data from ./data
        objects 19
      relations 22
==> test-rebac
0001 check            PASS  group:admin#member@user:rick@the-citadel.com [true] (72.977291ms)
0002 check            PASS  group:evil_genius#member@user:rick@the-citadel.com [true] (683.042µs)
0003 check            PASS  group:editor#member@user:rick@the-citadel.com [true] (826.375µs)
0004 check            PASS  group:viewer#member@user:rick@the-citadel.com [true] (1.205792ms)
0005 check            PASS  group:admin#member@user:morty@the-citadel.com [false] (742.917µs)
0006 check            PASS  group:evil_genius#member@user:morty@the-citadel.com [false] (640.916µs)
0007 check            PASS  group:editor#member@user:morty@the-citadel.com [true] (870µs)
0008 check            PASS  group:viewer#member@user:morty@the-citadel.com [true] (614.042µs)
0009 check            PASS  group:admin#member@user:summer@the-smiths.com [false] (739.959µs)
0010 check            PASS  group:evil_genius#member@user:summer@the-smiths.com [false] (589.083µs)
0011 check            PASS  group:editor#member@user:summer@the-smiths.com [true] (944.875µs)
0012 check            PASS  group:viewer#member@user:summer@the-smiths.com [true] (588.875µs)
0013 check            PASS  group:admin#member@user:beth@the-smiths.com [false] (1.187084ms)
0014 check            PASS  group:evil_genius#member@user:beth@the-smiths.com [false] (740.875µs)
0015 check            PASS  group:editor#member@user:beth@the-smiths.com [false] (1.072416ms)
0016 check            PASS  group:viewer#member@user:beth@the-smiths.com [true] (798.375µs)
0017 check            PASS  group:admin#member@user:jerry@the-smiths.com [false] (749.833µs)
0018 check            PASS  group:evil_genius#member@user:jerry@the-smiths.com [false] (655.5µs)
0019 check            PASS  group:editor#member@user:jerry@the-smiths.com [false] (931.292µs)
0020 check            PASS  group:viewer#member@user:jerry@the-smiths.com [true] (765.292µs)
```

4. Bring up the topaz console:

```sh
make console
```

5. To change configurations:

```sh
topaz config list

     NAME               CONFIG FILE
     pnw-appsec-groups  pnw-appsec-groups.yaml
  *  pnw-appsec-rebac   pnw-appsec-rebac.yaml
     pnw-appsec-roles   pnw-appsec-roles.yaml
```

```sh
topaz stop
topaz config use pnw-appsec-groups
topaz start
```

### Backend

Install the dependencies:

```sh
cd ./todo-node-js
yarn
```

Ensure you have the right `.env` file and run the server in dev mode on port 3001:

```sh
cp .env.example .env
yarn start
```

You should see the server running in `nodemon`.

#### Notes

The `main` branch contains the code that uses Aserto for authorization.

The `broken-access-control` branch contains the code that uses embedded `if`/`switch` statemetns for authorization, and is easy to trick by passing in a malformed payload into the `PUT /todos/:id` route.

### Frontend

Install the dependencies and run the react frontend on port 3000:

```sh
cd ./todo-application
yarn
yarn start
```

At this point, the frontend should show an OIDC login screen. You can login with the following users:
* rick@the-citadel.com - admin
* morty@the-citadel.com - editor
* summer@the-smiths.com - editor
* beth@the-smiths.com - viewer
* jerry@the-smiths.com - viewer

Password for all: `V@erySecre#t123!`

* Rick the admin can do everything to all Todos
* Editors like Morty and Summer can create, edit, and delete their own Todos
* Viewers like Beth and Jerry can only see the todo list

See the [todo app repo](https://github.com/aserto-demo/todo-application) for more information about the Todo app.

## Switching policies

The default policy we built (`policy-todo-roles`) is an attribute-based policy. It uses the `properties.roles[]` array to determine the role of the user.

There are two other policies we can use:
* `policy-todo-groups`: uses relationships to groups instead of roles as properties of the user. This demonstrates using the Topaz built-in function `ds.check` for evaluating the `member` relationship between a subject (`user`) and and object (`group`)
* `policy-todo-rebac`: utilizes the `resource` object type, permissions (`can_read`, `can_write`, `can_delete`), and relationships (`viewer`, `editor`, `owner`) to make the policy truly relationship-based.

### policy-todo-groups

```sh
topaz stop
topaz config use pnw-appsec-groups
topaz start
```

Once Topaz is restarted with the new policy, we'll switch to using group-based access control based on the groups the user is a member of. Behavior is basically the same, but you can change what each user can do by adding or removing them from groups.

### policy-todo-rebac

```sh
topaz stop
topaz config use pnw-appsec-rebac
topaz start
```

One Topaz is restarted with this policy, you can go into the Properties of Jerry (who is a viewer), and give him the "creator" role (in addition to viewer). 

Now Jerry can create Todos, and complete / delete his own Todos. The app code creates and removes relationships in Topaz, and the policy is written to take advantage of this and evaluate permissions (also) based on the relationship between the user and the Todo.
