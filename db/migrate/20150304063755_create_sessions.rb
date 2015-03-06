class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions, id: false do |t|
      t.integer :id, primary_key: true
      t.string :cookie, null: false
      t.string :api_token, null: false
    end
  end
end
