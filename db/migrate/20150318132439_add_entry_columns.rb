class AddEntryColumns < ActiveRecord::Migration
  def change
    change_table :entries do |t|
      t.integer   :item_type   , null: false
      t.integer   :item_id     , null: false, comment: 'Use for accessing the mylist API.'
      t.timestamp :created_time, null: false
      t.timestamp :updated_time, null: false
      t.text      :description
    end
  end
end
