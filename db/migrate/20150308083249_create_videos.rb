class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :video_id, null: false
      t.string :title
      t.string :thumbnail_url
    end
    
    add_index :videos, :video_id, unique: true
    add_foreign_key :entries, :videos
  end
end
