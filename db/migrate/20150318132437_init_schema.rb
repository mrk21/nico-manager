class InitSchema < ActiveRecord::Migration
  def up
    
    # These are extensions that must be enabled in order to support this database
    enable_extension "plpgsql"
    
    create_table "entries", force: :cascade do |t|
      t.integer "mylist_id", null: false
      t.integer "video_id",  null: false
    end
    
    add_index "entries", ["mylist_id", "video_id"], name: "index_entries_on_mylist_id_and_video_id", unique: true, using: :btree
    
    create_table "mylists", force: :cascade do |t|
      t.integer "user_id",  null: false
      t.integer "group_id"
      t.string  "name"
    end
    
    add_index "mylists", ["group_id"], name: "index_mylists_on_group_id", unique: true, using: :btree
    
    create_table "sessions", force: :cascade do |t|
      t.integer "user_id",   null: false
      t.string  "cookie",    null: false
      t.string  "api_token", null: false
    end
    
    add_index "sessions", ["user_id"], name: "index_sessions_on_user_id", unique: true, using: :btree
    
    create_table "users", force: :cascade do |t|
      t.integer "niconico_id", null: false
      t.string  "nickname"
      t.string  "avatar"
    end
    
    add_index "users", ["niconico_id"], name: "index_users_on_niconico_id", unique: true, using: :btree
    
    create_table "videos", force: :cascade do |t|
      t.string "video_id",      null: false
      t.string "title"
      t.string "thumbnail_url"
    end
    
    add_index "videos", ["video_id"], name: "index_videos_on_video_id", unique: true, using: :btree
    
    add_foreign_key "entries", "mylists"
    add_foreign_key "entries", "videos"
    add_foreign_key "mylists", "users"
  end

  def down
    raise "Can not revert initial migration"
  end
end
