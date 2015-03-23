json.array!(@entries) do |entry|
  json.extract!(entry.mylist, :group_id)
  
  json.extract!(entry,
    :item_type,
    :item_id,
    :created_time,
    :description
  )
  
  json.video do
    json.extract!(entry.video,
      :video_id,
      :title,
      :thumbnail_url,
      :group_type,
      :watch_id,
      :is_deleting,
      :created_time,
      :play_count,
      :mylist_count,
      :comment_count,
      :seconds,
      :latest_comment
    )
  end
end
