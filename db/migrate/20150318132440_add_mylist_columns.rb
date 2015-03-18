class AddMylistColumns < ActiveRecord::Migration
  def change
    change_table :mylists do |t|
      t.boolean   :is_public   , null: false, default: false
      t.integer   :sort_order  , null: false, default: 1
      t.timestamp :created_time
      t.timestamp :updated_time
      t.text      :description
    end
  end
end
