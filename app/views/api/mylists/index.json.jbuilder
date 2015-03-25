json.array!(@mylists) do |mylist|
  json.count mylist.entries.count
  json.extract!(mylist,
    :group_id,
    :name,
    :is_public,
    :sort_order,
    :created_time,
    :description
  )
end
