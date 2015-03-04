class CreateNicoApiSessions < ActiveRecord::Migration
  def change
    create_table :nico_video_sessions do |t|
      t.string :mail, null: false
      t.string :cookie
    end
    add_index :nico_video_sessions, :mail, unique: true
  end
end
