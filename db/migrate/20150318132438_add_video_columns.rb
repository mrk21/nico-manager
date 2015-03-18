class AddVideoColumns < ActiveRecord::Migration
  def change
    change_table :videos do |t|
      t.string    :group_type   , null: false
      t.string    :watch_id     , null: false, comment: 'Use for creating video url, such as "http://www.nicovideo.jp/watch/{watch_id}".'
      t.boolean   :is_deleting  , null: false, default: false
      t.timestamp :created_time , null: false
      t.timestamp :updated_time , null: false
      t.integer   :play_count   , null: false, default: 0
      t.integer   :mylist_count , null: false, default: 0
      t.integer   :comment_count, null: false, default: 0
      t.integer   :seconds
      t.text      :latest_comment
    end
  end
end
