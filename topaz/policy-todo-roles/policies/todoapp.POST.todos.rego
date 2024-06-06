package todoApp.POST.todos

import future.keywords.in
import input.user

default allowed = false

allowed {
  allowedRoles := {"editor", "admin"}
  some x in allowedRoles
  user.properties.roles[_] == x
}
