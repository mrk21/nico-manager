class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :niconico_id, null: false
      t.string :nickname
      t.string :avatar
    end
    add_index :users, :niconico_id, unique: true
  end
end
