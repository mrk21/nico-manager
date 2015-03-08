class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :mylist_id, null: false
      t.integer :video_id, null: false
    end
    
    add_index :entries, [:mylist_id, :video_id], unique: true
  end
end
