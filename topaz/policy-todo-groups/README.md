# policy-todo-groups

A policy for Aserto's sample "Todo" application. This version uses the `ds.check` call to check group membership, instead of using the `user.properties.roles` attribute on the user.

## Directory structure

`src` contains all the policy files.

`src/.manifest` contains the policy roots - in this case, `policies` and `todoApp`. If you change the name of the `package` definitions in the `.rego` files, make sure that the first component of the package name is reflected in this list.

`src/policies` contains the policy modules associated with the peoplefinder sample:

* todoApp.DELETE.todos.__id.rego - `todoApp.DELETE.todos.__id` - policy for `DELETE /todos/{id}`
* todoApp.GET.todos.rego - `todoApp.GET.todos` - policy for `GET /todos`
* todoApp.GET.users.__userID.rego - `todoApp.GET.users.__userID` - policy for `GET /users/{userID}`
* todoApp.POST.todos.rego - `todoApp.POST.todos` - policy for `POST /todos`
* todoApp.PUT.todos.__id.rego - `todoApp.PUT.todos.__id` - policy for `PUT /todos/{id}`

## Releasing a new version

`git tag {version} && git push --tags` will invoke the actions to create a new release (a policy bundle that can be delivered to the Aserto authorizer)

e.g. `git tag v0.0.1 && git push --tags` will create a new release with v0.0.1.
