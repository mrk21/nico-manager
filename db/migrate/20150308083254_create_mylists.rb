class CreateMylists < ActiveRecord::Migration
  def change
    create_table :mylists do |t|
      t.integer :user_id, null: false
      t.integer :group_id
      t.string :name
    end
    
    add_index :mylists, :group_id, unique: true
    add_foreign_key :mylists, :users
    add_foreign_key :entries, :mylists
  end
end
