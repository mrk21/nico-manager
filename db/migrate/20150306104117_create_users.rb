class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :nickname
      t.string :avatar
    end
    add_foreign_key :sessions, :users
  end
end
