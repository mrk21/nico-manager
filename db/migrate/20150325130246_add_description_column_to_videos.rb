class AddDescriptionColumnToVideos < ActiveRecord::Migration
  def change
    change_table :videos do |t|
      t.string :description
    end
  end
end
