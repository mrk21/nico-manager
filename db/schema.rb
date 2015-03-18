# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150318132440) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: :cascade do |t|
    t.integer  "mylist_id",    null: false
    t.integer  "video_id",     null: false
    t.integer  "item_type",    null: false
    t.integer  "item_id",      null: false, comment: "Use for accessing the mylist API."
    t.datetime "created_time", null: false
    t.datetime "updated_time", null: false
    t.text     "description"
  end

  add_index "entries", ["mylist_id", "video_id"], name: "index_entries_on_mylist_id_and_video_id", unique: true, using: :btree

  create_table "mylists", force: :cascade do |t|
    t.integer  "user_id",                      null: false
    t.integer  "group_id"
    t.string   "name"
    t.boolean  "is_public",    default: false, null: false
    t.integer  "sort_order",   default: 1,     null: false
    t.datetime "created_time"
    t.datetime "updated_time"
    t.text     "description"
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
    t.string   "video_id",                       null: false
    t.string   "title"
    t.string   "thumbnail_url"
    t.string   "group_type",                     null: false
    t.string   "watch_id",                       null: false, comment: "Use for creating video url, such as \"http://www.nicovideo.jp/watch/{watch_id}\"."
    t.boolean  "is_deleting",    default: false, null: false
    t.datetime "created_time",                   null: false
    t.datetime "updated_time",                   null: false
    t.integer  "play_count",     default: 0,     null: false
    t.integer  "mylist_count",   default: 0,     null: false
    t.integer  "comment_count",  default: 0,     null: false
    t.integer  "seconds"
    t.text     "latest_comment"
  end

  add_index "videos", ["video_id"], name: "index_videos_on_video_id", unique: true, using: :btree

  add_foreign_key "entries", "mylists"
  add_foreign_key "entries", "videos"
  add_foreign_key "mylists", "users"
end
