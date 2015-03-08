class Entry < ActiveRecord::Base
  belongs_to :mylist
  belongs_to :video
  accepts_nested_attributes_for :video
end
