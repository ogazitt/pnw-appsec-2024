# Fixing Broken Access Control
## PNW AppSec Vancouver BC 2024

* [Session URL](https://sched.co/1ObH0)
* [Deck](https://static.sched.com/hosted_files/owasp2023globalappsecwashin/8a/Global%20AppSec%202023%20-%20Fixing%20Broken%20Access%20Control%20-%20Final.pptx)

## Overview

This monorepo contains three projects:
* a react frontend for a Todo application (./todo-application)
* a node.js backend for the Todo application (./todo-node-js)
* a harness for the Topaz authorizer, which itself includes three different variations of an authorization policy for the Todo backend

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

3. Build the policies locally using the policy CLI:

```sh
make build-todo-roles
make build-todo-groups
make build-todo-rebac
```

4. Configure topaz with a local policy image that uses roles, and start it:

```sh
make configure-todo-roles
```

5. Create the relationship model for the Todo app:

```sh
make manifest
```

6. Import the identity provider data (Citadel users & groups - Rick & Morty):

```sh
make data
```

7. Run the test suite of authorization assertions:

```sh
make test
```

8. Repeat steps 4-7 for the `groups` and `rebac` variations of the policy:

```sh
make configure-todo-groups
make manifest
make data
```

```sh
make configure-todo-rebac
make manifest
make data
```

9. Bring up the topaz console:

```sh
make console
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
