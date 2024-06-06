package todoApp.PUT.todos.__id

import future.keywords.in
import input.resource
import input.user

default allowed = false

allowed {
  user.properties.roles[_] == "editor"
  user.id == resource.ownerID
}

allowed {
  user.properties.roles[_] == "evil_genius"
}
