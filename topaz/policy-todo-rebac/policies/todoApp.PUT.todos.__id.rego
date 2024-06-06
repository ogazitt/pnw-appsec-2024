package todoApp.PUT.todos.__id

import input.user
import input.resource
import future.keywords.in
import data.todoApp.common.is_member_of
import data.todoApp.common.check

default allowed = false

allowed {
  check(user, "can_write", resource.id)
}

allowed {
  is_member_of(user, "evil_genius")
}
