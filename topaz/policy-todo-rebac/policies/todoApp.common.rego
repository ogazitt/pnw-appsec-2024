package todoApp.common

is_member_of(user, group) := x {
  x := ds.check({
    "object_type": "group",
    "object_id": group,
    "relation": "member",
    "subject_type": "user", 
    "subject_id": user.id
  })
}

check(user, permission, todo) := x {
  x := ds.check({
    "object_type": "resource",
    "object_id": todo,
    "relation": permission,
    "subject_type": "user", 
    "subject_id": user.id
  })
}
