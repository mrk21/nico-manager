json.array!(@entries) do |entry|
  json.mylist do
    json.extract!(entry.mylist, :group_id)
    json.extract!(entry.mylist, :name)
  end
  
  json.entry do
    json.extract!(entry,
      :item_type,
      :item_id,
      :created_time,
      :description
    )
  end
  
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
      :latest_comment,
    )
    json.description strip_tags(entry.video.description)
  end
end
