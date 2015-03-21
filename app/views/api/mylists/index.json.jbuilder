json.array!(@mylists) do |mylist|
  json.extract!(mylist,
    :group_id,
    :name,
    :is_public,
    :sort_order,
    :created_time,
    :description
  )
end
