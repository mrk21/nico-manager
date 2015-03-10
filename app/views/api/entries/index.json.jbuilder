json.array!(@entries) do |entry|
  json.extract! entry.video, :video_id, :title, :thumbnail_url
end
