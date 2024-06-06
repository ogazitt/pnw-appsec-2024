# policy-todo

A policy for Aserto's sample "Todo" application. This version uses the `user.properties.roles` attribute to determine the role of the user.

## Directory structure

`src` contains all the policy files.

`src/.manifest` contains the policy roots - in this case, `policies` and `todoApp`. If you change the name of the `package` definitions in the `.rego` files, make sure that the first component of the package name is reflected in this list.

`src/policies` contains the policy modules associated with the peoplefinder sample:

* todo.DELETE.__ownerID.rego - `todoApp.DELETE.todo.__ownerID` - policy for `DELETE /todo/{ownerID}`
* todo.GET.user.__userID.rego - `todoApp.GET.user.__userID` - policy for `GET /user/{userID}`
* todo.POST.rego - `todoApp.POST.todo` - policy for `POST /todo`
* todo.PUT.__ownerID.rego - `todoApp.PUT.todo.__ownerID` - policy for `PUT /todo/{ownerID}`
* todos.GET.rego - `todoApp.GET.todos` - policy for `GET /todos`

## Releasing a new version

`git tag {version} && git push --tags` will invoke the actions to create a new release (a policy bundle that can be delivered to the Aserto authorizer)

e.g. `git tag v0.0.1 && git push --tags` will create a new release with v0.0.1.
